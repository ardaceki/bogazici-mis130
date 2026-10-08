import { WebR, ChannelType } from 'webr';
import { explainCheck } from './feedback.js';

export function fromR(node) {
  if (!node || typeof node !== 'object' || !('type' in node)) return node;
  if (node.type === 'null') return null;
  if (node.type === 'list') {
    const values = node.values.map(fromR);
    return node.names?.every(Boolean)
      ? Object.fromEntries(node.names.map((name, i) => [name, values[i]]))
      : values;
  }
  return node.values ?? node.value;
}
const snapshotCode = `local({
  lesson <- .lesson
  nms <- ls(envir=lesson, all.names=FALSE)
  lapply(head(nms, 40), function(nm) {
    x <- get(nm, envir=lesson, inherits=FALSE)
    list(name=nm, class=paste(class(x), collapse=" / "),
      preview=paste(utils::capture.output(str(x, max.level=0)), collapse=" "),
      dimensions=as.integer(dim(x)), rows=if(length(dim(x))==2) rownames(x) else NULL, columns=if(length(dim(x))==2) colnames(x) else NULL,
      cells=if (is.data.frame(x)) lapply(x, function(y) as.character(head(y, 12))) else if(is.atomic(x)) as.character(head(as.vector(x), 144)) else character(),
      length=length(x))
  })
})`;

