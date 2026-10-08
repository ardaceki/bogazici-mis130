// Compare values, retaining their semantic type and shape but allowing names and
// integer/double storage to differ. Discrete answers must match exactly; fractional
// calculations use an explicit relative tolerance for floating-point arithmetic.
const sameValue = (actual, expected) => `local({
  .actual <- ${actual}
  .expected <- ${expected}
  .numeric <- is.numeric(.expected)
  .same_type <- if (.numeric) is.numeric(.actual) else identical(typeof(.actual), typeof(.expected))
  .tolerance <- if (.numeric && any(is.finite(.expected) & .expected != trunc(.expected))) 1e-8 else 0
  .same_type && identical(dim(.actual), dim(.expected)) &&
    isTRUE(all.equal(unname(.actual), unname(.expected), check.attributes=FALSE, tolerance=.tolerance))
})`;

export const check = (expr, message) => {
  const result =
    expr.match(/^isTRUE\(all.equal\(\.workshop_result,\s*(.+)\)\)$/) ||
    expr.match(/^identical\(\.workshop_result,\s*(.+)\)$/);
  return {
    expr: result ? sameValue('.workshop_result', result[1]) : expr,
    message,
    targets: [
      ...new Set(
        [...expr.matchAll(/exists\("([^"]+)"/g)].map((m) => m[1]).filter((n) => !n.startsWith('.')),
      ),
    ],
    ...(result
      ? {
          kind: 'value',
          target: '.workshop_result',
          expected: result[1],
          resultExpr: sameValue('.workshop_result', result[1]),
          customMessage: true,
        }
      : {}),
  };
};
export const value = (name, expected, message) => ({
  ...check(
    `exists("${name}", inherits=FALSE) && ${sameValue(name, expected)}`,
    message || `Check the value stored in ${name}.`,
  ),
  kind: 'value',
  target: name,
  expected,
  resultExpr: sameValue('.workshop_result', expected),
  customMessage: !!message,
});
export function code(id, title, prompt, starter, solution, explanation, checks, extra = {}) {
  return {
    id,
    title,
    kind: 'code',
    prompt,
    starter,
    solution,
    explanation,
    checks,
    hints: extra.hints || [
      'Work on the named result that the feedback mentions.',
      'Open Show solution to see one complete answer. You can use a different calculation that gives the same result.',
    ],
    ...extra,
  };
}
export function choice(id, title, prompt, snippet, options, correct, explanation, extra = {}) {
  return {
    id,
    title,
    kind: 'choice',
    prompt,
    snippet,
    options,
    correct,
    explanation,
    hints: ['Follow each line from top to bottom. Track which values are actually saved.'],
    ...extra,
  };
}
export function written(id, title, prompt, answer, extra = {}) {
  return {
    id,
    title,
    kind: 'written',
    prompt,
    answer,
    explanation: answer,
    hints: [
      'Compare your answer point by point with the suggested answer. Different wording is fine if the meaning is the same.',
    ],
    ...extra,
  };
}
export const valueField = (parent, field, expected, message) => ({
  ...check(
    `exists("${parent}", inherits=FALSE) && "${field}" %in% names(${parent}) && ${sameValue(`${parent}[["${field}"]]`, expected)}`,
    message || `Check the ${field} value in ${parent}.`,
  ),
  kind: 'value',
  target: parent,
  path: field,
  displayTarget: `${parent}$${field}`,
  expected,
  resultExpr: sameValue('.workshop_result', expected),
  customMessage: !!message,
});
