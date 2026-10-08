# Answer and feedback audit

Reviewed on 8 October 2026. Every published task has an answer contract. Executable tasks compare final values, required object names, and relevant structure. They do not grade explanatory prose or prove that a particular reasoning process was followed. Written questions are explicitly self-reviewed.

All code runs in the UI now evaluate the entire shown script from a clean task environment; prior successful values cannot make a later incomplete script pass. Different syntax, helper objects, integer/double representations, and mathematically equivalent calculations are accepted. Required names and explicitly requested shapes/orders still matter.

Value feedback distinguishes missing objects, similar names, wrong types, missing values, shapes, and incorrect values. Other object requirements identify the failed requirement and provide a next action. R syntax and runtime errors are translated into direct instructions, with the original message retained in Output.

Value comparisons distinguish numeric vectors from lists and preserve shape,
while accepting integer/double storage differences. Integer-valued expected
answers use zero tolerance; fractional expected answers use an explicit `1e-8`
relative tolerance. The saved-script task runs the file in an independent clean
environment. Matrix contents and data-frame/list relationships are checked in
addition to the extracted answers.

| Task               | Answer contract                                                                | Check scope                                                     |
| ------------------ | ------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| first-calculation  | Write a calculation.                                                           | Saved results and object requirements.                          |
| change-number      | Write a calculation.                                                           | Saved results and object requirements.                          |
| multiply           | Write a calculation.                                                           | Saved results and object requirements.                          |
| ticket-calculation | Write a calculation.                                                           | Saved results and object requirements.                          |
| order              | Write a calculation.                                                           | Saved results and object requirements.                          |
| assignment         | Save as: ticket_price, ticket_count, total_cost                                | Saved results and object requirements.                          |
| expression-state   | Choose one answer.                                                             | Each wrong option has a specific explanation and a next action. |
| reassignment       | Save as: total_cost                                                            | Saved results and object requirements.                          |
| number-text        | Save as: seat_count, room_label, seat_type, room_type                          | Saved results and object requirements.                          |
| comments           | Save as: bill                                                                  | Saved results; additional explanation/process is self-reviewed. |
| workspace          | Save as: note, score                                                           | Saved results and object requirements.                          |
| rstudio            | Choose one answer.                                                             | Each wrong option has a specific explanation and a next action. |
| working-directory  | Save as: working_directory, files                                              | Saved results and object requirements.                          |
| scripts            | Save as: bill                                                                  | Saved results and object requirements.                          |
| reproduce          | Save as: bill, my-bill.R                                                       | Saved results and object requirements.                          |
| help               | Save as: average                                                               | Saved results and object requirements.                          |
| ps2-panes          | Explain in your own words.                                                     | Self-review; different wording is allowed.                      |
| ps2-tickets        | Save as: total_cost, amount_due                                                | Saved results; additional explanation/process is self-reviewed. |
| ps2-types          | Save as: seat_count, room_label                                                | Saved results; additional explanation/process is self-reviewed. |
| ps2-remove         | Save as: ps01_note, ps01_score                                                 | Saved results; additional explanation/process is self-reviewed. |
| ps2-help           | Explain in your own words.                                                     | Self-review; different wording is allowed.                      |
| ps2-script         | Save as: bill, folder                                                          | Saved results; additional explanation/process is self-reviewed. |
| lab2-three         | Save as: total, average, product                                               | Saved results and object requirements.                          |
| lab2-operators     | Save as: difference, power, remainder                                          | Saved results and object requirements.                          |
| lab2-compound      | Save as: amount_1000, amount_500                                               | Saved results and object requirements.                          |
| lab2-seconds       | Save as: seconds                                                               | Saved results and object requirements.                          |
| lab2-future        | Save as: FV                                                                    | Saved results and object requirements.                          |
| lab2-pi            | Save as: squared, rooted, lower, upper, product                                | Saved results and object requirements.                          |
| paper-fee          | Choose one answer.                                                             | Each wrong option has a specific explanation and a next action. |
| paper-quotes       | Choose one answer.                                                             | Each wrong option has a specific explanation and a next action. |
| paper-script       | Explain in your own words.                                                     | Self-review; different wording is allowed.                      |
| paper-delete       | Choose one answer.                                                             | Each wrong option has a specific explanation and a next action. |
| paper-write        | Explain in your own words.                                                     | Self-review; different wording is allowed.                      |
| syntax             | Save as: y, z                                                                  | Saved results and object requirements.                          |
| division           | Save as: boxes, leftover                                                       | Saved results and object requirements.                          |
| comparisons        | Save as: enough, exact                                                         | Saved results and object requirements.                          |
| logic              | Save as: ready, either, unpaid                                                 | Saved results and object requirements.                          |
| vectors            | Save as: sales, months, total                                                  | Saved results and object requirements.                          |
| index              | Save as: sales, second, selected                                               | Saved results and object requirements.                          |
| sequences          | Save as: numbers, squares                                                      | Saved results and object requirements.                          |
| character-vectors  | Save as: sizes, medium                                                         | Saved results and object requirements.                          |
| coercion           | Choose one answer.                                                             | Each wrong option has a specific explanation and a next action. |
| length             | Save as: extended, x                                                           | Saved results and object requirements.                          |
| beyond-length      | Save as: e                                                                     | Saved results and object requirements.                          |
| matrix             | Save as: m                                                                     | Saved results and object requirements.                          |
| matrix-names       | Save as: sales, second_B                                                       | Saved results and object requirements.                          |
| summaries          | Save as: product_totals, month_totals, best_month                              | Saved results and object requirements.                          |
| lists              | Save as: report, units                                                         | Saved results and object requirements.                          |
| dataframes         | Save as: students, average                                                     | Saved results and object requirements.                          |
| factors            | Save as: department, categories, counts                                        | Saved results and object requirements.                          |
| ordered-factor     | Save as: education                                                             | Saved results and object requirements.                          |
| conversion         | Save as: z, digits, restored                                                   | Saved results and object requirements.                          |
| attributes         | Save as: x, shape                                                              | Saved results and object requirements.                          |
| unclass            | Save as: df, raw, raw_class, original_class                                    | Saved results and object requirements.                          |
| labels             | Save as: cut, size                                                             | Saved results and object requirements.                          |
| repeat-update      | Save as: balance, history                                                      | Saved results; additional explanation/process is self-reviewed. |
| ps3-debug          | Save as: y, z                                                                  | Saved results and object requirements.                          |
| ps3-operators      | Save as: remainder, quotient, combined, greater, both, either                  | Saved results and object requirements.                          |
| ps3-length         | Save as: extended, x                                                           | Saved results and object requirements.                          |
| ps3-matrix         | Save as: m, selected, row_totals, column_totals                                | Saved results and object requirements.                          |
| lab3-population    | Save as: cityA, cityB                                                          | Saved results and object requirements.                          |
| lab3-boxes         | Save as: full_boxes, leftover                                                  | Saved results and object requirements.                          |
| lab3-grade         | Save as: project, overall                                                      | Saved results and object requirements.                          |
| lab3-sales         | Save as: sales, total_units_per_product, grand_total, month_totals, best_month | Saved results and object requirements.                          |
| lab3-departments   | Save as: scores, dept_avg, quarter_avg, best_dept, dept_factor                 | Saved results and object requirements.                          |
| paper-modulo       | Choose one answer.                                                             | Each wrong option has a specific explanation and a next action. |
| paper-matrix       | Choose one answer.                                                             | Each wrong option has a specific explanation and a next action. |
| paper-list         | Choose one answer.                                                             | Each wrong option has a specific explanation and a next action. |
| paper-na           | Choose one answer.                                                             | Each wrong option has a specific explanation and a next action. |
| paper-factor       | Choose one answer.                                                             | Each wrong option has a specific explanation and a next action. |
| paper-class        | Choose one answer.                                                             | Each wrong option has a specific explanation and a next action. |
| paper-simultaneous | Explain in your own words.                                                     | Self-review; different wording is allowed.                      |
| paper-summary      | Explain in your own words.                                                     | Self-review; different wording is allowed.                      |

