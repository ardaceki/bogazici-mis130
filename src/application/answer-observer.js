// Observe actual R execution without interpreting loops or parsing printed
// numbers. Function hooks live in the lesson's helper environment, not its
// workspace. Native R retains control-flow, scope and visibility semantics.
export function observerCode(task) {
  const observed = task.observe?.length
    ? `c(${task.observe.map((name) => JSON.stringify(name)).join(',')})`
    : 'character()';
  const files = Object.entries(task.files || {})
    .map(([name, content]) => `${JSON.stringify(name)}=${JSON.stringify(content)}`)
    .join(',');
  const sourceValues = task.sourceValues?.length
    ? `c(${task.sourceValues.map((name) => JSON.stringify(name)).join(',')})`
    : 'character()';
  return `base::local({
    # webR itself captures output with sinks. Only additional student sinks
    # suppress displayed-answer evidence.
    initial_sinks <- base::sink.number(type="output")
    helpers <- base::parent.env(.lesson)
    base_namespace <- base::asNamespace("base")
    printer_names <- base::ls(base_namespace,all.names=TRUE)
    printer_names <- printer_names[printer_names=="print" | base::startsWith(printer_names,"print.")]
    printer_names <- printer_names[base::vapply(printer_names,function(name) {
      method <- base::get(name,envir=base_namespace,inherits=FALSE)
      base::is.function(method) && base::identical(base::names(base::formals(method))[1],"x")
    },logical(1))]
    original_printers <- base::lapply(printer_names,function(name) base::get(name,envir=base_namespace,inherits=FALSE))
    base::names(original_printers) <- printer_names
    saved <- base::lapply(c(printer_names, "cat", "source"), function(name) {
      list(name=name, exists=base::exists(name,envir=helpers,inherits=FALSE),
        value=base::get(name,envir=helpers,inherits=TRUE))
    })
    .capture$restore <- function() {
      while (base::sink.number(type="output") > initial_sinks) base::sink()
      for (item in saved) {
        if (item$exists) base::assign(item$name,item$value,envir=helpers)
        else if (base::exists(item$name,envir=helpers,inherits=FALSE)) base::rm(list=item$name,envir=helpers)
      }
    }
    base::on.exit(.capture$restore())
    observed <- ${observed}
    expected_files <- list(${files})
    source_values <- ${sourceValues}
    add_output <- function(value) {
      if (base::sink.number(type="output")==initial_sinks)
        .capture$outputs[base::length(.capture$outputs)+1L] <- base::list(value)
    }
    record_state <- function() {
      if (!base::length(observed)) return(base::invisible(NULL))
      state <- base::lapply(observed, function(name) {
        found <- base::exists(name,envir=.lesson,inherits=FALSE)
        base::list(exists=found,value=if(found) base::get(name,envir=.lesson,inherits=FALSE) else NULL)
      })
      base::names(state) <- observed
      states <- .capture$states
      if (!base::length(states) || !base::identical(state,states[[base::length(states)]]))
        .capture$states[base::length(states)+1L] <- base::list(state)
      base::invisible(NULL)
    }
    print_depth <- 0L
    printers <- base::lapply(original_printers,function(method) {
      base::force(method)
      function(x, ...) {
        outer <- print_depth==0L
        print_depth <<- print_depth+1L
        base::on.exit(print_depth <<- print_depth-1L)
        # Delegate to this exact method: print.default must not dispatch through
        # generic print, and method arguments/return visibility stay native.
        result <- base::withVisible(method(x, ...))
        if(outer) add_output(x)
        if(result$visible) result$value else base::invisible(result$value)
      }
    })
    printed <- printers[["print"]]
    observed_printer <- function(method) {
      for(name in printer_names) if(base::identical(method,original_printers[[name]])) return(printers[[name]])
      method
    }
    written <- function(..., file="", sep=" ", fill=FALSE, labels=NULL, append=FALSE) {
      values <- list(...)
      base::cat(...,file=file,sep=sep,fill=fill,labels=labels,append=append)
      if (base::identical(file, "") || base::identical(file, base::stdout())) {
        for (value in values) {
          if (base::is.character(value)) value <- value[base::nzchar(base::trimws(value))]
          if (base::length(value)) add_output(value)
        }
      }
      base::invisible(NULL)
    }
    sourced <- function(file, local=base::parent.frame(), ...) {
      if (base::isTRUE(local)) local <- base::parent.frame()
      target <- if(base::is.environment(local)) local else base::globalenv()
      # base::source(local=FALSE) evaluates in the native global environment;
      # isolated local=env forms can also bypass the lesson's helper parent.
      # Observe standard output there without replacing student functions.
      target_saved <- list()
      for (name in c(printer_names,"cat")) {
        standard <- if(name=="cat") base::cat else original_printers[[name]]
        if(base::identical(base::get(name,envir=target,mode="function",inherits=TRUE),standard)) {
          target_saved[[name]] <- list(exists=base::exists(name,envir=target,inherits=FALSE),
            value=if(base::exists(name,envir=target,inherits=FALSE)) base::get(name,envir=target,inherits=FALSE) else NULL)
          base::assign(name,if(name=="cat") written else printers[[name]],envir=target)
        }
      }
      base::on.exit({
        for(name in base::names(target_saved)) {
          old <- target_saved[[name]]
          if(old$exists) base::assign(name,old$value,envir=target)
          else if(base::exists(name,envir=target,inherits=FALSE)) base::rm(list=name,envir=target)
        }
      },add=TRUE)
      path <- base::tryCatch({
        name <- if(base::inherits(file,"connection")) base::summary(file)$description else file
        base::normalizePath(name,mustWork=TRUE)
      }, error=function(e) "")
      original <- FALSE
      for (name in base::names(expected_files)) {
        expected_path <- base::normalizePath(name,mustWork=FALSE)
        if (base::identical(path,expected_path)) {
          original <- base::tryCatch(base::identical(base::parse(text=base::readLines(path,warn=FALSE),keep.source=FALSE),
            base::parse(text=expected_files[[name]],keep.source=FALSE)),error=function(e) FALSE)
        }
      }
      result <- base::withVisible(base::source(file,local=local,...))
      values <- base::lapply(source_values,function(name) {
        if(base::exists(name,envir=target,inherits=FALSE)) base::get(name,envir=target,inherits=FALSE) else NULL
      })
      base::names(values) <- source_values
      .capture$sources[base::length(.capture$sources)+1L] <- base::list(list(path=path,original=original,values=values))
      record_state()
      if (result$visible) result$value else base::invisible(result$value)
    }
    base_sourced <- function(file, local=FALSE, ...) {
      if (base::isTRUE(local)) local <- base::parent.frame()
      sourced(file,local=local,...)
    }
    for(name in printer_names) base::assign(name,printers[[name]],envir=helpers)
    base::assign("cat",written,envir=helpers)
    base::assign("source",sourced,envir=helpers)
    checkpoint <- base::as.call(base::list(record_state))
    statement <- function(expr) {
      base::as.call(base::list(base::as.name("{"),checkpoint,transform(expr)))
    }
    transform <- function(expr) {
      if (!base::is.call(expr)) return(expr)
      # Quoted code and formula data must remain data, not instrumentation.
      head <- expr[[1]]
      head_name <- if(base::is.symbol(head)) base::as.character(head)
        else if(base::is.call(head) && base::identical(head[[1]],base::as.name("::")) && base::identical(head[[2]],base::as.name("base"))) base::as.character(head[[3]]) else ""
      if (head_name %in% c("quote","substitute","expression","bquote","~")) return(expr)
      if(base::identical(head,base::as.name("::")) || base::identical(head,base::as.name(":::"))) {
        if(base::identical(expr[[2]],base::as.name("base")) && base::as.character(expr[[3]]) %in% printer_names)
          return(printers[[base::as.character(expr[[3]])]])
      }
      if (base::identical(expr,base::quote(base::cat))) return(written)
      if (base::identical(expr,base::quote(base::source))) return(base_sourced)
      parts <- base::as.list(expr)
      if (base::identical(head,base::as.name("{"))) {
        result <- base::list(head)
        for (child in parts[-1L]) result <- base::c(result,base::list(checkpoint,transform(child)))
        return(base::as.call(result))
      }
      if (base::is.symbol(head) && base::as.character(head) %in% c("<-","=","<<-")) {
        parts[[3]] <- transform(parts[[3]])
      } else if (base::is.symbol(head) && base::as.character(head) %in% c("->","->>")) {
        parts[[2]] <- transform(parts[[2]])
      } else if (base::identical(head,base::as.name("function"))) {
        parts[[3]] <- statement(parts[[3]])
      } else if (base::identical(head,base::as.name("for"))) {
        parts[[3]] <- transform(parts[[3]])
        parts[[4]] <- statement(parts[[4]])
      } else if (base::identical(head,base::as.name("while"))) {
        parts[[2]] <- transform(parts[[2]])
        parts[[3]] <- statement(parts[[3]])
      } else if (base::identical(head,base::as.name("repeat"))) {
        parts[[2]] <- statement(parts[[2]])
      } else if (base::identical(head,base::as.name("if"))) {
        parts[[2]] <- transform(parts[[2]])
        parts[[3]] <- statement(parts[[3]])
        if(base::length(parts)==4L) parts[[4]] <- statement(parts[[4]])
      } else {
        for (i in base::seq_along(parts)) {
          # Missing arguments (e.g. m[, 2]) are legal R syntax.
          if (!base::identical(parts[[i]],base::quote(expr=))) parts[[i]] <- transform(parts[[i]])
        }
        # A standard method obtained through get()/getS3method() before this
        # statement is still a standard printer, even under an arbitrary alias.
        if(base::is.symbol(head)) {
          method <- base::tryCatch(base::get(base::as.character(head),envir=.lesson,mode="function",inherits=TRUE),error=function(e) NULL)
          if(!base::is.null(method)) parts[[1]] <- if(base::identical(observed_printer(method),method)) parts[[1]] else observed_printer(method)
        }
      }
      base::as.call(parts)
    }
    expressions <- base::parse(text=.code)
    last <- list(value=NULL,visible=FALSE)
    record_state()
    for (expression in expressions) {
      last <- base::withVisible(base::eval(transform(expression),envir=.lesson))
      record_state()
      if (last$visible) {
        add_output(last$value)
        base::print(last$value)
      }
    }
    base::invisible(last$value)
  })`;
}
