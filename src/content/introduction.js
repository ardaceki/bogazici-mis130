import { introductionPractice } from './course-practice.js';
import { code, choice, written, check, value } from './helpers.js';
export default {
  id: 'introduction',
  weeks: 'Weeks 1–2',
  number: '01',
  title: 'First steps in R',
  subtitle: 'Calculations, objects, and reproducible scripts',
  source: 'Lecture 1 · PS 2 · Lab 2',
  sources: ['Week 1/Lec_01.pdf', 'Week 2/PS-02.html', 'Week 2/Lab-02.html'],
  learn: [
    code(
      'first-calculation',
      'Start with 1 + 1',
      'The code is ready. Click Run to add these two numbers.',
      '1 + 1',
      '1 + 1',
      'The answer is 2. R did the addition for you.',
      [
        check(
          'isTRUE(all.equal(.workshop_result, 2))',
          'Keep 1 + 1 in the editor, then click Run.',
        ),
      ],
      { hints: ['You do not need to type yet. Just click Run.'] },
    ),
    code(
      'change-number',
      'Change one number',
      'Click the code. Change the last 1 to 2. Then click Run.',
      '1 + 1',
      '1 + 2',
      '1 + 2 gives 3. You changed the code, so the answer changed.',
      [check('isTRUE(all.equal(.workshop_result, 3))', 'Change 1 + 1 to 1 + 2.')],
      { hints: ['The code should read 1 + 2.'] },
    ),
    code(
      'multiply',
      'Multiply two numbers',
      'R uses * for multiplication. Replace the code with 4 * 3, then click Run.',
      '1 + 2',
      '4 * 3',
      '4 * 3 gives 12. The * symbol means multiply.',
      [check('isTRUE(all.equal(.workshop_result, 12))', 'Type 4 * 3.')],
      { hints: ['Type the star symbol between 4 and 3.'] },
    ),
    code(
      'ticket-calculation',
      'Try it yourself',
      'One ticket costs 40. Calculate the cost of three tickets.',
      '',
      '40 * 3',
      '40 * 3 gives 120.',
      [check('isTRUE(all.equal(.workshop_result, 120))', 'Multiply the ticket price by 3.')],
      { hints: ['Use * to multiply.', 'Type 40 * 3.'] },
    ),
    code(
      'order',
      'Order of operations',
      'Calculate the cost of three 40-unit tickets plus a single 10-unit booking fee.',
      '40 * 3 + 10',
      '40 * 3 + 10',
      'Multiplication happens before addition. (40 + 10) * 3 would charge the fee three times.',
      [
        check(
          'isTRUE(all.equal(.workshop_result, 130))',
          'The booking fee is charged once, after multiplying the ticket price by the quantity.',
        ),
      ],
      {
        concept: 'Use parentheses when you want to change the order of a calculation.',
        hints: ['Calculate the tickets first, then add the fee.', '40 * 3 + 10'],
      },
    ),
    code(
      'assignment',
      'Give a value a name',
      'Store 40 in ticket_price and 3 in ticket_count. Store their product in total_cost, then display total_cost.',
      'ticket_price <- 40\n# Add the remaining commands.',
      'ticket_price <- 40\nticket_count <- 3\ntotal_cost <- ticket_price * ticket_count\ntotal_cost',
      'The assignment arrow stores a value. A bare object name displays it. Look in Objects to see all three values.',
      [value('ticket_price', '40'), value('ticket_count', '3'), value('total_cost', '120')],
      {
        concept:
          'An object is a named value in your R session. <- assigns the value on its right to the name on its left.',
        hints: ['Use <- to create ticket_count.', 'total_cost <- ticket_price * ticket_count'],
      },
    ),
    choice(
      'expression-state',
      'Does a calculation change an object?',
      'Predict the three displayed values.',
      'total_cost <- 120\ntotal_cost\ntotal_cost + 10\ntotal_cost',
      ['120, 130, 130', '120, 130, 120', '130, 130, 130'],
      1,
      'Adding 10 returns 130, but it does not replace total_cost. You need an assignment to change the stored value.',
    ),
    code(
      'reassignment',
      'Keep the new result',
      'Create total_cost as 120. Add a 10-unit booking fee and store the new value back in total_cost.',
      'total_cost <- 120\n# Update total_cost.',
      'total_cost <- 120\ntotal_cost <- total_cost + 10\ntotal_cost',
      'R evaluates the right side using the old value, then replaces the value associated with the name.',
      [value('total_cost', '130')],
      { hints: ['The name can appear on both sides of <-.', 'total_cost <- total_cost + 10'] },
    ),
    code(
      'number-text',
      'A number or a label?',
      'Create seat_count as the number 24 and room_label as the text "24". Store their classes in seat_type and room_type.',
      'seat_count <- 24\nroom_label <- "24"',
      'seat_count <- 24\nroom_label <- "24"\nseat_type <- class(seat_count)\nroom_type <- class(room_label)',
      'Quotation marks create text. You can add 1 to seat_count, but room_label is a character label, not a number.',
      [
        value('seat_count', '24'),
        value('room_label', '"24"'),
        value('seat_type', '"numeric"'),
        value('room_type', '"character"'),
      ],
      {
        concept:
          'class() describes the kind of object. Numbers without quotes and characters inside quotes behave differently.',
        hints: ['Call class() on each object.', 'seat_type <- class(seat_count)'],
      },
    ),
    code(
      'comments',
      'Leave a note',
      'Add a comment describing the calculation. Store the cost of four tickets at 35 each in bill.',
      '\n# Write a comment and the calculation.',
      ' # Cost of four tickets\nbill <- 35 * 4\nbill',
      'Everything after # on a line is a comment. R ignores it; it explains the code to a reader.',
      [
        value('bill', '140'),
        check(
          'any(utils::getParseData(parse(text=.workshop_code, keep.source=TRUE))$token == "COMMENT")',
          'Add a comment beginning with # to explain your calculation.',
        ),
      ],
      {
        hints: ['Start your note with #.', 'bill <- 35 * 4'],
        manual:
          'The result and presence of a comment are checked. Review whether your comment explains the calculation clearly.',
      },
    ),
    code(
      'workspace',
      'See and remove objects',
      'Create note as "practice" and score as 8. List your objects with ls(). Remove only note; keep score.',
      'note <- "practice"\nscore <- 8',
      'note <- "practice"\nscore <- 8\nls()\nrm(note)\nls()',
      'rm() removes a session object. It does not delete the code that created it. Running the assignment again recreates it.',
      [check('!exists("note", inherits=FALSE)', 'Remove note with rm(note).'), value('score', '8')],
      { hints: ['Use ls() to list names, rm() to remove a name.', 'rm(note)'] },
    ),
    choice(
      'rstudio',
      'R and RStudio',
      'Which statement correctly describes R and RStudio?',
      null,
      [
        'R is the language and runtime; RStudio is an application for working with R.',
        'RStudio is another name for the R language.',
        'Saving a script in RStudio automatically executes it.',
      ],
      0,
      'R executes the code. RStudio provides an editor, console, environment viewer, and help/plot panels. Saving code and executing code are separate actions.',
    ),
    code(
      'working-directory',
      'Find your working directory',
      'Store the current working directory in working_directory. List the files there and store their names in files.',
      '# Inspect the session folder.',
      'working_directory <- getwd()\nfiles <- list.files()\nworking_directory\nfiles',
      'Relative paths start from the working directory. In this website, the folder belongs to a virtual R filesystem, not your computer.',
      [
        check(
          'exists("working_directory", inherits=FALSE) && identical(working_directory, getwd())',
          'Use getwd() and store its result in working_directory.',
        ),
        check(
          'exists("files", inherits=FALSE) && identical(files, list.files())',
          'Store list.files() in files.',
        ),
      ],
      {
        hints: ['getwd() returns the folder path.', 'files <- list.files()'],
        details:
          'In desktop R, setwd("path/to/folder") changes the working directory. Paths are character strings. Use forward slashes; spelling and case must match the actual file.',
      },
    ),
    code(
      'scripts',
      'Run a saved script',
      'A file named ticket-cost.R is already in this task’s folder. Run it with source(), then inspect bill.',
      '# Run ticket-cost.R.',
      'source("ticket-cost.R")\nbill',
      'source() executes the commands saved in a script. Opening the file alone does not execute it. This script calculates 35 * 4.',
      [
        value(
          'bill',
          '140',
          'Run source("ticket-cost.R") to recreate bill from the saved commands.',
        ),
      ],
      {
        files: {
          'ticket-cost.R': 'price <- 35\nquantity <- 4\nbill <- price * quantity\nprint(bill)',
        },
        hints: ['Pass the filename as a quoted string to source().', 'source("ticket-cost.R")'],
      },
    ),
    code(
      'reproduce',
      'Save the steps, not just the result',
      'Create a script called my-bill.R containing bill <- 35 * 4. Use writeLines() to save the command, then source() to run it.',
      '# Save and run a one-line script.',
      'writeLines("bill <- 35 * 4", "my-bill.R")\nsource("my-bill.R")\nbill',
      'An .R script records instructions. An .RData workspace records objects. Re-running a script in a fresh session reproduces the calculation.',
      [
        value('bill', '140'),
        check(
          `file.exists("my-bill.R") && local({
            saved <- new.env(parent=baseenv())
            source("my-bill.R", local=saved)
            exists("bill", envir=saved, inherits=FALSE) &&
              is.numeric(saved$bill) && length(saved$bill)==1 && isTRUE(saved$bill==140)
          })`,
          'Save a working my-bill.R script that creates bill = 140 in a fresh session.',
        ),
      ],
      {
        hints: [
          'writeLines("R command", "filename.R") saves a text file.',
          'writeLines("bill <- 35 * 4", "my-bill.R")\nsource("my-bill.R")',
        ],
        details:
          'writeLines() is a bridge for practising file handling here. In RStudio, use File → Save to save your script. save.image("workspace.RData") saves session objects; load("workspace.RData") restores them.',
      },
    ),
    code(
      'help',
      'Read a function’s help',
      'Compute the mean of 10, 20, and 30 and store it in average. Use Source to read the course material and Hint for help with this calculation.',
      'values <- c(10, 20, 30)\n# Find their mean.',
      'values <- c(10, 20, 30)\naverage <- mean(values)\naverage',
      'mean() adds the values and divides by their count. help("mean") and ?mean open documentation in desktop R; example(mean) runs examples.',
      [value('average', '20')],
      {
        hints: ['A function call puts its inputs inside parentheses.', 'average <- mean(values)'],
        details:
          'A help page describes purpose, usage, arguments, return values, and examples. The official R documentation is available at https://stat.ethz.ch/R-manual/R-release/library/base/html/mean.html. For the full RStudio exercise, open help("mean"), compare it with ?mean, and run example(mean).',
      },
    ),
  ],
  practice: introductionPractice,
  exam: [
    choice(
      'paper-fee',
      'Trace an assignment',
      'Predict the final value of x.',
      'x <- 20\nx + 5\nx <- x * 2',
      ['25', '40', '50'],
      1,
      'x + 5 does not replace x. The last assignment multiplies the stored 20 by 2.',
    ),
    choice(
      'paper-quotes',
      'Recognise a type',
      'Which command will fail because it tries arithmetic on text?',
      null,
      ['24 + 1', '"24" + 1', 'class("24")'],
      1,
      '"24" is a character string. R does not automatically convert it to a number for addition.',
    ),
    written(
      'paper-script',
      'Script or workspace?',
      'Explain the difference between .R and .RData. How would you recreate bill in a fresh session?',
      'An .R file stores commands; an .RData file stores objects. Execute the saved script, for example source("ticket-cost.R"), to recreate bill.',
    ),
    choice(
      'paper-delete',
      'An object is missing',
      'What happens at the last line?',
      'score <- 8\nrm(score)\nprint(score)',
      ['It prints 8.', 'It prints NULL.', 'It reports that score was not found.'],
      2,
      'rm() removes the object. The saved creation command is still available to run again.',
    ),
    written(
      'paper-write',
      'Write code without running',
      'Write R code to calculate the cost of four 35-unit tickets and a single 8-unit fee. Store the answer in bill.',
      'price <- 35\nquantity <- 4\nbill <- price * quantity + 8\n\nThe result is 148. Multiplying (35 + 8) by 4 would apply the fee to each ticket.',
    ),
  ],
};
