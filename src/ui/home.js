import { query, escapeHtml } from './html.js';
import { modules, modes } from '../content/index.js';
import { reveal } from '../motion.js';

export function createHomeView() {
  let selectedModuleId = modules[0].id;
  let events;
  function destroy() {
    events?.abort();
  }
  function render(moduleId = selectedModuleId) {
    destroy();
    selectedModuleId = moduleId;
    document.title = 'MIS 130 — R Workshop';
    query('#main').classList.remove('expanded');
    query('#sidebar-toggle').hidden = true;
    query('.results-pane').hidden = true;
    query('#review-panel').hidden = true;
    query('.lesson-header').hidden = true;
    query('.workspace').hidden = true;
    const startEl = query('#start-screen');
    startEl.hidden = false;
    const descriptions = {
      learn: 'Work through the concepts.',
      practice: 'Solve problem sets and lab exercises.',
      exam: 'Practise written answers.',
    };
    startEl.innerHTML = /* HTML */ `
      <div class="course-picker">
        <span id="course-label">Course weeks</span>
        <div class="course-dropdown">
          <button
            type="button"
            id="course-unit"
            aria-labelledby="course-label course-value"
            aria-haspopup="listbox"
            aria-expanded="false"
            aria-controls="course-options"
          >
            <span id="course-value"></span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path d="m5 8 5 5 5-5" />
            </svg>
          </button>
          <div id="course-options" role="listbox" aria-labelledby="course-label" hidden>
            ${modules
              .map(
                (m) => /* HTML */ `
                  <div
                    role="option"
                    tabindex="-1"
                    aria-selected="false"
                    data-course-unit="${escapeHtml(m.id)}"
                  >
                    <span class="course-option-copy">
                      <span class="course-option-weeks">${escapeHtml(m.weeks)}</span>
                      <span>${escapeHtml(m.title)}</span>
                    </span>
                    <svg
                      class="course-option-check"
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      aria-hidden="true"
                    >
                      <path d="m4 10 4 4 8-8" />
                    </svg>
                  </div>
                `,
              )
              .join('')}
          </div>
        </div>
      </div>
      <header class="unit-intro">
        <h1 id="unit-title" tabindex="-1"></h1>
        <p id="unit-description"></p>
        <p id="unit-source"></p>
      </header>
      <nav class="study-paths" aria-label="Open a study mode">
        ${modes
          .map(
            (m) => /* HTML */ `
              <a class="study-path" data-open-mode="${m.id}">
                <span class="path-copy">
                  <span class="path-title">${escapeHtml(m.label)}</span>
                  <span class="path-description">${descriptions[m.id]}</span>
                </span>
                <span class="path-count"></span>
                <span class="path-arrow" aria-hidden="true">→</span>
              </a>
            `,
          )
          .join('')}
      </nav>
    `;
    const select = query('#course-unit');
    const syncSelection = () => {
      const activeMod = modules.find((m) => m.id === selectedModuleId) || modules[0];
      selectedModuleId = activeMod.id;
      query('#course-value').textContent = `${activeMod.weeks} · ${activeMod.title}`;
      for (const option of query('#course-options').children)
        option.setAttribute('aria-selected', String(option.dataset.courseUnit === activeMod.id));
      query('#unit-title').textContent = activeMod.title;
      query('#unit-description').textContent = activeMod.subtitle;
      query('#unit-source').textContent = activeMod.source;
      for (const link of startEl.querySelectorAll('[data-open-mode]')) {
        const exercises = activeMod[link.dataset.openMode];
        link.href = `#${exercises[0].id}`;
        link.querySelector('.path-count').textContent = `${exercises.length} exercises`;
      }
    };
    const list = query('#course-options');
    const options = Array.from(list.children);
    const dropdown = query('.course-dropdown');
    let pickerOpen = false,
      pickerAnimation;
    const animatePicker = (opening) => {
      const wasHidden = list.hidden;
      const from = wasHidden
        ? { opacity: 0, transform: 'translateY(-4px)' }
        : { opacity: getComputedStyle(list).opacity, transform: getComputedStyle(list).transform };
      pickerAnimation?.cancel();
      list.hidden = false;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        list.hidden = !opening;
        return;
      }
      const animation = list.animate(
        [
          from,
          opening
            ? { opacity: 1, transform: 'translateY(0)' }
            : { opacity: 0, transform: 'translateY(-4px)' },
        ],
        { duration: 140, easing: 'ease-out', fill: 'forwards' },
      );
      pickerAnimation = animation;
      animation.finished
        .then(() => {
          if (pickerAnimation !== animation) return;
          list.hidden = !pickerOpen;
          animation.cancel();
          pickerAnimation = undefined;
        })
        .catch(() => {});
    };
    const closePicker = (restoreFocus = false) => {
      if (restoreFocus) select.focus({ preventScroll: true });
      if (!pickerOpen) return;
      pickerOpen = false;
      select.setAttribute('aria-expanded', 'false');
      list.inert = true;
      animatePicker(false);
    };
    const focusOption = (index) => {
      options[index].focus();
      options[index].scrollIntoView({ block: 'nearest' });
    };
    const openPicker = () => {
      if (!pickerOpen) {
        pickerOpen = true;
        select.setAttribute('aria-expanded', 'true');
        list.inert = false;
        animatePicker(true);
      }
      focusOption(
        Math.max(
          0,
          options.findIndex((option) => option.dataset.courseUnit === selectedModuleId),
        ),
      );
    };
    // Keep pointer presses from blurring the focused option before the toggle click.
    dropdown.onpointerdown = () => {
      select.dataset.pointerFocus = 'true';
    };
    select.onpointerdown = (event) => event.preventDefault();
    select.onclick = () => (pickerOpen ? closePicker(true) : openPicker());
    select.onkeydown = (event) => {
      if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault();
        openPicker();
      }
    };
    let typed = '',
      typingAt = 0;
    options.forEach((option, index) => {
      option.onclick = () => {
        const changed = selectedModuleId !== option.dataset.courseUnit;
        selectedModuleId = option.dataset.courseUnit;
        syncSelection();
        closePicker(true);
        if (changed) reveal([query('.unit-intro'), query('.study-paths')], { stagger: 30 });
      };
      option.onkeydown = (event) => {
        let next;
        if (event.key === 'ArrowDown') next = (index + 1) % options.length;
        else if (event.key === 'ArrowUp') next = (index + options.length - 1) % options.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = options.length - 1;
        else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          option.click();
          return;
        } else if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          closePicker(true);
          return;
        } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          typed = Date.now() - typingAt > 700 ? event.key : typed + event.key;
          typingAt = Date.now();
          const match = options.findIndex((item) =>
            item.textContent.toLowerCase().includes(typed.toLowerCase()),
          );
          if (match >= 0) next = match;
        }
        if (next !== undefined) {
          event.preventDefault();
          focusOption(next);
        }
      };
    });
    events = new AbortController();
    document.addEventListener(
      'keydown',
      () => {
        delete select.dataset.pointerFocus;
      },
      { signal: events.signal },
    );
    document.addEventListener(
      'pointerdown',
      (event) => {
        if (!dropdown.contains(event.target)) closePicker();
      },
      { signal: events.signal },
    );
    dropdown.onfocusout = (event) => {
      if (!dropdown.contains(event.relatedTarget)) closePicker();
    };
    syncSelection();
    reveal([query('.course-picker'), query('.unit-intro'), query('.study-paths')], { stagger: 25 });
  }

  return { render, destroy };
}
