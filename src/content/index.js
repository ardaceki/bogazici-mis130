import { taskSources } from './sources.js';
import introduction from './introduction.js';
import foundations from './foundations.js';
export const modules = [introduction, foundations];
export const modes = [
  { id: 'learn', label: 'Learn' },
  { id: 'practice', label: 'PS / Lab' },
  { id: 'exam', label: 'Paper practice' },
];
export const upcoming = [
  ['Vectors in depth', '7 Oct'],
  ['Matrices in depth', '14 Oct'],
  ['Lists, data frames & control flow', '21 Oct'],
  ['Functions', '28 Oct / 11 Nov'],
  ['Data import & export', '18 Nov'],
  ['Exploratory data analysis', '25 Nov'],
  ['Summary statistics', '2 Dec'],
  ['Graphs', '9 Dec'],
];
export const tasks = modules.flatMap((module) =>
  modes.flatMap((mode) =>
    module[mode.id].map((task) => ({ ...task, moduleId: module.id, mode: mode.id })),
  ),
);
export const findTask = (id) => tasks.find((task) => task.id === id);

for (const task of tasks) {
  if (!taskSources[task.id]?.references?.length)
    throw new Error(`Missing source mapping for ${task.id}`);
}
