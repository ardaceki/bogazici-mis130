import { query, escapeHtml } from './html.js';
import { modules, upcoming } from '../content/index.js';
import { taskSources } from '../content/sources.js';

export function initializeDialogs({ getTask }) {
  function sourceLinks(refs) {
    return refs
      .map(
        (ref) => /* HTML */ `
          <a class="source-link" href="${escapeHtml(ref.href)}" target="_blank" rel="noopener">
            ${escapeHtml(ref.label)}
            <span aria-hidden="true">↗</span>
          </a>
        `,
      )
      .join('');
  }
  function showSource() {
    const source = taskSources[getTask().id];
    query('#source-body').innerHTML = /* HTML */ `
      <p class="source-note">${escapeHtml(source.note)}</p>
      ${sourceLinks(source.references)}
      <p class="fine-print">
        Opens the original material at the relevant section or PDF page. These sources also support
        this task’s hints and explanation.
      </p>
    `;
    query('#source-dialog').showModal();
  }
  query('#task-source-link').onclick = showSource;
  function showCourseMap() {
    query('#info-title').textContent = 'Course map';
    query('#info-body').innerHTML = /* HTML */ `
      <p class="muted">
        Published topics pair lectures with completed PS/lab work. Everything is open.
      </p>
      <div class="course-ready">
        ${modules
          .map(
            (m) => /* HTML */ `
              <a href="#${m.learn[0].id}" class="map-row">
                <strong>${m.title}</strong>
                <span>${m.source}</span>
                <span>Open ↗</span>
              </a>
            `,
          )
          .join('')}
      </div>
      <h3>Later in the course</h3>
      <p class="muted">
        Scheduled lecture dates. Detailed lessons are added after both practice groups finish.
      </p>
      <div class="future-list">
        ${upcoming
          .map(
            ([topic, date]) => /* HTML */ `
              <div>
                <span>${topic}</span>
                <span>${date}</span>
              </div>
            `,
          )
          .join('')}
      </div>
      <a class="source-link" href="/sources/syllabus.docx" target="_blank" rel="noopener">
        Source: syllabus (Word file) ↗
      </a>
    `;
    query('#info-dialog').showModal();
  }
  query('#materials-header').onclick = () => query('#materials-dialog').showModal();
  for (const dialog of document.querySelectorAll('dialog')) {
    dialog
      .querySelectorAll('.dialog-close')
      .forEach((button) => (button.onclick = () => dialog.close()));
    dialog.onclick = (e) => {
      if (e.target === dialog) {
        const r = dialog.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
          dialog.close();
      }
    };
    dialog.querySelectorAll('a').forEach((a) => (a.onclick = () => dialog.close()));
  }
  query('#info-dialog').addEventListener('click', (e) => {
    if (e.target.closest('a')) query('#info-dialog').close();
  });

  query('#course-info').onclick = showCourseMap;
  query('#materials-dialog').showModal();
}
