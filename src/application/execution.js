import { explainRError } from '../feedback.js';
import { RRuntime } from '../runtime.js';

const LOAD_TIMEOUT_MS = 90000;
const RUN_TIMEOUT_MS = 30000;

export function createExecutionController({ getTask, getCode, feedback, onStart, results }) {
  let busy = false,
    epoch = 0,
    engineState = 'idle',
    timer;
  const runtime = new RRuntime((state) => {
    engineState = state;
    updateRuntime();
  });
  function updateRuntime() {
    results.updateStatus(engineState, busy);
  }
  function cancelActiveRun() {
    if (busy) runtime.stop();
    epoch++;
    busy = false;
    clearTimeout(timer);
  }

  function stop() {
    runtime.stop();
    epoch++;
    busy = false;
    clearTimeout(timer);
    feedback('neutral', 'Stopped.', 'The R session was reset. You can run your code again.');
    updateRuntime();
  }
  async function execute(shouldCheck) {
    if (busy || getCode() === null) return;
    const code = getCode();
    if (!code.trim()) {
      feedback(
        'neutral',
        'The editor is empty.',
        'Type your answer in the code box, then click Run. Hint shows a starting point.',
      );
      return;
    }
    const activeEpoch = epoch;
    const task = getTask();
    busy = true;
    updateRuntime();
    onStart();
    // A restart kills the worker even when it is stuck in an infinite loop.
    timer = setTimeout(() => {
      if (activeEpoch === epoch) {
        stop();
        feedback(
          'error',
          'R took too long to load.',
          'Check your connection and run again. Your editor code is still here.',
        );
      }
    }, LOAD_TIMEOUT_MS);
    try {
      await runtime.resetTask(task);
      if (activeEpoch !== epoch) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (activeEpoch === epoch) {
          stop();
          feedback(
            'error',
            'Execution stopped after 30 seconds.',
            'Check for a loop that never ends. Your editor code is still here.',
          );
        }
      }, RUN_TIMEOUT_MS);
      const result = await runtime.run(code, task, shouldCheck);
      if (activeEpoch !== epoch) {
        for (const image of result.images || []) image.close?.();
        return;
      }
      results.renderOutput(result);
      results.renderObjects(result.objects || []);
      if (
        !result.output.some((item) => item.type === 'stdout') &&
        result.objects?.length &&
        !result.error
      )
        results.showPanel('objects');
      if (result.error)
        feedback(
          'error',
          'Let’s fix the code.',
          explainRError(
            result.output.find((item) => item.type === 'error')?.text ||
              'R could not run this code',
            code,
          ),
        );
      else if (shouldCheck) {
        const failed = result.checks.filter((c) => !c.passed);
        const correctNames = result.checks
          .filter((c) => c.passed && c.target && !c.target.startsWith('.'))
          .map((c) => c.target);
        const reassurance =
          failed.length && correctNames.length
            ? `${correctNames.slice(0, 2).join(' and ')} ${correctNames.length === 1 ? 'is' : 'are'} correct. `
            : '';
        feedback(
          failed.length ? 'error' : 'success',
          failed.length
            ? 'One thing to fix:'
            : task.manual
              ? 'Saved values are correct.'
              : 'Correct.',
          failed.length
            ? reassurance + (failed[0].feedback || failed[0].message)
            : task.explanation + (task.manual ? ' ' + task.manual : ''),
        );
      }
    } catch (error) {
      if (activeEpoch === epoch) {
        results.show();
        feedback(
          'error',
          'R could not complete this run.',
          engineState === 'error'
            ? 'Check your connection, then click Run to try again. You can still read lessons and use paper practice.'
            : error.message,
        );
      }
    } finally {
      if (activeEpoch === epoch) {
        clearTimeout(timer);
        busy = false;
        updateRuntime();
      }
    }
  }

  return {
    runtime,
    execute,
    stop,
    cancel: cancelActiveRun,
    updateStatus: updateRuntime,
    get busy() {
      return busy;
    },
  };
}
