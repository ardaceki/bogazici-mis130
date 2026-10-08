import { query, escapeHtml } from './html.js';
import { reveal } from '../motion.js';

const scalar = (value) => (Array.isArray(value) ? value[0] : value);

export function createResultsView({ getLessonState }) {
  const sessionPanel = query('.results-pane');
  const wideLayout = window.matchMedia('(min-width:1080px) and (orientation:landscape)');
  function positionSession() {
    const { current, solutionOpen } = getLessonState();
    const wide = wideLayout.matches;
    const hasResults = current?.kind === 'code' && !sessionPanel.hidden;
    const hasReview = current?.kind === 'written' && solutionOpen;
    const withSnippet = current?.kind === 'choice' && !!current.snippet;
    query('#main').classList.toggle('expanded', wide && (hasResults || hasReview || withSnippet));
    query('.workspace').classList.toggle('has-results', wide && hasResults);
    query('.workspace').classList.toggle('has-review', wide && hasReview);
    query('.lesson-pane').classList.toggle('with-snippet', wide && withSnippet);
    if (wide && hasResults) query('.workspace').append(sessionPanel);
    else query('#answer-area').after(sessionPanel);
    const answer = query('#solution');
    const review = query('#review-panel');
    if (wide && hasReview && answer) {
      review.append(answer);
      review.hidden = false;
    } else {
      if (answer && answer.parentElement === review)
        query('#task-support .task-help').append(answer);
      review.hidden = true;
    }
  }
  wideLayout.addEventListener('change', positionSession);
  positionSession();

  function updateStatus(engineState, busy) {
    if (!query('#runtime-status')) return;
    const labels = {
      idle: 'R prepares when you open a coding exercise',
      loading: 'Preparing R…',
      ready: 'R ready',
      error: 'R could not load',
    };
    query('#runtime-status').textContent =
      busy && engineState === 'ready' ? 'Running…' : labels[engineState];
    query('#status-dot').className = `status-dot ${engineState}`;
    query('#retry-r').hidden = engineState !== 'error';
    const stop = query('#stop-code');
    if (stop) stop.hidden = !busy;
    const run = query('#run-code');
    if (run) {
      run.textContent = busy ? (engineState === 'loading' ? 'Preparing R…' : 'Running…') : 'Run';
      run.classList.toggle('is-running', busy);
    }
    query('#answer-area').setAttribute('aria-busy', String(busy));
    for (const id of ['run-code']) {
      const button = query('#' + id);
      if (button) button.disabled = busy;
    }
  }
  function show() {
    sessionPanel.hidden = false;
    positionSession();
  }
  function renderOutput(result) {
    show();
    const items = result.output.filter((item) =>
      ['stdout', 'stderr', 'message', 'warning', 'error'].includes(item.type),
    );
    query('#output-panel').innerHTML = items.length
      ? /* HTML */ `
          <pre class="output">
${items
              .map(
                (item) => /* HTML */ `
                  <span class="output-${escapeHtml(item.type)}">
                    ${escapeHtml(item.type === 'warning' ? 'Warning: ' + item.text : item.type === 'error' ? 'Error: ' + item.text : item.text)}
                  </span>
                `,
              )
              .join('\n')}</pre>
        `
      : '<div class="empty-state">Code ran without printed output.<br>Use an object name or print() to display a value.</div>';
    for (const bitmap of result.images || []) {
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.setAttribute('aria-label', 'Plot produced by your R code');
      canvas.getContext('2d').drawImage(bitmap, 0, 0);
      query('#output-panel').append(canvas);
      bitmap.close?.();
    }
    showPanel('output');
  }
  function renderObjects(objects) {
    query('#object-count').textContent = objects.length;
    query('#objects-panel').innerHTML = objects.length
      ? objects
          .map((o, i) => {
            const name = scalar(o.name),
              type = scalar(o.class),
              dimensions = o.dimensions || [],
              cells = o.cells || [],
              rows = o.rows || [],
              columns = o.columns || [];
            let visual = '';
            if (dimensions.length === 2 && dimensions[0] <= 12 && dimensions[1] <= 12) {
              const [nr, nc] = dimensions;
              visual = /* HTML */ `
                <div class="table-scroll">
                  <table class="object-table">
                    <thead>
                      <tr>
                        <th></th>
                        ${Array.from(
                          { length: nc },
                          (_, c) => /* HTML */ `
                            <th>${escapeHtml(columns[c] || c + 1)}</th>
                          `,
                        ).join('')}
                      </tr>
                    </thead>
                    <tbody>
                      ${Array.from(
                        { length: nr },
                        (_, r) => /* HTML */ `
                          <tr>
                            <th>${escapeHtml(rows[r] || r + 1)}</th>
                            ${Array.from({ length: nc }, (_, c) => {
                              const cell =
                                type === 'data.frame'
                                  ? Array.isArray(cells)
                                    ? cells[c]?.[r]
                                    : cells[columns[c]]?.[r]
                                  : cells[c * nr + r];
                              return /* HTML */ `
                                <td>
                                  <button
                                    class="cell"
                                    data-expression="${escapeHtml(name)}[${r + 1}, ${c + 1}]"
                                    data-value="${escapeHtml(cell)}"
                                  >
                                    ${escapeHtml(cell ?? 'NA')}
                                  </button>
                                </td>
                              `;
                            }).join('')}
                          </tr>
                        `,
                      ).join('')}
                    </tbody>
                  </table>
                </div>
              `;
            } else if (Array.isArray(cells) && cells.length && cells.length <= 144) {
              visual = /* HTML */ `
                <div class="vector-cells">
                  ${cells
                    .map(
                      (v, index) => /* HTML */ `
                        <button
                          class="vector-cell"
                          data-expression="${escapeHtml(name)}[${index + 1}]"
                          data-value="${escapeHtml(v)}"
                        >
                          <span>${index + 1}</span>
                          <strong>${escapeHtml(v ?? 'NA')}</strong>
                        </button>
                      `,
                    )
                    .join('')}
                </div>
              `;
            }
            return /* HTML */ `
              <details class="object" ${i === 0 || visual ? 'open' : ''}>
                <summary>
                  <span>${escapeHtml(name)}</span>
                  <small>${escapeHtml(type)}</small>
                </summary>
                ${
                  visual ||
                  /* HTML */ `
                    <pre>${escapeHtml(scalar(o.preview))}</pre>
                  `
                }
                <div class="cell-readout" aria-live="polite"></div>
                ${scalar(o.length) > 144 ? '<p class="fine-print">Showing the first 144 elements.</p>' : ''}
              </details>
            `;
          })
          .join('')
      : '<div class="empty-state">No named objects yet.<br>Use &lt;- to store a value.</div>';
    document.querySelectorAll('[data-expression]').forEach(
      (button) =>
        (button.onclick = () => {
          const object = button.closest('.object');
          object.querySelectorAll('.selected').forEach((x) => x.classList.remove('selected'));
          button.classList.add('selected');
          object.querySelector('.cell-readout').textContent =
            `${button.dataset.expression} → ${button.dataset.value}`;
        }),
    );
  }
  function showPanel(panel) {
    const changed = query('#' + panel + '-panel').hidden;
    for (const p of ['output', 'objects']) {
      query('#' + p + '-panel').hidden = p !== panel;
      query('#' + p + '-tab').setAttribute('aria-selected', String(p === panel));
      query('#' + p + '-tab').tabIndex = p === panel ? 0 : -1;
    }
    if (changed) reveal([query('#' + panel + '-panel')], { distance: 0 });
  }
  function resetPanels() {
    query('#feedback').innerHTML = '';
    query('#output-panel').innerHTML =
      '<div class="empty-state">Run your code to see its output.</div>';
    query('#objects-panel').innerHTML =
      '<div class="empty-state">Named values appear here after you run code.</div>';
    query('#object-count').textContent = '0';
    showPanel('output');
  }
  query('#output-tab').onclick = () => showPanel('output');
  query('#objects-tab').onclick = () => showPanel('objects');
  query('.result-tabs').addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      const panel =
        e.key === 'Home'
          ? 'output'
          : e.key === 'End'
            ? 'objects'
            : query('#output-tab').getAttribute('aria-selected') === 'true'
              ? 'objects'
              : 'output';
      showPanel(panel);
      query('#' + panel + '-tab').focus();
    }
  });

  return {
    position: positionSession,
    show,
    updateStatus,
    renderOutput,
    renderObjects,
    showPanel,
    reset: resetPanels,
  };
}
