import { query, escapeHtml, renderInline, renderParagraphs } from './html.js';
import { modules, tasks, findTask } from '../content/index.js';
import { guided } from '../content/guided.js';
import { answerContract, choiceMistakes } from '../feedback.js';
import { createCodeEditor } from './editor.js';
import { reveal } from '../motion.js';

export function createLessonView({
  navigation,
  results,
  onBeforeRender,
  onRun,
  onStop,
  onStatus,
  onPrepare,
}) {
  let current = null,
    editor = null,
    hintIndex = 0,
    solutionOpen = false,
    stepIndex = 0;
  const drafts = new Map(); // Drafts last only until the page is reloaded.
  function saveDraft() {
    if (editor && current)
      drafts.set(`${current.id}:${current.stageIndex || 0}`, editor.state.doc.toString());
    else if (current?.kind === 'written')
      drafts.set(`${current.id}:0`, query('#written-answer').value);
  }
  function renderTask(id, stage = 0) {
    onBeforeRender();
    const startEl = query('#start-screen');
    if (startEl) startEl.hidden = true;
    const menuToggle = query('.menu-toggle');
    if (menuToggle) menuToggle.hidden = false;
    query('.lesson-header').hidden = false;
    query('.workspace').hidden = false;
    query('#source-dialog')?.close();
    query('#review-panel').replaceChildren();
    query('#review-panel').hidden = true;
    const base = findTask(id) || tasks[0];
    const stages = base.mode === 'learn' ? guided[base.id] : null;
    stepIndex = stages ? Math.min(stage, stages.length - 1) : 0;
    const task = stages ? { ...base, ...stages[stepIndex], stageCount: stages.length } : base;
    saveDraft();
    current = { ...task, stageIndex: stepIndex };
    const { mode, moduleId } = task;
    hintIndex = 0;
    solutionOpen = false;
    const mod = modules.find((m) => m.id === moduleId);
    const group = mod[mode];
    const pos = group.findIndex((t) => t.id === task.id);
    editor?.destroy();
    editor = null;
    document.title = `${task.title} · MIS 130`;
    query('#module-title').textContent = mod.title;
    query('#task-position').textContent = task.stageCount
      ? `Step ${stepIndex + 1} of ${task.stageCount}`
      : `Exercise ${pos + 1} of ${group.length}`;
    query('#task-heading').textContent = task.title;
    const contract = answerContract(task);
    query('#task-body').innerHTML = /* HTML */ `
      <div class="prompt">${renderParagraphs(task.prompt)}</div>
      <details class="answer-contract">
        <summary>How to answer</summary>
        <p>${renderInline(contract.summary)}</p>
        <p>${renderInline(contract.detail)}</p>
      </details>
      ${
        task.concept || task.details
          ? /* HTML */ `
              <details class="context-details">
                <summary>What does this mean?</summary>
                ${task.concept ? renderParagraphs(task.concept) : ''}${task.details ? renderParagraphs(task.details) : ''}
              </details>
            `
          : ''
      }
    `;
    results.reset();
    if (task.kind === 'code') {
      query('.results-pane').hidden = true;
      query('#answer-area').innerHTML = /* HTML */ `
        <div class="editor-shell">
          <div id="editor"></div>
          <div class="editor-toolbar">
            <div>
              <button class="secondary-button" id="stop-code" hidden>Stop</button>
              <button class="primary-button" id="run-code">Run</button>
            </div>
          </div>
        </div>
        <p class="manual-note" id="editor-shortcuts">
          Ctrl / ⌘ + Enter runs code. Tab indents; press Escape, then Tab to leave the editor.
        </p>
        ${
          task.manual
            ? /* HTML */ `
                <p class="manual-note">${renderInline(task.manual)}</p>
              `
            : ''
        }
      `;
      editor = createCodeEditor({
        parent: query('#editor'),
        code: drafts.get(`${task.id}:${stepIndex}`) ?? task.starter,
        onChange: () => {
          resetCallToAction();
          query('#feedback').replaceChildren();
        },
        onRun: () => onRun(true),
      });
      query('#run-code').onclick = () => onRun(true);
      query('#stop-code').onclick = onStop;
    } else if (task.kind === 'choice') {
      query('.results-pane').hidden = true;
      query('#answer-area').innerHTML = /* HTML */ `
        ${
          task.snippet
            ? /* HTML */ `
                <pre class="question-code"><code>${escapeHtml(task.snippet)}</code></pre>
              `
            : ''
        }
        <fieldset class="choices">
          <legend class="sr-only">Choose an answer</legend>
          ${task.options
            .map(
              (option, i) => /* HTML */ `
                <label class="choice">
                  <input type="radio" name="answer" value="${i}" />
                  <span>${escapeHtml(option)}</span>
                </label>
              `,
            )
            .join('')}
        </fieldset>
        <button class="primary-button" id="check-choice">Check answer</button>
      `;
      query('#check-choice').onclick = () => {
        const selected = query('input[name="answer"]:checked');
        if (!selected) {
          feedback('neutral', 'Choose an answer first.');
          return;
        }
        const selection = Number(selected.value);
        const success = selection === task.correct;
        feedback(
          success ? 'success' : 'error',
          success ? 'Correct.' : 'Try again.',
          success
            ? task.explanation
            : (choiceMistakes[task.id]?.[selection] ||
                'Read the question again and compare your choice with the code.') +
                ' Choose another answer, then click Check answer.',
        );
      };
    } else {
      query('.results-pane').hidden = true;
      query('#answer-area').innerHTML = /* HTML */ `
        <label class="written-label" for="written-answer">Your answer</label>
        <textarea
          id="written-answer"
          rows="6"
          placeholder="Explain in your own words, or write R code."
        ></textarea>
        <p class="manual-note">Self-review: compare your reasoning with the suggested answer.</p>
        <button class="secondary-button" id="compare-answer">Compare answer</button>
      `;
      query('#written-answer').value = drafts.get(`${task.id}:0`) ?? '';
      query('#compare-answer').onclick = () => {
        solutionOpen = true;
        support();
        query('#solution')?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'instant'
            : 'smooth',
          block: 'nearest',
        });
      };
    }
    support();
    const next =
      task.stageCount && stepIndex < task.stageCount - 1
        ? /* HTML */ `
            <button id="next-step" class="next">Skip this step →</button>
          `
        : pos < group.length - 1
          ? /* HTML */ `
              <a href="#${group[pos + 1].id}" class="next">Skip →</a>
            `
          : mode !== 'exam'
            ? /* HTML */ `
                <a href="#${mod[mode === 'learn' ? 'practice' : 'exam'][0].id}" class="next">
                  ${mode === 'learn' ? 'PS / Lab' : 'Paper practice'} →
                </a>
              `
            : /* HTML */ `
                <a href="#${mod.learn[0].id}" class="next">Back to Learn →</a>
              `;
    const prev =
      stepIndex > 0
        ? '<button id="previous-step" class="previous">← Back</button>'
        : pos > 0
          ? /* HTML */ `
              <a href="#${group[pos - 1].id}" class="previous">← Back</a>
            `
          : '<a href="#" class="previous">← Menu</a>';
    query('.task-footer').innerHTML = `${prev}${next}`;
    const moveStep = (stage) => {
      renderTask(task.id, stage);
      query('#task-heading').focus({ preventScroll: true });
    };
    if (query('#next-step')) query('#next-step').onclick = () => moveStep(stepIndex + 1);
    if (query('#previous-step')) query('#previous-step').onclick = () => moveStep(stepIndex - 1);

    navigation.render(current);
    onStatus();
    results.position();
    reveal([query(`#task-heading`), query('#task-body'), query('#answer-area')], { stagger: 25 });
    if (location.hash.slice(1) !== task.id) window.history.replaceState(null, '', `#${task.id}`);
    // Prepare the shared interpreter while the student reads; never execute their code here.
    // A failed warm-up remains retryable through Run and must not interrupt the lesson.
    if (task.kind === 'code') onPrepare();
  }
  function support() {
    const focusedControl = ['hint-button', 'solution-button'].includes(document.activeElement?.id)
      ? document.activeElement.id
      : null;
    const newSolution = solutionOpen && !query('#solution');
    query('#review-panel').replaceChildren();
    const solution =
      current.kind === 'written'
        ? current.answer
        : current.kind === 'choice'
          ? current.options[current.correct]
          : current.solution;
    query('#task-support').innerHTML = /* HTML */ `
      <div class="task-help">
        ${
          current.desktop
            ? /* HTML */ `
                <details class="desktop-task">
                  <summary>Try this in RStudio</summary>
                  ${renderParagraphs(current.desktop)}
                </details>
              `
            : ''
        }
        <div class="support-actions">
          <button class="text-button" id="hint-button">
            ${hintIndex ? (hintIndex < (current.hints?.length || 0) ? 'Next hint' : 'Hints shown') : 'Hint'}
          </button>
          <button class="text-button" id="solution-button">
            ${solutionOpen ? 'Hide solution' : 'Show solution'}
          </button>
        </div>
        <div id="hints">
          ${(current.hints || [])
            .slice(0, hintIndex)
            .map(
              (hint, i) => /* HTML */ `
                <div class="hint">
                  <span>${i + 1}</span>
                  <p>${renderInline(hint).replace(/\n/g, '<br>')}</p>
                </div>
              `,
            )
            .join('')}
        </div>
        ${
          solutionOpen
            ? /* HTML */ `
                <section id="solution" class="solution${newSolution ? ' is-new' : ''}">
                  <h3>${current.kind === 'written' ? 'Suggested answer' : 'One solution'}</h3>
                  ${
                    current.kind === 'code' || current.kind === 'written'
                      ? /* HTML */ `
                          <pre><code>${escapeHtml(solution)}</code></pre>
                        `
                      : /* HTML */ `
                          <p>${escapeHtml(solution)}</p>
                        `
                  }${current.kind !== 'written' ? renderParagraphs(current.explanation) : ''}${current.kind === 'code' ? '<button class="secondary-button" id="load-solution">Use in editor</button>' : ''}
                </section>
              `
            : ''
        }
      </div>
    `;
    query('#hint-button').onclick = () => {
      const previous = hintIndex;
      hintIndex = Math.min(hintIndex + 1, current.hints?.length || 0);
      support();
      if (hintIndex > previous) reveal([query('#hints .hint:last-child')]);
    };
    query('#solution-button').onclick = () => {
      solutionOpen = !solutionOpen;
      support();
    };
    results.position();
    if (query('#load-solution'))
      query('#load-solution').onclick = () => {
        setEditor(current.solution);
        feedback(
          'neutral',
          'Solution loaded.',
          'Run it, then change an input to explore what happens.',
        );
      };
    if (focusedControl) query('#' + focusedControl)?.focus({ preventScroll: true });
  }
  function setEditor(text) {
    editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: text } });
  }
  function resetCallToAction() {
    const next = query('.task-footer .next');
    if (next) {
      next.classList.remove('primary-button');
      next.textContent =
        current?.stageCount && stepIndex < current.stageCount - 1 ? 'Skip this step →' : 'Skip →';
    }
    query('#run-code')?.classList.remove('secondary-button');
    query('#run-code')?.classList.add('primary-button');
  }
  function feedback(type, title, detail = '') {
    if (type !== 'success') resetCallToAction();
    const next = query('.task-footer .next');
    if (type === 'success' && next) {
      next.classList.add('primary-button');
      next.textContent = 'Continue →';
      query('#run-code')?.classList.remove('primary-button');
      query('#run-code')?.classList.add('secondary-button');
    }
    query('#feedback').innerHTML = /* HTML */ `
      <div class="feedback ${type}">
        <strong>${escapeHtml(title)}</strong>
        ${
          detail
            ? /* HTML */ `
                <p>${renderInline(detail)}</p>
              `
            : ''
        }
      </div>
    `;
  }

  function deactivate() {
    saveDraft();
    editor?.destroy();
    editor = null;
    current = null;
    solutionOpen = false;
  }
  return {
    render: renderTask,
    deactivate,
    setEditor,
    feedback,
    clearFeedback: () => query('#feedback').replaceChildren(),
    get current() {
      return current;
    },
    get solutionOpen() {
      return solutionOpen;
    },
    get code() {
      return editor ? editor.state.doc.toString() : null;
    },
  };
}