## Guided stages

- assignment, step 1: Save as: ticket_price
- assignment, step 2: Save as: ticket_count
- assignment, step 3: Save as: total_cost
- number-text, step 1: Save as: seat_count
- number-text, step 2: Save as: room_label
- number-text, step 3: Save as: seat_type
- number-text, step 4: Save as: room_type
- workspace, step 1: Save as: note, score
- workspace, step 2: Write a calculation.
- workspace, step 3: Save as: note, score
- working-directory, step 1: Save as: working_directory
- working-directory, step 2: Save as: files
- division, step 1: Save as: boxes
- division, step 2: Save as: leftover
- comparisons, step 1: Save as: enough
- comparisons, step 2: Save as: exact
- vectors, step 1: Save as: sales
- vectors, step 2: Save as: months
- vectors, step 3: Save as: total
- index, step 1: Save as: second
- index, step 2: Save as: selected
- matrix-names, step 1: Write a calculation.
- matrix-names, step 2: Write a calculation.
- matrix-names, step 3: Save as: second_B

## Verification

The browser suite exercises all 55 main code solutions and 24 guided-stage solutions, their alternative assignment syntax with extra helper variables, and their incomplete-answer feedback. Additional cases cover missing names, case differences, quoted numbers, numerical mismatches, vector/matrix shape errors, same-task stale values, reordered list/data-frame fields and factor levels, malformed data, all incorrect multiple-choice options, and written self-review. See docs/VALIDATION.md for the latest completed run.
