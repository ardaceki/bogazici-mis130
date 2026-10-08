import { query, escapeHtml } from './html.js';
import { tasks, modes } from '../content/index.js';

export function createNavigation() {
  function render(task) {
    const { moduleId, mode } = task;
    const list = tasks.filter((t) => t.moduleId === moduleId && t.mode === mode);
    query('#module-nav').innerHTML = /* HTML */ `
      <div class="sidebar-section-label">${modes.find((m) => m.id === mode).label}</div>
      <nav id="task-nav" aria-label="Exercises">
        ${list
          .map(
            (t) => /* HTML */ `
              <a
                class="task-link ${t.id === task.id ? 'current' : ''}"
                href="#${t.id}"
                ${t.id === task.id ? 'aria-current="step"' : ''}
              >
                <span>${escapeHtml(t.title)}</span>
                ${t.bridge ? '<small>Lab preparation</small>' : ''}
              </a>
            `,
          )
          .join('')}
      </nav>
    `;
    query('#task-nav').onclick = (event) => {
      if (
        !event.target.closest('a') ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      if (!window.matchMedia('(min-width: 980px) and (orientation: landscape)').matches) {
        closeMenu();
        query('#sidebar-toggle').focus({ preventScroll: true });
      }
    };
  }
  function toggleMenu(force, focusTask = false) {
    const sidebar = query('.sidebar');
    const toggle = query('#sidebar-toggle');
    if (!sidebar || !toggle) return;
    const willOpen = force !== undefined ? force : !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', willOpen);
    toggle.classList.toggle('open', willOpen);
    toggle.setAttribute('aria-expanded', String(willOpen));
    toggle.setAttribute(
      'aria-label',
      willOpen ? 'Close course navigation' : 'Open course navigation',
    );
    if (willOpen && focusTask)
      (query('#task-nav [aria-current]') || query('#task-nav a'))?.focus({ preventScroll: true });
  }
  function closeMenu() {
    toggleMenu(false);
  }

  query('#sidebar-toggle').onclick = (event) => toggleMenu(undefined, event.detail === 0);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && query('.sidebar').classList.contains('open')) {
      closeMenu();
      query('#sidebar-toggle').focus({ preventScroll: true });
    }
  });
  return { render, close: closeMenu };
}
