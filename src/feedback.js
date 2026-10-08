const scalar = (x) => (Array.isArray(x) ? x[0] : x);
export function targetsFor(task) {
  return [
    ...new Set(
      (task.checks || [])
        .flatMap((c) => (c.target ? [c.target.startsWith('.') ? null : c.target] : c.targets || []))
        .filter(Boolean),
    ),
  ];
}
export function answerContract(task) {
  if (task.kind === 'written')
    return {
      summary: 'Explain in your own words.',
      detail:
        'Different wording is fine. This answer is self-reviewed: compare it with the suggested answer; the site does not automatically grade your explanation.',
    };
  if (task.kind === 'choice')
    return {
      summary: 'Choose one answer.',
      detail:
        'Select an option, then click Check answer. You do not need to type code for this question.',
    };
  const targets = targetsFor(task);
  return {
    summary: targets.length ? `Save as: ${targets.join(', ')}` : 'Write a calculation.',
    detail: targets.length
      ? 'Use the shown names exactly, including capital letters. Any correct calculation is accepted; spacing, comments, extra helper variables, and using = instead of <- are fine. Write R commands here; start explanation lines with #. Click Run to check the whole script from a fresh start.'
      : 'Return your answer on the last line. You can use a calculation or a function; matching the example code exactly is not required. Click Run to execute and check the whole script.',
  };
}
const present = (node) => {
  const n = scalar(node);
  return n == null ? 'missing' : String(n);
};
export function explainCheck(check, diagnostics, objects = []) {
  const d = diagnostics;
  if (!d) return `${check.message} Then click Run again.`;
  const target = check.displayTarget || check.target || check.targets?.[0];
  if (target?.startsWith('.'))
    return `Your last line returns ${present(d.actual)}; expected ${present(d.expected)}. ${check.message} Then click Run.`;
  if (!scalar(d.exists)) {
    if (check.path && !scalar(d.rootExists))
      return `Create ${check.target} first; it has not been saved yet. ${check.message} Then click Run.`;
    if (check.path)
      return `${check.target} has no entry named ${check.path}. Check the names inside ${check.target}. ${check.message} Then click Run.`;
    const names = check.path
      ? (d.availableNames || []).map((name) => `${check.target}$${name}`)
      : objects.map((o) => scalar(o.name));
    const similar = names.find(
      (n) => n.toLowerCase().replace(/_/g, '') === target.toLowerCase().replace(/_/g, ''),
    );
    if (similar)
      return `You used ${similar}, but this question asks for ${target}. Change the name to ${target}, then click Run. R treats different spelling and capital letters as different names.`;
    if (scalar(d.resultMatches))
      return `The calculation is right, but ${target} has not been saved. Write ${target} <- followed by your calculation, then click Run.`;
    return `There is no value named ${target} yet. Add ${target} <- followed by your answer, then click Run. ${check.kind !== 'value' || check.customMessage ? check.message : ''}`.trim();
  }
  const actual = present(d.actual),
    expected = present(d.expected),
    actualType = present(d.actualType),
    expectedType = present(d.expectedType);
  if (check.kind === 'value') {
    const actualShape = d.actualShape || [],
      expectedShape = d.expectedShape || [];
    if (actualShape.join(',') !== expectedShape.join(','))
      return `${target} has the wrong shape. ${expectedShape.length === 2 ? `Create a matrix with ${expectedShape[0]} rows and ${expectedShape[1]} columns.` : `Store ${scalar(d.expectedLength)} values in a vector.`} Then click Run.`;
    if (
      actualType !== expectedType &&
      !(
        (actualType === 'integer' && expectedType === 'double') ||
        (actualType === 'double' && expectedType === 'integer')
      )
    ) {
      const names = {
        character: 'text',
        double: 'numbers',
        integer: 'numbers',
        logical: 'TRUE/FALSE values',
        list: 'a list',
      };
      return `${target} contains ${names[actualType] || actualType}, but it needs ${names[expectedType] || expectedType}. ${expectedType === 'character' ? 'Put text in quotation marks.' : actualType === 'character' ? 'Remove quotation marks from numbers, or convert numeric text with as.numeric().' : 'Check the value you assign.'} Then click Run.`;
    }
    if (scalar(d.actualLength) !== scalar(d.expectedLength))
      return `${target} contains ${scalar(d.actualLength)} values; this question needs ${scalar(d.expectedLength)}. Check every value you put in the vector, then click Run.`;
    const missing = scalar(d.hasNA) && !scalar(d.expectedHasNA);
    if (missing)
      return `${target} contains NA, which means a value is missing. Check your index or text-to-number conversion, then click Run.`;
    return `${target} is ${actual}; expected ${expected}. ${check.customMessage ? check.message : 'Change the calculation that creates ' + target + '.'} Then click Run.`;
  }
  return `${target ? `${target} exists, but it does not yet meet this requirement. ` : ''}${check.message} Then click Run.`;
}
export function explainRError(message, code) {
  if (/object ['‘"](.+?)['’"] not found/.test(message)) {
    const name = message.match(/object ['‘"](.+?)['’"] not found/)[1];
    return `R cannot find ${name}. Check its spelling and capital letters, or create it with ${name} <- ... before using it. Then click Run.`;
  }
  if (/INCOMPLETE_STRING|unexpected end of input/.test(message)) {
    const openQuote = unfinishedQuote(code);
    if (openQuote)
      return `The text on line ${openQuote.line} is missing its closing ${openQuote.quote} quotation mark. Add it, then click Run.`;
    const tail = code.trim().split('\n').at(-1);
    if (/[+*/^<>=&|%-]\s*$/.test(tail))
      return 'The last line ends with an operator. Add the value that comes after it, then click Run.';
    return 'The code is unfinished. Check that each opening parenthesis, bracket, and brace has a closing one, then click Run.';
  }
  if (/non-numeric argument/.test(message))
    return 'R tried to calculate with text instead of a number. Remove quotation marks from numbers, or use as.numeric() for numeric text. Then click Run.';
  if (/could not find function ["‘'](.+?)["’']/.test(message)) {
    const name = message.match(/could not find function ["‘'](.+?)["’']/)[1];
    return `R does not recognise the function ${name}. Check its spelling against the Source material or open Hint, then click Run.`;
  }
  if (/subscript out of bounds/.test(message))
    return 'That row or column does not exist. Check the size of the table and use positions starting from 1. Then click Run.';
  if (/incorrect number of dimensions/.test(message))
    return 'The index does not match this object. Use x[position] for a vector and x[row, column] for a matrix. Then click Run.';
  if (/cannot open|No such file/.test(message))
    return 'R could not open the file. Check its exact filename and path. Include the commands that create the file if this task asks you to save one. Then click Run.';
  if (/unexpected/.test(message))
    return `R could not read part of your code: ${message}. Check quotation marks, commas, and brackets on the reported line, then click Run.`;
  return `${message}. Check the line mentioned in Output, or open Hint for the next step. Your code is still in the editor.`;
}
function unfinishedQuote(code) {
  let quote = null,
    line = 1,
    start = 1,
    comment = false,
    escaped = false;
  for (const c of code) {
    if (c === '\n') {
      line++;
      comment = false;
    }
    if (comment) continue;
    if (escaped) {
      escaped = false;
      continue;
    }
    if (quote && c === '\\') {
      escaped = true;
      continue;
    }
    if (!quote && c === '#') {
      comment = true;
      continue;
    }
    if (quote && c === quote) quote = null;
    else if (!quote && (c === '"' || c === "'")) {
      quote = c;
      start = line;
    }
  }
  return quote ? { quote, line: start } : null;
}
export const choiceMistakes = {
  'expression-state': [
    'total_cost + 10 calculates 130 but does not save it. Look for an assignment arrow before deciding that total_cost changed.',
    null,
    'The first output happens before adding the fee. Start with the saved value 120 and follow each line.',
  ],
  rstudio: [
    null,
    'RStudio is the application with the editor and console. R is the language and runtime that executes code.',
    'Saving puts code in a file. You still have to execute it with Run, Cmd/Ctrl + Enter, or source().',
  ],
  coercion: [
    'An atomic vector cannot keep three separate types. The text value makes the numbers and logical values become text.',
    null,
    'R allows the combination by converting all the values to one type. Consider which type can represent all three.',
  ],
  'paper-fee': [
    'x + 5 does not save 25. Follow the final assignment, which doubles the saved 20.',
    null,
    'The 25 was never saved in x. Apply the final multiplication to 20.',
  ],
  'paper-quotes': [
    '24 is a number, so adding 1 works. Find the addition that uses quotation marks.',
    null,
    'class() inspects a type; it does not add to the text. Find the expression that tries to add 1 to quoted text.',
  ],
  'paper-delete': [
    'rm(score) removed the saved 8. The last line tries to use a name that no longer exists.',
    'Removing a name does not set it to NULL. The name is gone from the session.',
    null,
  ],
  'paper-modulo': [
    null,
    '17 %% 5 leaves 2. 17 %/% 5 gives 3 full groups. Add those two results.',
    '3.4 is the result of ordinary division. %/% counts whole groups and %% gives the leftover amount.',
  ],
  'paper-matrix': [
    'Without byrow = TRUE, the matrix fills columns first. Write the three columns as (1,2), (3,4), (5,6), then select row 2.',
    '5 is in row 1 of column 3. The question asks for row 2.',
    null,
  ],
  'paper-list': [
    'Single brackets return a smaller list. Double brackets extract the value inside it.',
    null,
    'names(report) returns sales and label, not the numbers stored inside sales.',
  ],
  'paper-na': [
    'R does not insert zero into the skipped position. An unassigned position is missing.',
    null,
    'Assigning to position 4 creates four positions. The skipped third position is filled with NA.',
  ],
  'paper-factor': [
    'C is not in the existing levels. Assigning a new category does not automatically add that level.',
    null,
    'The object remains a factor. A category that is not in its levels becomes NA.',
  ],
  'paper-class': [
    'Removing the explicit data.frame class leaves a list, which still has the implicit class list.',
    'unclass(df) returns a changed copy. That returned copy is a list; the original df is still a data frame.',
    null,
  ],
};