export class RRuntime {
  constructor(onState) {
    this.onState = onState;
    this.generation = 0;
    this.ready = null;
    this.engine = null;
    this.env = null;
    this.context = null;
    this.sessionContext = null;
    this.trusted = null;
    this.runShelter = null;
  }
  async init() {
    if (this.ready) return this.ready;
    const generation = this.generation;
    this.onState('loading');
    const engine = new WebR({
      baseUrl: 'https://webr.r-wasm.org/v0.6.0/',
      channelType: ChannelType.PostMessage,
      interactive: false,
    });
    this.engine = engine;
    this.ready = (async () => {
      await engine.init();
      if (generation !== this.generation) throw new Error('R session restarted.');
      // Publish a session only after all asynchronous allocations still belong to it.
      const ensureCurrent = () => {
        if (generation !== this.generation) throw new Error('R session restarted.');
      };
      const sessionContext = await new engine.Shelter();
      ensureCurrent();
      const trusted = await sessionContext.evalR(
        'base::new.env(parent=base::parent.env(base::globalenv()))',
      );
      ensureCurrent();
      await engine.evalRVoid('.initial_options <- base::options()', { env: trusted });
      ensureCurrent();
      const context = await new engine.Shelter();
      ensureCurrent();
      const runShelter = await new engine.Shelter();
      ensureCurrent();
      this.sessionContext = sessionContext;
      this.trusted = trusted;
      this.context = context;
      this.runShelter = runShelter;
      this.onState('ready');
      return engine;
    })().catch((error) => {
      if (generation === this.generation) {
        this.ready = null;
        engine.close();
        this.engine = null;
        this.context = null;
        this.sessionContext = null;
        this.trusted = null;
        this.runShelter = null;
        this.onState('error', error.message);
      }
      throw error;
    });
    return this.ready;
  }
  async resetTask(task) {
    const generation = this.generation;
    const engine = await this.init();
    const ensureCurrent = () => {
      if (generation !== this.generation) throw new Error('R session restarted.');
    };
    ensureCurrent();
    const context = this.context,
      runShelter = this.runShelter;
    await context.purge();
    ensureCurrent();
    // R's source/save.image defaults normally target the console's global workspace.
    // Redirect those defaults to this lesson workspace, without exposing helpers as
    // student objects. Explicit source(local=...) and save.image arguments still work.
    const env = await context.evalR(`base::local({
      helpers <- base::new.env(parent=base::globalenv())
      lesson <- base::new.env(parent=helpers)
      helpers$source <- function(file, local=base::parent.frame(), ...) {
        base::source(file, local=local, ...)
      }
      image_scope <- base::new.env(parent=base::baseenv())
      image_scope$.GlobalEnv <- lesson
      save_image <- base::save.image
      base::environment(save_image) <- image_scope
      helpers$save.image <- save_image
      lesson
    })`);
    ensureCurrent();
    this.env = env;
    await engine.evalRVoid(
      'base::rm(list=base::ls(envir=base::globalenv(), all.names=TRUE), envir=base::globalenv())',
    );
    ensureCurrent();
    await engine.evalRVoid(
      `base::local({
        extra <- base::setdiff(base::names(base::options()), base::names(.initial_options))
        if (base::length(extra)) {
          removed <- base::rep(base::list(NULL), base::length(extra))
          base::names(removed) <- extra
          base::options(removed)
        }
        base::options(.initial_options)
      })`,
      { env: this.trusted },
    );
    ensureCurrent();
    // A task owns its working folder. Navigation recreates files and removes previous user files.
    await engine.evalRVoid(
      'setwd("/home/web_user"); if(dir.exists("workshop")) unlink("workshop", recursive=TRUE); dir.create("workshop"); setwd("workshop")',
    );
    ensureCurrent();
    for (const [name, content] of Object.entries(task.files || {})) {
      await engine.FS.writeFile(
        `/home/web_user/workshop/${name}`,
        new TextEncoder().encode(content),
      );
      ensureCurrent();
    }
    if (task.setup) await runShelter.captureR(task.setup, { env, captureGraphics: false });
    ensureCurrent();
    await runShelter.purge();
    ensureCurrent();
  }
  async run(code, task, shouldCheck = false) {
    const generation = this.generation;
    const ensureCurrent = () => {
      if (generation !== this.generation) throw new Error('R session restarted.');
    };
    await this.init();
    ensureCurrent();
    if (!this.env) await this.resetTask(task);
    ensureCurrent();
    const env = this.env;
    const shelter = this.runShelter;
    let response;
    try {
      response = await shelter.captureR(code, {
        env,
        withAutoprint: true,
        throwJsException: false,
        captureGraphics: { width: 640, height: 420 },
      });
      ensureCurrent();
      const error = response.output.find((item) => item.type === 'error');
      await env.bind('.workshop_code', code);
      if (!error) await env.bind('.workshop_result', response.result);
      // Check data in a separate environment. Standard function bindings take precedence
      // over same-named student functions, while ordinary objects remain available to
      // exists(..., inherits=FALSE) and value checks. Student functions stay inspectable.
      const checker = await shelter.evalR(
        `base::local({
          standard <- base::parent.env(base::globalenv())
          checks <- base::new.env(parent=standard)
          for (name in base::ls(envir=.lesson, all.names=TRUE)) {
            value <- base::get(name, envir=.lesson, inherits=FALSE)
            if (base::is.function(value) && base::exists(name, envir=standard, mode="function"))
              value <- base::get(name, envir=standard, mode="function")
            base::assign(name, value, envir=checks)
          }
          checks
        })`,
        { env: await this.inspectorEnvironment(shelter, env) },
      );
      await checker.bind('.lesson', env);
      let checks = [];
      if (shouldCheck && !error) {
        for (const validation of task.checks || []) {
          const result = await shelter.evalR(
            `isTRUE(tryCatch({${validation.expr}}, error=function(e) FALSE))`,
            { env: checker },
          );
          const passed = (await result.toArray())[0] === true;
          let diagnostic = null;
          const target = validation.target || validation.targets?.[0];
          if (!passed && target) {
            const wanted = validation.expected || 'NULL';
            const diag = await shelter.evalR(
              `local({
            lesson <- .lesson
            rootExists <- exists(${JSON.stringify(target)},envir=lesson,inherits=FALSE)
            root <- if(rootExists) get(${JSON.stringify(target)},envir=lesson,inherits=FALSE) else NULL
            found <- rootExists ${validation.path ? `&& ${JSON.stringify(validation.path)} %in% names(root)` : ''}
            wanted <- ${wanted}
            actual <- if(found) ${validation.path ? `root[[${JSON.stringify(validation.path)}]]` : 'root'} else NULL
            describe <- function(x){
              if(length(x)==0) "no values" else if(is.character(x)) paste(head(encodeString(x,quote='"'),8),collapse=", ") else if(is.atomic(x)) paste(head(as.character(x),8),collapse=", ") else paste(head(utils::capture.output(str(x,max.level=0)),1),collapse=" ")
            }
            list(exists=found,rootExists=rootExists,availableNames=names(root),actual=describe(actual),expected=describe(wanted),actualType=typeof(actual),expectedType=typeof(wanted),
              actualShape=as.integer(dim(actual)),expectedShape=as.integer(dim(wanted)),actualLength=length(actual),expectedLength=length(wanted),
              hasNA=if(is.atomic(actual)) anyNA(actual) else FALSE,expectedHasNA=if(is.atomic(wanted)) anyNA(wanted) else FALSE,
              resultMatches=exists(".workshop_result",envir=lesson,inherits=FALSE) && (${validation.resultExpr || 'FALSE'}))
          })`,
              { env: checker },
            );
            diagnostic = fromR(await diag.toJs());
          }
          checks.push({ ...validation, passed, diagnostic });
        }
      }
      let objects = [];
      try {
        const inspector = await this.inspectorEnvironment(shelter, env);
        const snap = await shelter.evalR(snapshotCode, { env: inspector });
        objects = fromR(await snap.toJs());
      } catch {
        // A user-defined object/print method may fail; preserve its successful output.
        response.output.push({ type: 'warning', data: 'Some objects could not be inspected.' });
      }
      for (const validation of checks) {
        if (!validation.passed)
          validation.feedback = explainCheck(validation, validation.diagnostic, objects || []);
      }
      const images = response.images;
      const output = [];
      for (const item of response.output) {
        let data = item.data;
        if (data?.get && ['error', 'warning', 'message'].includes(item.type)) {
          const message = await data.get('message');
          data = { message: await message.toArray() };
        } else if (data?.toJs) data = fromR(await data.toJs());
        const message = data?.message;
        const text =
          typeof data === 'string'
            ? data
            : message
              ? Array.isArray(message)
                ? message.join(' ')
                : String(message)
              : JSON.stringify(data);
        output.push({ type: item.type, text: text ?? '' });
      }
      ensureCurrent();
      return { output, objects, checks, error: !!error, images };
    } catch (error) {
      // Results returned to the UI transfer bitmap ownership; aborted results do not.
      for (const image of response?.images || []) image.close?.();
      throw error;
    } finally {
      // A stopped worker already releases its R objects. Never purge a newer session.
      if (generation === this.generation) await shelter.purge();
    }
  }
  async inspectorEnvironment(shelter, lesson) {
    const inspector = await shelter.evalR(
      'base::new.env(parent=base::parent.env(base::globalenv()))',
    );
    await inspector.bind('.lesson', lesson);
    return inspector;
  }
  stop() {
    this.generation++;
    this.engine?.close();
    this.engine = null;
    this.ready = null;
    this.env = null;
    this.context = null;
    this.sessionContext = null;
    this.trusted = null;
    this.runShelter = null;
    this.onState('idle');
  }
}
