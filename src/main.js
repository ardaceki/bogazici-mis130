import './styles/index.css';
import { tasks, findTask } from './content/index.js';
import { guided } from './content/guided.js';
import { query } from './ui/html.js';
import { createHomeView } from './ui/home.js';
import { createLessonView } from './ui/lesson.js';
import { createNavigation } from './ui/navigation.js';
import { createResultsView } from './ui/results.js';
import { initializeDialogs } from './ui/dialogs.js';
import { createExecutionController } from './application/execution.js';

const home = createHomeView();
const navigation = createNavigation();
let lesson;
const results = createResultsView({
  getLessonState: () => ({ current: lesson?.current, solutionOpen: lesson?.solutionOpen }),
});
const execution = createExecutionController({
  getTask: () => lesson.current,
  getCode: () => lesson.code,
  feedback: (...args) => lesson.feedback(...args),
  onStart: () => lesson.clearFeedback(),
  results,
});
lesson = createLessonView({
  navigation,
  results,
  onBeforeRender: () => {
    home.destroy();
    execution.cancel();
  },
  onRun: (checked) => execution.execute(checked),
  onStop: () => execution.stop(),
  onStatus: () => execution.updateStatus(),
  // Download the interpreter while the student reads; never run their code here.
  onPrepare: () => {
    void execution.runtime.init().catch(() => {});
  },
});

function handleRoute() {
  const id = location.hash.slice(1);
  if (findTask(id)) {
    lesson.render(id);
    return;
  }
  const moduleId = lesson.current?.moduleId;
  execution.cancel();
  lesson.deactivate();
  navigation.close();
  home.render(moduleId);
}

function navigate(id) {
  if (location.hash === `#${id}`) lesson.render(id);
  else location.hash = id;
}

query('.skip-link').onclick = (event) => {
  event.preventDefault();
  const heading = lesson.current ? query('#task-heading') : query('#unit-title');
  heading.focus();
  heading.scrollIntoView({ block: 'start' });
};
query('#retry-r').onclick = () => {
  execution.runtime.stop();
  execution.execute(false);
};
window.addEventListener('hashchange', () => {
  handleRoute();
  if (lesson.current) query('#task-heading').focus({ preventScroll: true });
  window.scrollTo(0, 0);
});
window.addEventListener('pagehide', () => execution.runtime.stop());
handleRoute();
initializeDialogs({ getTask: () => lesson.current });

// The browser tests exercise the same runtime and checks as the student UI.
// Vite removes this branch from production builds.
if (import.meta.env.DEV)
  window.workshop = {
    tasks,
    guided,
    runtime: execution.runtime,
    execute: (checked) => execution.execute(checked),
    navigate,
    setEditor: (text) => lesson.setEditor(text),
    get current() {
      return lesson.current;
    },
    get busy() {
      return execution.busy;
    },
  };
