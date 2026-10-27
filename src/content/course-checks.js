import { sameValue, check } from './helpers.js';

// Names are only required when the question requests them. Otherwise students
// can use the example names, return a bundle, or display answers in question order.
// A named answer, when present, is authoritative: a correct debug print cannot
// hide an incorrect saved value.
export function answers(fields) {
  const bundleKeys = fields.map(({ resultNames, names = [] }) => {
    const keys = resultNames || names;
    return keys.length ? `c(${keys.map((name) => JSON.stringify(name)).join(',')})` : 'character()';
  });
  return fields.map(
    (
      { label, expected, names = [], resultNames = names, position, lastResult = false, predicate },
      index,
    ) => {
      const slot = position ?? index;
      const actualExpr = `local({
      .names <- ${names.length ? `c(${names.map((n) => JSON.stringify(n)).join(',')})` : 'character()'}
      .found <- .names[vapply(.names, function(nm) exists(nm, inherits=FALSE, envir=.lesson), logical(1))]
      .outputs <- .workshop_outputs
      .last <- if(length(.outputs)) .outputs[[length(.outputs)]] else NULL
      .keys <- ${resultNames.length ? `c(${resultNames.map((n) => JSON.stringify(n)).join(',')})` : 'character()'}
      .key <- .keys[.keys %in% names(.last)]
      .named_bundle <- is.list(.last) && all(vapply(list(${bundleKeys.join(',')}), function(.keys) any(.keys %in% names(.last)), logical(1)))
      .actual <- if(length(.found)) get(.found[1], envir=.lesson, inherits=FALSE)
        else if(.named_bundle && length(.key)) .last[[.key[1]]]
        else if(is.list(.last) && length(.last)==${fields.length}) .last[[${slot + 1}]]
        else if(is.atomic(.last) && is.null(dim(.last)) && length(.last)==${fields.length} && ${fields.length}>1 &&
          all(vapply(list(${fields.map((field) => field.expected).join(',')}), function(x) is.atomic(x) && is.null(dim(x)) && length(x)==1L, logical(1)))) .last[${slot + 1}]
        else if(length(.outputs)>=${fields.length}) .outputs[[length(.outputs)-${fields.length}+${slot + 1}]]
        ${lastResult ? 'else if(length(.outputs)) .last' : ''}
        else NULL
      .actual
    })`;
      return {
        expr: predicate
          ? `local({ .answer <- ${actualExpr}; ${predicate} })`
          : sameValue(actualExpr, expected),
        actualExpr,
        expected,
        kind: 'course-answer',
        label,
        predicate,
        formatHint: `Display the ${fields.length === 1 ? 'answer' : `${fields.length} answers`} in question order, or return an ordered vector/list (labels may differ). ${names.length ? `You can also save this result as ${names.join(' or ')}.` : ''}`,
        message: `${label}: no matching answer was found. Display the ${fields.length === 1 ? 'answer' : `${fields.length} answers`} in question order, or return an ordered vector/list with ${fields.length} ${fields.length === 1 ? 'entry' : 'entries'}. ${names.length ? `You can also save this result as ${names.join(' or ')}.` : ''} Then click Run.`,
      };
    },
  );
}

export const displayed = (expected, message) => ({
  kind: 'requirement',
  expr: `any(vapply(.workshop_outputs, function(.output) ${sameValue('.output', expected)}, logical(1)))`,
  message: message.includes('Run') ? message : `${message} Then click Run.`,
});
export const sourceExecuted = (filename) => ({
  kind: 'requirement',
  expr: `any(vapply(.workshop_sources, function(.event) identical(.event$path, normalizePath(${JSON.stringify(filename)},mustWork=FALSE)) && isTRUE(.event$original), logical(1)))`,
  message: `Run the supplied ${filename} file with source(). Keep its original commands; assigning the expected result directly does not run the saved script. Then click Run.`,
});

export function sourcedValue(name, expected) {
  const actualExpr = `local({
    if(exists(${JSON.stringify(name)},envir=.lesson,inherits=TRUE)) get(${JSON.stringify(name)},envir=.lesson,inherits=TRUE)
    else {
      .sources <- Filter(function(.event) isTRUE(.event$original), .workshop_sources)
      if(length(.sources)) .sources[[length(.sources)]]$values[[${JSON.stringify(name)}]] else NULL
    }
  })`;
  return {
    expr: sameValue(actualExpr, expected),
    actualExpr,
    expected,
    kind: 'course-answer',
    label: name,
    message: `Run the supplied file to create ${name}, then display its result. Then click Run.`,
    formatHint: `Check ${name} produced by the supplied script.`,
  };
}

// Check real workspace transitions rather than demanding a particular spelling
// of the command. Extra helper objects and alternative commands are allowed.
export const stateValue = (state, name, expected) =>
  `isTRUE(${state}[["${name}"]]$exists) && ${sameValue(`${state}[["${name}"]]$value`, expected)}`;
export const sequence = (conditions, message) =>
  check(
    `local({
    .position <- 0L
    .ok <- TRUE
    ${conditions
      .map(
        (condition) => `
    .matches <- which(vapply(.workshop_states, function(.state) isTRUE(tryCatch({${condition}}, error=function(e) FALSE)), logical(1)))
    .later <- .matches[.matches > .position]
    if(!length(.later)) .ok <- FALSE else .position <- .later[1]
    `,
      )
      .join('')}
    .ok
  })`,
    message,
  );
