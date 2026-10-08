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
  practice: [
    written(
      'ps2-panes',
      'PS 2 · Where does the work happen?',
      'Name the RStudio pane for: saving commands for tomorrow; seeing the result of 6 + 4; checking whether ticket_price exists; reading mean documentation. Explain why saving a script does not run it.',
      'Source Editor; Console; Environment; Help. Saving writes the script to disk. Execute its commands (Cmd/Ctrl + Enter) or use source(). R executes code; RStudio provides the interface.',
      { source: 'PS 2 · Q1' },
    ),
    code(
      'ps2-tickets',
      'PS 2 · Predict, run, explain',
      'Predict the last three outputs before running. Then add a command that stores the cost including the fee in amount_due.',
      '# Cost of three tickets\nticket_price <- 40\nticket_count <- 3\ntotal_cost <- ticket_price * ticket_count\ntotal_cost\ntotal_cost + 10 # Add a booking fee\ntotal_cost\n# Store amount_due.',
      'ticket_price <- 40\nticket_count <- 3\ntotal_cost <- ticket_price * ticket_count\ntotal_cost\ntotal_cost + 10\ntotal_cost\namount_due <- total_cost + 10',
      'The outputs are 120, 130, 120. An expression does not reassign total_cost. Comments document the script and do not execute.',
      [value('total_cost', '120'), value('amount_due', '130')],
      {
        source: 'PS 2 · Q2',
        manual:
          'The saved values are checked. Compare the three printed values with your prediction; your explanation is self-reviewed.',
        hints: ['Store the extra-fee expression in a new object.', 'amount_due <- total_cost + 10'],
      },
    ),
    code(
      'ps2-types',
      'PS 2 · Numbers and text',
      'Create seat_count as 24 and room_label as "24". Inspect their classes. Reassign seat_count to "full", inspect its new class, then restore it to numeric 24.',
      '# Create, inspect, reassign, and restore.',
      'seat_count <- 24\nroom_label <- "24"\nclass(seat_count)\nclass(room_label)\nseat_count <- "full"\nclass(seat_count)\nseat_count <- 24',
      'Only numeric seat_count supports adding 1 directly. Reassignment replaces the previous value and can change its class.',
      [value('seat_count', '24'), value('room_label', '"24"')],
      {
        source: 'PS 2 · Q3',
        manual:
          'Only the final values are checked. Also inspect the intermediate classes and explain why assigning "full" changes the type.',
      },
    ),
    code(
      'ps2-remove',
      'PS 2 · Remove an object, keep the script',
      'Create ps01_note as "practice" and ps01_score as 8. Remove only the note. Try printing it, then recreate it by rerunning its assignment.',
      'ps01_note <- "practice"\nps01_score <- 8',
      'ps01_note <- "practice"\nps01_score <- 8\nls()\nrm(ps01_note)\n# print(ps01_note) would report object not found.\nps01_note <- "practice"\nls()',
      'The removed object is gone from memory, but the assignment remains in your script. Re-executing it recreates the object.',
      [value('ps01_note', '"practice"'), value('ps01_score', '8')],
      {
        source: 'PS 2 · Q4',
        manual:
          'Run the removal and failed print separately to observe the error, then restore the object before checking.',
      },
    ),
    written(
      'ps2-help',
      'PS 2 · Ask R for help',
      'Give two commands that open mean documentation and one that runs its examples. What does mean calculate? Name two useful parts of a help page.',
      'help("mean") and ?mean open documentation. example(mean) executes examples. The arithmetic mean is the sum divided by the number of values. Usage, arguments, value, and examples help explain how to call the function.',
      {
        source: 'PS 2 · Q5',
        desktop:
          'In RStudio, open both help commands and run example(mean). Inspect the Help pane and the Console.',
      },
    ),
    code(
      'ps2-script',
      'PS 2 · Save today, reproduce tomorrow',
      'Run the supplied ticket-cost.R script. Store the current working directory in folder. In a # comment, explain what you would check if the file could not be opened.',
      '# Run the script and inspect the folder.',
      'folder <- getwd()\nsource("ticket-cost.R")\n# Check the working directory, filename, and path if opening fails.',
      'The script prints 140. Check the folder and exact filename/path. A script records the steps; .RData stores objects. Opening a script in a fresh session does not recreate bill until you execute it.',
      [
        value('bill', '140'),
        check(
          'exists("folder", inherits=FALSE) && identical(folder, getwd())',
          'Store getwd() in folder.',
        ),
      ],
      {
        source: 'PS 2 · Q6',
        manual:
          'The saved values are checked. Review your note about the working directory, filename, and path yourself.',
        files: {
          'ticket-cost.R': 'price <- 35\nquantity <- 4\nbill <- price * quantity\nprint(bill)',
        },
        desktop:
          'Save your own ps01.R in RStudio. Restart R without restoring a workspace and execute the script to reproduce your work.',
      },
    ),
    code(
      'lab2-three',
      'Lab 2 · Three numbers',
      'For A = 13, B = 27, C = 14, store the sum in total, the mean in average, and the product in product.',
      'A <- 13\nB <- 27\nC <- 14',
      'A <- 13\nB <- 27\nC <- 14\ntotal <- A + B + C\naverage <- total / 3\nproduct <- A * B * C',
      'The total is 54, the mean is 18, and the product is 4914.',
      [value('total', '54'), value('average', '18'), value('product', '4914')],
      {
        source: 'Lab 2 · Exercise 1',
        hints: ['The mean is the total divided by 3.', 'product <- A * B * C'],
      },
    ),
    code(
      'lab2-operators',
      'Lab 2 · Difference, power, remainder',
      'With num1 = 13 and num2 = 5, store the difference, power, and remainder in difference, power, and remainder.',
      'num1 <- 13\nnum2 <- 5',
      'num1 <- 13\nnum2 <- 5\ndifference <- num1 - num2\npower <- num1 ^ num2\nremainder <- num1 %% num2',
      'The results are 8, 371293, and 3. %% returns what remains after whole groups of the divisor are removed.',
      [value('difference', '8'), value('power', '371293'), value('remainder', '3')],
      {
        source: 'Lab 2 · Exercise 2',
        hints: ['Use ^ for powers and %% for remainders.', 'remainder <- num1 %% num2'],
      },
    ),
    code(
      'lab2-compound',
      'Lab 2 · Compound interest',
      'Use S = A * (1 + i / 100)^n. For i = 12 and n = 5, calculate A = 1000 and A = 500. Store results rounded to two decimal places in amount_1000 and amount_500.',
      'i <- 12\nn <- 5',
      'i <- 12\nn <- 5\nA <- 1000\namount_1000 <- round(A * (1 + i / 100)^n, 2)\nA <- 500\namount_500 <- round(A * (1 + i / 100)^n, 2)\namount_1000\namount_500',
      'The amounts are 1762.34 and 881.17. The rate is monthly and the duration is five months in this exercise.',
      [value('amount_1000', '1762.34'), value('amount_500', '881.17')],
      {
        source: 'Lab 2 · Exercise 3',
        hints: ['Convert 12 percent into 0.12 with i / 100.', 'round(A * (1 + i / 100)^n, 2)'],
      },
    ),
    code(
      'lab2-seconds',
      'Lab 2 · Convert time to seconds',
      'How many seconds are in 5 years, 2 months, 4 days, 3 hours, and 2 minutes? Use 365 days per year and 30 days per month. Store the total in seconds.',
      '# Convert every duration to seconds.',
      'days <- 5 * 365 + 2 * 30 + 4\nseconds <- days * 24 * 60 * 60 + 3 * 60 * 60 + 2 * 60\nseconds',
      'First combine years, months, and days into 1889 days. Then add hours and minutes in seconds. Total: 163220520.',
      [value('seconds', '163220520')],
      {
        source: 'Lab 2 · Exercise 4',
        hints: [
          'A day contains 24 * 60 * 60 seconds.',
          'Combine day-based durations before multiplying; add hours and minutes separately.',
        ],
      },
    ),
    code(
      'lab2-future',
      'Lab 2 · Future value',
      'Use FV = PV * (1 + r)^n for PV = 1000, annual r = 8%, n = 5 years. Store the unrounded result in FV.',
      'PV <- 1000\nr <- 0.08\nn <- 5',
      'PV <- 1000\nr <- 0.08\nn <- 5\nFV <- PV * (1 + r)^n\nFV',
      'FV is 1469.3280768, or 1469.33 rounded for display. Unlike the previous exercise, the rate is already a decimal.',
      [value('FV', '1000 * 1.08^5')],
      {
        source: 'Lab 2 · Exercise 5',
        hints: ['Use the decimal r directly.', 'FV <- PV * (1 + r)^n'],
      },
    ),
    code(
      'lab2-pi',
      'Lab 2 · Four transformations of pi',
      'Calculate the square, square root, floor, and ceiling of the original pi. Store them in squared, rooted, lower, upper; multiply them into product.',
      '# Use the original pi for each calculation.',
      'squared <- pi^2\nrooted <- sqrt(pi)\nlower <- floor(pi)\nupper <- ceiling(pi)\nproduct <- squared * rooted * lower * upper\nproduct',
      'Each function uses pi, not the previous result. floor(pi) is 3 and ceiling(pi) is 4.',
      [
        value('squared', 'pi^2'),
        value('rooted', 'sqrt(pi)'),
        value('lower', '3'),
        value('upper', '4'),
        value('product', 'pi^2 * sqrt(pi) * 3 * 4'),
      ],
      {
        source: 'Lab 2 · Exercise 6',
        hints: [
          'Use sqrt(), floor(), and ceiling().',
          'Keep each calculation separate, then multiply the four objects.',
        ],
      },
    ),
  ],
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
