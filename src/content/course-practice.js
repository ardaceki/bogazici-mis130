import { check, value } from './helpers.js';
import {
  answers,
  sequence,
  stateValue,
  displayed,
  sourceExecuted,
  sourcedValue,
} from './course-checks.js';
import { instructorSolutions } from './instructor-solutions.js';

const field = (label, expected, names = [], resultNames = names) => ({
  label,
  expected,
  names,
  resultNames,
});
const namedAnswer = (label, expected, ...names) => field(label, expected, names);
// Every Lab 5 exercise is independently runnable: Run always starts fresh.
const branches =
  'branch_a <- c(42,35,51,28)\nbranch_b <- c(45,31,58,33)\nbranch_c <- c(40,39,55,30)';
const salesInput = branches + '\nsales <- rbind(branch_a, branch_b, branch_c)';
const trafficInput =
  'traffic <- matrix(c(18,24,30,21,27,33,20,26,35,22,29,38), nrow=3, byrow=TRUE)\nrownames(traffic) <- c("R1","R2","R3")\ncolnames(traffic) <- c("08","10","12","14")';
const countsInput =
  'counts <- matrix(c(42,51,48,55,39,410,44,50,36,45,47,49), nrow=3, byrow=TRUE)\nrownames(counts) <- c("A","B","C")\ncolnames(counts) <- c("P1","P2","P3","P4")';
const salesExpected = 'matrix(c(42,35,51,28,45,31,58,33,40,39,55,30),3,byrow=TRUE)';
const selfReview =
  'Code checks cover the requested values and structures. Self-review your predictions and written explanations; the site cannot verify that you predicted before running. When a particular function or indexing method is requested, compare your method with the source as well.';
const definitions = {
  'ps2-panes': {
    title: 'PS 2 · Where does the work happen?',
    kind: 'written',
    source: 'PS 2 · Q1',
    hints: [
      'Compare your answer point by point with the suggested answer. Different wording is fine if the meaning is the same.',
    ],
    prompt:
      'Name the RStudio pane for each situation: writing and saving commands for tomorrow; seeing the result of 6 + 4; checking whether ticket_price exists; reading mean documentation. Explain what is missing when someone saves a script and assumes it has run. Explain the difference between R and RStudio in one sentence.',
    answer:
      'Source Editor; Console; Environment; Help. Saving a script stores its text; it does not execute it. Run selected commands with Cmd/Ctrl + Enter or source the script. R is the language and computing environment; RStudio is an interface for working with R.\n\nSelf-review: did you identify all four panes, distinguish saving from running, and distinguish R from RStudio? Equivalent wording is accepted.',
  },
  'ps2-tickets': {
    title: 'PS 2 · Predict, run, explain',
    kind: 'code',
    starter:
      '# Cost of three tickets\nticket_price <- 40\nticket_count <- 3\ntotal_cost <- ticket_price * ticket_count\ntotal_cost\ntotal_cost + 10 # Add a booking fee\ntotal_cost\n# Store amount_due.',
    explanation:
      'The outputs are 120, 130, 120. An expression does not reassign total_cost. Comments document the script and do not execute.',
    source: 'PS 2 · Q2',
    prompt:
      'Predict the three outputs: total_cost, total_cost + 10, total_cost. Then run the script and store the cost including the fee in amount_due. Explain in comments whether total_cost + 10 changes total_cost and what the two comments do.',
    checks: [value('total_cost', '120'), value('amount_due', '130')],
    manual:
      'Automatic checks cover total_cost and amount_due. Self-review: your predictions should be 120, 130, 120; the fee expression does not reassign total_cost, and R ignores comments.',
  },
  'ps2-types': {
    title: 'PS 2 · Numbers and text',
    kind: 'code',
    starter: '# Create, inspect, reassign, and restore.',
    explanation:
      'Only numeric seat_count supports adding 1 directly. Reassignment replaces the previous value and can change its class.',
    source: 'PS 2 · Q3',
    prompt:
      'Create seat_count = 24 and room_label = "24". Predict and display their classes. Which object can you add 1 to directly? Run that addition. Reassign seat_count to "full", inspect its value and class, then restore its original value. Explain quotation marks and reassignment in comments.',
    observe: ['seat_count', 'room_label'],
    checks: [
      value('seat_count', '24'),
      value('room_label', '"24"'),
      sequence(
        [
          stateValue('.state', 'seat_count', '24'),
          stateValue('.state', 'seat_count', '"full"'),
          stateValue('.state', 'seat_count', '24'),
        ],
        'Create numeric seat_count = 24, change it to "full", then restore numeric 24. The intermediate change is checked; a final assignment alone is incomplete.',
      ),
    ],
    manual:
      'Values and the numeric → text → numeric transition are checked. Self-review: inspect both initial classes, the result 25, and the new character class; explain why quoted "24" is text and why reassignment replaces the old value.',
  },
  'ps2-remove': {
    title: 'PS 2 · Remove an object, keep the script',
    kind: 'code',
    starter: 'ps01_note <- "practice"\nps01_score <- 8',
    explanation:
      'The removed object is gone from memory, but the assignment remains in your script. Re-executing it recreates the object.',
    source: 'PS 2 · Q4',
    prompt:
      'Create ps01_note = "practice" and ps01_score = 8. List the workspace. Remove only ps01_note and check that ps01_score remains. Predict what happens if you run print(ps01_note), then recreate the note by rerunning its assignment. Explain in comments whether removing an object also changes your saved script.',
    observe: ['ps01_note', 'ps01_score'],
    checks: [
      value('ps01_note', '"practice"'),
      value('ps01_score', '8'),
      sequence(
        [
          `${stateValue('.state', 'ps01_note', '"practice"')} && ${stateValue('.state', 'ps01_score', '8')}`,
          `!isTRUE(.state$ps01_note$exists) && ${stateValue('.state', 'ps01_score', '8')}`,
          `${stateValue('.state', 'ps01_note', '"practice"')} && ${stateValue('.state', 'ps01_score', '8')}`,
        ],
        'Create both objects, remove only ps01_note while keeping ps01_score = 8, then recreate the note. These three workspace states must occur in order.',
      ),
    ],
    manual:
      'Creation, removal with the score retained, and recreation are checked. Self-review the workspace listing, missing-object error, and saved-script explanation. To observe the expected error and continue in one run, use try(print(ps01_note)) after removal. A bare print stops the script; the instructor displays that error separately.',
    hints: [
      'ls() or objects() lists names; unrelated helper objects are allowed.',
      'Remove the note with rm(ps01_note), then rerun ps01_note <- "practice". Use try(print(ps01_note)) between them to observe the expected error.',
    ],
  },
  'ps2-help': {
    title: 'PS 2 · Ask R for help',
    kind: 'written',
    source: 'PS 2 · Q5',
    desktop:
      'In RStudio, open both help commands and run example(mean). Inspect the Help pane and the Console.',
    hints: [
      'Compare your answer point by point with the suggested answer. Different wording is fine if the meaning is the same.',
    ],
    prompt:
      'Give two commands that open mean documentation. Describe what mean calculates. Name two useful help-page sections and explain what they tell you. Give the command that runs the mean examples and explain how that differs from opening documentation.',
    answer:
      'help("mean") and ?mean open documentation. mean calculates the arithmetic mean. Any two relevant sections with sensible explanations work: Description explains the purpose; Usage shows the call; Arguments explains inputs; Value describes the result; Examples shows usage. example(mean) executes example code and may print results, whereas opening help displays documentation.\n\nSelf-review each requested part. You do not need to explain every option on the help page.',
  },
  'ps2-script': {
    title: 'PS 2 · Save today, reproduce tomorrow',
    kind: 'code',
    starter: '# Run the script and inspect the folder.',
    source: 'PS 2 · Q6',
    files: { 'ticket-cost.R': 'price <- 35\nquantity <- 4\nbill <- price * quantity\nprint(bill)' },
    desktop:
      'Save your own ps01.R in RStudio. Restart R without restoring a workspace and execute the script to reproduce your work.',
    sourceValues: ['bill'],
    prompt:
      'Predict the output of ticket-cost.R (price = 35, quantity = 4, bill = price * quantity). The file is already supplied in this browser exercise. Report the working directory and run the saved script. Explain in comments two file checks if it cannot be opened, how to recreate bill in a fresh session, and the difference between .R and .RData.',
    checks: [
      sourceExecuted('ticket-cost.R'),
      sourcedValue('bill', '140'),
      displayed(
        '140',
        'Display the bill produced by the script, using bill, print(bill), or cat(bill). Then click Run.',
      ),
      {
        kind: 'requirement',
        expr: 'any(vapply(.workshop_outputs, function(x) is.character(x) && length(x)==1L && identical(x, getwd()), logical(1))) || (exists("folder",inherits=FALSE) && identical(folder,getwd()))',
        message:
          'Report the current working directory with getwd(), print(getwd()), or cat(getwd()), or save it in folder. The browser has its own directory; your desktop path can differ. Then click Run.',
      },
    ],
    explanation:
      'The supplied script ran successfully and the displayed bill is correct. A script records commands that can be executed again.',
    manual:
      'Execution of the supplied file, bill, its display and the reported working directory are checked. Self-review your filename/path checks, fresh-session explanation and .R versus .RData distinction. Save your own ps01.R when working in desktop RStudio.',
    solutionNote:
      'The instructor assumes ticket-cost.R has been saved first. This browser task supplies that file. The working directory depends on the session.',
  },
  'lab2-three': {
    title: 'Lab 2 · Three numbers',
    kind: 'code',
    starter: 'A <- 13\nB <- 27\nC <- 14',
    explanation: 'The total is 54, the mean is 18, and the product is 4914.',
    source: 'Lab 2 · Exercise 1',
    prompt:
      'Given A = 13, B = 27, C = 14, calculate the sum, mean, and product. Display the three results in that order, return them as a vector or list in that order, or save them as total, average, product.',
    checks: answers([
      namedAnswer('Sum', '54', 'total'),
      namedAnswer('Mean', '18', 'average'),
      namedAnswer('Product', '4914', 'product'),
    ]),
  },
  'lab2-operators': {
    title: 'Lab 2 · Difference, power, remainder',
    kind: 'code',
    starter: 'num1 <- 13\nnum2 <- 5',
    explanation:
      'The results are 8, 371293, and 3. %% returns what remains after whole groups of the divisor are removed.',
    source: 'Lab 2 · Exercise 2',
    prompt:
      'Given num1 = 13 and num2 = 5, calculate the difference, num1 raised to num2, and the remainder of num1 divided by num2. Display or return the three results in that order, or save difference, power, remainder.',
    checks: answers([
      namedAnswer('Difference', '8', 'difference'),
      namedAnswer('Power', '371293', 'power'),
      namedAnswer('Remainder', '3', 'remainder'),
    ]),
  },
  'lab2-compound': {
    title: 'Lab 2 · Compound interest',
    kind: 'code',
    starter: 'i <- 12\nn <- 5',
    explanation:
      'The amounts are 1762.34 and 881.17. The rate is monthly and the duration is five months in this exercise.',
    source: 'Lab 2 · Exercise 3',
    prompt:
      'Use S = A * (1 + i / 100)^n. Assign i = 12 and n = 5; calculate first A = 1000, then A = 500. Display each amount rounded to two decimals. You can also return the two rounded amounts together, or save amount_1000 and amount_500.',
    observe: ['A'],
    checks: [
      value('i', '12'),
      value('n', '5'),
      ...answers([
        namedAnswer('Amount for A = 1000 (two decimals)', '1762.34', 'amount_1000'),
        namedAnswer('Amount for A = 500 (two decimals)', '881.17', 'amount_500'),
      ]),
      sequence(
        [stateValue('.state', 'A', '1000'), stateValue('.state', 'A', '500')],
        'Assign A = 1000 for the first calculation, then A = 500 for the second calculation.',
      ),
    ],
    manual:
      'Inputs i and n, both A assignments, and both rounded amounts are checked. Review why S must be recalculated after changing A; an assignment does not update previously saved results.',
  },
  'lab2-seconds': {
    title: 'Lab 2 · Convert time to seconds',
    kind: 'code',
    starter: '# Convert every duration to seconds.',
    explanation:
      'First combine years, months, and days into 1889 days. Then add hours and minutes in seconds. Total: 163220520.',
    source: 'Lab 2 · Exercise 4',
    prompt:
      'How many seconds are in 5 years, 2 months, 4 days, 3 hours and 2 minutes? Use 365 days per year and 30 days per month. Display the total, or save it as total_seconds or seconds.',
    checks: answers([namedAnswer('Total seconds', '163220520', 'total_seconds', 'seconds')]),
  },
  'lab2-future': {
    title: 'Lab 2 · Future value',
    kind: 'code',
    starter: 'PV <- 1000\nr <- 0.08\nn <- 5',
    explanation:
      'FV is 1469.3280768, or 1469.33 rounded for display. Unlike the previous exercise, the rate is already a decimal.',
    source: 'Lab 2 · Exercise 5',
    prompt:
      'Calculate FV = PV * (1 + r)^n for PV = 1000, annual r = 8%, n = 5 years. Display the full-precision result, or save it as FV. You can round a separate display to cents; retain the unrounded FV for checking.',
    checks: answers([namedAnswer('Future value (unrounded)', '1000 * 1.08^5', 'FV')]),
  },
  'lab2-pi': {
    title: 'Lab 2 · Four transformations of pi',
    kind: 'code',
    starter: '# Use the original pi for each calculation.',
    explanation:
      'Each function uses pi, not the previous result. floor(pi) is 3 and ceiling(pi) is 4.',
    source: 'Lab 2 · Exercise 6',
    prompt:
      'Calculate the square, square root, floor, and ceiling of the original pi separately, then multiply the four results. Display or return all five results in that order. Alternatively save the four calculations as sq, sq_root, pi_floor, pi_ceiling (or squared, rooted, lower, upper), then display the product or save it as product.',
    checks: [
      ...answers([
        namedAnswer('Square of pi', 'pi^2', 'sq', 'squared'),
        namedAnswer('Square root of pi', 'sqrt(pi)', 'sq_root', 'rooted'),
        namedAnswer('Floor of pi', '3', 'pi_floor', 'lower'),
        namedAnswer('Ceiling of pi', '4', 'pi_ceiling', 'upper'),
        { ...namedAnswer('Product', 'pi^2 * sqrt(pi) * 3 * 4', 'product'), lastResult: true },
      ]),
    ],
    manual:
      'The four separate results and product are checked. Review that each operation uses the original pi. The printed approximation 209.921 is not the full-precision value.',
  },
  'ps3-debug': {
    title: 'PS 3 · Syntax debugging',
    kind: 'code',
    starter: 'x <- 10\ny <- "apple\nz <- x + 5\nprint(z)',
    explanation:
      'The quotation mark ending "apple" is missing. R cannot parse the intended separate statements until the string is closed.',
    source: 'PS 3 · Q1',
    prompt:
      'Find the parsing problem in the starter script, identify the affected line, and correct the script. Preserve its intended values and calculation, then display z. Explain in a comment why the original script cannot be parsed.',
    checks: [
      value('x', '10'),
      value('y', '"apple"'),
      value('z', '15'),
      displayed(
        '15',
        'Display z after correcting the script: use z, print(z), or cat(z). Then click Run.',
      ),
    ],
    manual:
      'The three saved values, successful execution and displayed result are checked. Self-review your identification of line 2 and explanation of the unmatched quotation mark.',
  },
  'ps3-operators': {
    title: 'PS 3 · Operator practice',
    kind: 'code',
    starter: 'a <- 17\nb <- 5\np <- TRUE\nq <- FALSE',
    explanation:
      'The remainder is 2, the integer quotient 3, and the sum 5. The logical answers are TRUE, TRUE, FALSE.',
    source: 'PS 3 · Q2',
    prompt:
      'Use a = 17, b = 5, p = TRUE, q = FALSE. Calculate a %% b, a %/% b, their sum, a > b, (a > b) & p, and (a < b) | q. Display the six answers in that order or return a list. The instructor uses list entries modulo, integer_division, combined, gt, and_case, or_case. Separate remainder, quotient, combined, greater, both, either objects also work. Interpret the operators in comments.',
    checks: answers([
      field('Remainder', '2', ['remainder', 'modulo'], ['modulo', 'remainder']),
      field(
        'Integer quotient',
        '3',
        ['quotient', 'integer_division'],
        ['integer_division', 'quotient'],
      ),
      namedAnswer('Combined value', '5', 'combined'),
      field('a > b', 'TRUE', ['greater', 'gt'], ['gt', 'greater']),
      field('AND result', 'TRUE', ['both', 'and_case'], ['and_case', 'both']),
      field('OR result', 'FALSE', ['either', 'or_case'], ['or_case', 'either']),
    ]),
    manual:
      'All six typed results are checked. Self-review your interpretation: %% is remainder, %/% is integer quotient; the logical results are TRUE, TRUE, FALSE. Use a list for mixed numeric and logical results; c() converts them to one type.',
  },
  'ps3-length': {
    title: 'PS 3 · Changing object length',
    kind: 'code',
    starter: 'x <- c(4, 8, 12)',
    explanation: 'The extension adds three NA values. The final x contains 4 and 8.',
    source: 'PS 3 · Part B',
    prompt:
      'Start x as c(4, 8, 12), extend x to length 6, then truncate x to length 2. The intermediate workspace state is checked automatically; saving x_extended or extended is optional. Explain in a comment what fills the new positions, and report the final x.',
    observe: ['x'],
    checks: [
      value('x', 'c(4,8)'),
      sequence(
        [
          stateValue('.state', 'x', 'c(4,8,12)'),
          stateValue('.state', 'x', 'c(4,8,12,NA,NA,NA)'),
          stateValue('.state', 'x', 'c(4,8)'),
        ],
        'Start with c(4, 8, 12), extend x to c(4, 8, 12, NA, NA, NA), then truncate it to c(4, 8). All three states must occur in order.',
      ),
    ],
    manual:
      'The initial, extended, and truncated values of x are checked. Self-review your explanation that extension adds NA values and truncation removes the extra positions.',
  },
  'ps3-matrix': {
    title: 'PS 3 · Matrices and indexing',
    kind: 'code',
    starter: '# Create, name, extract, and summarise.',
    explanation:
      'The selected value is 7. Row totals are 10, 26, 42; column totals are 15, 18, 21, 24.',
    source: 'PS 3 · Part C',
    prompt:
      'Create m = matrix(1:12, nrow = 3, byrow = TRUE). Name rows R1–R3 and columns C1–C4. Extract [2,3], compute row sums, then column sums. Display those answers in order or return them as list entries r2c3, row_sums, col_sums (as in the instructor solution). Saving selected, row_totals, column_totals also works.',
    checks: [
      value('m', 'matrix(1:12,nrow=3,byrow=TRUE)'),
      check(
        'exists("m",inherits=FALSE) && identical(rownames(m),c("R1","R2","R3")) && identical(colnames(m),c("C1","C2","C3","C4"))',
        'Assign rows R1–R3 and columns C1–C4 in order.',
      ),
      ...answers([
        field('Row 2, column 3', '7', ['selected', 'r2c3'], ['r2c3', 'selected']),
        field('Row sums', 'c(10,26,42)', ['row_totals', 'row_sums'], ['row_sums', 'row_totals']),
        field(
          'Column sums',
          'c(15,18,21,24)',
          ['column_totals', 'col_sums'],
          ['col_sums', 'column_totals'],
        ),
      ]),
    ],
  },
  'lab3-population': {
    checks: [
      value(
        'cityA',
        '11412.659743',
        'Calculate both flows from the old populations before updating either city.',
      ),
      value('cityB', '18587.340257'),
      check(
        'exists("cityA",inherits=FALSE) && exists("cityB",inherits=FALSE) && abs(cityA + cityB - 30000) < 1e-6',
        'Total population must remain 30000.',
      ),
    ],
    title: 'Lab 3 · Two cities',
    kind: 'code',
    starter: 'cityA <- 10000\ncityB <- 20000\n# Update the two cities for five years.',
    explanation:
      'Calculate both migration flows before changing either city. After five years, A ≈ 11412.659743 and B ≈ 18587.340257. Their sum remains 30000. Do not round intermediate populations.',
    source: 'Lab 3 · Exercise 1',
    prompt:
      'Each year 1% of the population of city A moves to city B, and 2% of the population of city B moves to city A. The current populations are 10000 and 20000. Calculate both populations after five years and store them in cityA and cityB. Keep full precision in the saved values.',
    hints: [
      'Both next populations must use the same year’s starting cityA and cityB.',
      'Calculate cityA_next and cityB_next before assigning either city. Repeat five times; an equivalent loop is also accepted.',
    ],
    manual:
      'The final cityA, cityB and conserved total population are checked. Review that both annual flows use the starting populations for that year. The displayed 11412.66 and 18587.34 are rounded; keep full precision in the objects.',
  },
  'lab3-boxes': {
    title: 'Lab 3 · Packaging and leftovers',
    kind: 'code',
    starter: 'total <- 983\nper_box <- 24',
    explanation:
      'There are 40 full boxes and 23 leftover drives. If shipping every drive, you would need an additional partially filled box; the question asks for full boxes.',
    source: 'Lab 3 · Exercise 2',
    prompt:
      'Pack 983 USB drives in boxes holding 24. Compute the number of full boxes, then the leftover drives. Display or return the two answers in that order, or save full_boxes and leftover. The question asks for full boxes, not the total boxes needed to ship every drive.',
    checks: answers([
      namedAnswer('Full boxes', '40', 'full_boxes'),
      namedAnswer('Leftover drives', '23', 'leftover'),
    ]),
  },
  'lab3-grade': {
    title: 'Lab 3 · Weighted course grade',
    kind: 'code',
    starter: 'midterm <- 78\nfinal <- 91\nrubric <- c(86, 92, 88, 90)',
    source: 'Lab 3 · Exercise 3',
    explanation:
      'For the given rubric items, the project mean is 89 and the weighted overall grade is 86.05. These weights belong to the exercise, not the actual MIS 130 grading scheme.',
    prompt:
      'Weights are Midterm 35%, Final 45%, Project 20%. Scores are 78 and 91; project rubric items are 86, 92, 88, 90. The project score is the mean of these items. Calculate the overall course grade. Display the result, or save it as overall. Saving the project mean separately is optional.',
    checks: [...answers([namedAnswer('Overall grade', '86.05', 'overall')])],
  },
  'lab3-sales': {
    title: 'Lab 3 · Monthly sales roll-up',
    kind: 'code',
    explanation:
      'Products total 355 and 325, grand total 680. Months total 205, 205, 270, so month 3 is highest.',
    source: 'Lab 3 · Exercise 4',
    prompt:
      'Use sales with rows A, B and columns M1–M3. Compute total units per product, the grand total, and the best month (position 1–3). Display those three answers in order or return a list with total_units_per_product, grand_total, best_month. You can save the results with those names instead. Intermediate helper objects are optional.',
    starter:
      'sales <- matrix(c(120,95,140,85,110,130), nrow=2, byrow=TRUE)\nrownames(sales) <- c("A","B")\ncolnames(sales) <- paste0("M",1:3)\n# Summarise the sales.',
    checks: [
      value('sales', 'matrix(c(120,95,140,85,110,130),nrow=2,byrow=TRUE)'),
      check(
        'exists("sales",inherits=FALSE) && identical(rownames(sales),c("A","B")) && identical(colnames(sales),c("M1","M2","M3"))',
        'Keep product rows A, B and month columns M1–M3 in order.',
      ),
      ...answers([
        namedAnswer('Total units per product (A, B)', 'c(355,325)', 'total_units_per_product'),
        namedAnswer('Grand total', '680', 'grand_total'),
        namedAnswer('Best month (position)', '3', 'best_month'),
      ]),
    ],
  },
  'lab3-departments': {
    title: 'Lab 3 · Department performance',
    kind: 'code',
    starter: '# Create the report.',
    explanation:
      'Department means are 86, 74.75, 92. Quarter means are approximately 84.6667, 89.3333, 79, 84. Sales has the highest mean. Factor levels are HR, IT, Sales.',
    source: 'Lab 3 · Exercise 5',
    prompt:
      'Store scores in a matrix: IT (88,92,79,85), HR (75,81,69,74), Sales (91,95,89,93), with department rows and Q1–Q4 columns. Compute department means, quarter means, the best department name, and a factor of department names. Display those four results in order, return a list with dept_avg, quarter_avg, best_dept, dept_factor, or save them with those names. Check the factor levels; their order may differ for this unordered factor.',
    checks: [
      value('scores', 'matrix(c(88,92,79,85,75,81,69,74,91,95,89,93),nrow=3,byrow=TRUE)'),
      check(
        'exists("scores",inherits=FALSE) && identical(rownames(scores),c("IT","HR","Sales")) && identical(colnames(scores),c("Q1","Q2","Q3","Q4"))',
        'Add department rows IT, HR, Sales and quarter columns Q1–Q4 in order.',
      ),
      ...answers([
        namedAnswer('Department means (IT, HR, Sales)', 'c(86,74.75,92)', 'dept_avg'),
        namedAnswer('Quarter means (Q1–Q4)', 'c(254/3,268/3,79,84)', 'quarter_avg'),
        namedAnswer('Best department name', '"Sales"', 'best_dept'),
        {
          ...namedAnswer('Department factor', 'factor(c("IT","HR","Sales"))', 'dept_factor'),
          predicate:
            'is.factor(.answer) && identical(as.character(.answer),c("IT","HR","Sales")) && setequal(levels(.answer),c("HR","IT","Sales"))',
        },
      ]),
    ],
  },
};

// PS 5 and Lab 5 consolidate Lectures 3–4, rather than Lecture 5.
Object.assign(definitions, {
  'ps5-construction': {
    title: 'PS 5 · Trace vector construction',
    kind: 'code',
    source: 'PS 5 · Q1',
    prompt:
      'Before running, predict the exact contents and lengths of route_id, zone_times and zone_each. Explain which zone vector gives four northern stops followed by four southern stops, and how each differs from times. Diagnose seq(from=12, to=3, by=3), then create the corrected sequence as descending. Create stop_order as odd positions 1–7 followed by even positions 2–8 using two sequences and c(), without typing all eight numbers. Display the three lengths; write explanations as comments.',
    starter:
      'route_id <- seq(from=210, to=245, by=5)\nzone_times <- rep(c("N","S"), times=4)\nzone_each <- rep(c("N","S"), each=4)\n# Predict, inspect, and complete the two new vectors.',
    checks: [
      value('route_id', 'seq(210,245,5)'),
      value('zone_times', 'rep(c("N","S"),4)'),
      value('zone_each', 'rep(c("N","S"),each=4)'),
      value('descending', 'c(12,9,6,3)'),
      value('stop_order', 'c(1,3,5,7,2,4,6,8)'),
      displayed('8', 'Display the length of each of the three vectors.'),
    ],
    explanation:
      'All three vectors have length 8. zone_each gives N,N,N,N,S,S,S,S; zone_times alternates N,S four times. A descending sequence needs a negative step. stop_order is 1,3,5,7,2,4,6,8.',
    manual: selfReview,
    hints: [
      'Track whether a repetition applies to each element or to the complete pattern.',
      'Compare the direction from the start to the endpoint with the sign of by.',
    ],
  },
  'ps5-indexing': {
    title: 'PS 5 · Trace, filter, diagnose',
    kind: 'code',
    source: 'PS 5 · Q2',
    prompt:
      'Predict delay[c(1,4,8)], delay[delay >= 7], delay[-c(2,6)] and delay[c(8,3,3,1)]. Then compute them. Remove only the first maximum without typing its position; filter values at least 4 and below 10; keep every position except the second. Display all seven answers in that order, return a seven-entry list, or save them as selected, large, excluded, repeated, without_first_max, middle_values, keep_without_second. Explain what remains after removing the first maximum, why delay[c(-2,4)] is invalid, and give a valid positive or negative index expression.',
    starter: 'delay <- c(8,3,12,5,12,1,7,4)\n# Predict first, then calculate the seven answers.',
    checks: answers([
      namedAnswer('Selected positions', 'c(8,5,4)', 'selected'),
      namedAnswer('Values at least 7', 'c(8,12,12,7)', 'large'),
      namedAnswer('Excluded positions', 'c(8,12,5,12,7,4)', 'excluded'),
      namedAnswer('Repeated positions', 'c(4,12,12,8)', 'repeated'),
      namedAnswer('Without the first maximum', 'c(8,3,5,12,1,7,4)', 'without_first_max'),
      namedAnswer('Middle values', 'c(8,5,7,4)', 'middle_values'),
      namedAnswer('Without position 2', 'c(8,12,5,12,1,7,4)', 'keep_without_second'),
    ]),
    explanation:
      'Index order controls output order, including repeated positions. which.max(delay) is 3: removing that position retains the other 12 at original position 5. Positive indexes select and negative indexes exclude; they cannot be mixed, except for zero. delay[-2] and delay[c(1,3:8)] keep the requested positions.',
    manual: selfReview,
    hints: [
      'Write down positions separately from values. Repeated positions can repeat a value.',
      'which.max() identifies the first maximum; use that position in an exclusion.',
    ],
  },
  'ps5-filling': {
    title: 'PS 5 · Reason about matrix filling',
    kind: 'code',
    source: 'PS 5 · Q3',
    prompt:
      'Predict both matrices in full, identify which has 11:14 as its first row, and explain why. Inspect dim(by_column), nrow(by_row) and ncol(by_row). Locate 18 in each matrix and construct by_row directly with rbind(). Display these eight results in order: the two matrices, dimensions, row count, column count, the two row/column positions, and the rbind matrix. Return positions as one-row matrices, or save two-number position vectors as column_position and row_position. Other saved answer names: by_column, by_row, dimensions, rows, columns, by_row_with_rbind.',
    starter:
      'values <- 11:22\nby_column <- matrix(values,nrow=3,ncol=4)\nby_row <- matrix(values,nrow=3,ncol=4,byrow=TRUE)\n# Predict before displaying the results.',
    checks: answers([
      namedAnswer('Column-filled matrix', 'matrix(11:22,3)', 'by_column'),
      namedAnswer('Row-filled matrix', 'matrix(11:22,3,byrow=TRUE)', 'by_row'),
      namedAnswer('Dimensions', 'c(3,4)', 'dimensions'),
      namedAnswer('Row count', '3', 'rows'),
      namedAnswer('Column count', '4', 'columns'),
      {
        ...namedAnswer('18 in column-filled matrix', 'matrix(c(2,3),1)', 'column_position'),
        predicate:
          'is.numeric(.answer) && length(.answer)==2 && isTRUE(all.equal(as.vector(.answer),c(2,3),check.attributes=FALSE))',
      },
      {
        ...namedAnswer('18 in row-filled matrix', 'matrix(c(2,4),1)', 'row_position'),
        predicate:
          'is.numeric(.answer) && length(.answer)==2 && isTRUE(all.equal(as.vector(.answer),c(2,4),check.attributes=FALSE))',
      },
      namedAnswer('Row binding', 'matrix(11:22,3,byrow=TRUE)', 'by_row_with_rbind'),
    ]),
    explanation:
      'R fills columns first unless byrow=TRUE. Both matrices are 3×4. The value 18 is at [2,3] in by_column and [2,4] in by_row. rbind(11:14,15:18,19:22) recreates by_row.',
    manual: selfReview,
    hints: [
      'Follow one complete column before moving to the next in the default matrix.',
      'which(matrix_name == 18, arr.ind=TRUE) reports row and column coordinates.',
    ],
  },
  'ps5-subsets': {
    title: 'PS 5 · Predict matrix subsets',
    kind: 'code',
    source: 'PS 5 · Q4',
    prompt:
      'Predict traffic[2,3], traffic[,2], traffic[1:2,c(1,4)] and traffic[c(3,1),c(4,2)], including whether each is a scalar, vector or matrix. Predict traffic[traffic >= 30] and explain its order. Diagnose traffic[4,2] when the intended cell is row 2, column 4. Select rows 1 and 3 while excluding column 2. Display all seven answers in order, return a seven-entry list, or save cell, second_column, block, reordered, at_least_30, correct_cell, selected_matrix. Explain your predictions in comments.',
    starter: trafficInput + '\n# Predict and compute the seven results.',
    checks: answers([
      namedAnswer('Cell', '20', 'cell'),
      namedAnswer('Second column', 'c(24,33,22)', 'second_column'),
      namedAnswer('Selected block', 'matrix(c(18,21,27,26),2,byrow=TRUE)', 'block'),
      namedAnswer('Reordered block', 'matrix(c(38,22,21,24),2,byrow=TRUE)', 'reordered'),
      namedAnswer('Values at least 30', 'c(35,33,30,38)', 'at_least_30'),
      namedAnswer('Correct cell', '26', 'correct_cell'),
      namedAnswer(
        'Selected matrix',
        'matrix(c(18,30,21,35,29,38),2,byrow=TRUE)',
        'selected_matrix',
      ),
    ]),
    explanation:
      'The first result is 20; the second is a vector 24,33,22; the next two are 2×2 matrices. Logical indexing returns 35,33,30,38 in column-major order. traffic[4,2] asks for a nonexistent row; traffic[2,4] gives 26. The final selection is a 2×3 matrix.',
    manual: selfReview,
    hints: [
      'The first index selects rows, and the second selects columns.',
      'For a single logical matrix index, visit cells down each column in turn.',
    ],
  },
  'ps5-repair': {
    title: 'PS 5 · Repair a passenger table',
    kind: 'code',
    source: 'PS 5 · Q5',
    prompt:
      'Explain what counts[2,] <- 41 would change, then work on a copy counts_clean and correct only the erroneous 410 to 41. Replace P4 with c(56,51,50). Add route D=c(40,46,52,54) as a row in counts_extended. Remove P2 by negative indexing into counts_reduced. Preserve route and period names. Before running, write the full expected reduced matrix and dimensions in comments. Display counts_reduced[counts_reduced >= 50] and explain its order. Keep the original counts unchanged.',
    starter: countsInput + '\n# Work on copies and preserve the original input.',
    checks: [
      value('counts', 'matrix(c(42,51,48,55,39,410,44,50,36,45,47,49),3,byrow=TRUE)'),
      value('counts_clean', 'matrix(c(42,51,48,56,39,41,44,51,36,45,47,50),3,byrow=TRUE)'),
      value(
        'counts_extended',
        'matrix(c(42,51,48,56,39,41,44,51,36,45,47,50,40,46,52,54),4,byrow=TRUE)',
      ),
      value('counts_reduced', 'matrix(c(42,48,56,39,44,51,36,47,50,40,52,54),4,byrow=TRUE)'),
      check(
        'exists("counts_reduced",inherits=FALSE) && identical(rownames(counts_reduced),c("A","B","C","D")) && identical(colnames(counts_reduced),c("P1","P3","P4"))',
        'Keep route names A–D and columns P1, P3, P4 in order.',
      ),
      displayed('c(52,56,51,50,54)', 'Display the reduced matrix values that are at least 50.'),
    ],
    explanation:
      'counts[2,] <- 41 overwrites all four cells in row 2. Correcting [2,2], updating P4, adding D and excluding P2 gives a 4×3 matrix. Logical selection gives 52,56,51,50,54 because the remaining columns are visited in order.',
    manual: selfReview,
    hints: [
      'A blank second index means every column. A single-cell repair needs both indexes.',
      'Copy first, update the copy, bind the new row, then exclude the discontinued column.',
    ],
  },
  'ps5-challenge': {
    title: 'PS 5 · Optional matrix challenge',
    kind: 'code',
    source: 'PS 5 · Optional challenge',
    prompt:
      'Starting from the original counts each time: display P4 then P1; make counts_with_na with entries greater than 100 replaced by NA; make counts_corrected with only the erroneous 410 changed to 41, and display how many entries are at least 50. Explain your expressions in comments. This challenge does not use the extended matrix from Q5.',
    starter: countsInput + '\n# Each operation starts from this original table.',
    checks: [
      displayed('matrix(c(55,42,50,39,49,36),3,byrow=TRUE)', 'Display columns P4 then P1.'),
      value('counts_with_na', 'matrix(c(42,51,48,55,39,NA,44,50,36,45,47,49),3,byrow=TRUE)'),
      value('counts_corrected', 'matrix(c(42,51,48,55,39,41,44,50,36,45,47,49),3,byrow=TRUE)'),
      displayed('3', 'Display the number of corrected entries at least 50.'),
    ],
    explanation:
      'Column order follows c(4,1). A logical matrix selects the one value above 100. In the original matrix with 410 corrected to 41, only 51,55,50 meet the threshold: the count is 3.',
    manual: selfReview,
  },
  'lab5-combine': {
    title: 'Lab 5 · Combine branch vectors',
    kind: 'code',
    source: 'Lab 5 · Exercise 1',
    prompt:
      'Branch A sold 42,35,51,28; B sold 45,31,58,33; C sold 40,39,55,30. Create numeric vectors branch_a, branch_b, branch_c, then concatenate them in that order into all_sales. Display its length and class, or save them as observation_count and sales_class. Confirm the number of observations in a comment.',
    starter: '# Create the three vectors and combine them.',
    checks: [
      value('branch_a', 'c(42,35,51,28)'),
      value('branch_b', 'c(45,31,58,33)'),
      value('branch_c', 'c(40,39,55,30)'),
      value('all_sales', 'c(42,35,51,28,45,31,58,33,40,39,55,30)'),
      ...answers([
        namedAnswer('Combined vector', 'c(42,35,51,28,45,31,58,33,40,39,55,30)', 'all_sales'),
        namedAnswer('Observation count', '12', 'observation_count'),
        {
          ...namedAnswer('Vector class', '"numeric"', 'sales_class'),
          predicate:
            'exists("all_sales",envir=.lesson,inherits=FALSE) && is.character(.answer) && identical(.answer,class(.lesson$all_sales))',
        },
      ]),
    ],
    explanation:
      'Concatenation preserves branch order and gives 12 observations. The instructor uses numeric literals, so class(all_sales) is "numeric". Integer inputs may report "integer"; the reported class must match the vector.',
    manual: selfReview,
  },
  'lab5-identifiers': {
    title: 'Lab 5 · Generate identifiers',
    kind: 'code',
    source: 'Lab 5 · Exercise 2',
    prompt:
      'The supplied branch vectors and all_sales are recreated for this task. Create product_ids for 101–104 with seq(); branch_labels with four A values then four B and four C using rep(each=...); product_pattern repeating product_ids three times using rep(times=...). Display the three lengths together in the order branch_labels, product_pattern, all_sales. Explain how the labels align with the sales.',
    starter:
      branches +
      '\nall_sales <- c(branch_a,branch_b,branch_c)\n# Generate identifiers and inspect lengths.',
    checks: [
      value('product_ids', '101:104'),
      value('branch_labels', 'rep(c("A","B","C"),each=4)'),
      value('product_pattern', 'rep(101:104,3)'),
      displayed('c(12,12,12)', 'Display the three lengths together in the requested order.'),
    ],
    explanation:
      'Each branch contributes four consecutive sales, so each=4 repeats branch labels. times=3 repeats the complete four-product pattern. All three lengths are 12.',
    manual: selfReview,
  },
  'lab5-correct': {
    title: 'Lab 5 · Correct, sort and filter',
    kind: 'code',
    source: 'Lab 5 · Exercise 3',
    prompt:
      'Copy recorded_b to branch_b_corrected and correct its second element from 310 to 31. Create branch_b_desc in descending order; best_product_position with which.max(); target_sales containing values at least 40 using logical indexing; and first_three by excluding position 4 with negative indexing. Keep recorded_b unchanged. Display the five results.',
    starter: 'recorded_b <- c(45,310,58,33)\n# Correct a copy, then derive the requested results.',
    checks: [
      value('recorded_b', 'c(45,310,58,33)'),
      value('branch_b_corrected', 'c(45,31,58,33)'),
      value('branch_b_desc', 'c(58,45,33,31)'),
      value('best_product_position', '3'),
      value('target_sales', 'c(45,58)'),
      value('first_three', 'c(45,31,58)'),
    ],
    explanation:
      'The corrected vector is 45,31,58,33. Sorting gives 58,45,33,31, while the largest value is at original position 3. The threshold keeps 45,58; excluding position 4 leaves 45,31,58.',
    manual: selfReview,
  },
  'lab5-build': {
    title: 'Lab 5 · Build the sales matrix',
    kind: 'code',
    source: 'Lab 5 · Exercise 4',
    prompt:
      'The three branch vectors are supplied independently of earlier exercises. Stack them as rows using rbind() into sales. Create the same values as sales_from_matrix using matrix(), nrow=3 and byrow=TRUE. Print both matrices, then inspect dim(sales), nrow(sales), ncol(sales). Explain which dimension represents branches. Row names may differ between the two construction methods.',
    starter: branches + '\n# Construct both matrices and inspect their dimensions.',
    checks: [
      value('sales', salesExpected),
      value('sales_from_matrix', salesExpected),
      displayed('c(3,4)', 'Display dim(sales).'),
      displayed('3', 'Display nrow(sales).'),
      displayed('4', 'Display ncol(sales).'),
    ],
    explanation:
      'Both constructions give 3 branches × 4 products. rbind() stacks each branch vector as a row. matrix() needs byrow=TRUE to preserve that arrangement from the concatenated vector.',
    manual: selfReview,
  },
  'lab5-extract': {
    title: 'Lab 5 · Extract rows and blocks',
    kind: 'code',
    source: 'Lab 5 · Exercise 5',
    prompt:
      'From the supplied sales matrix, save branch_b_sales as row 2, product_3_sales as column 3, selected_block as rows 1–2 and columns 2–4, and corner_sales as rows 1 and 3 with columns 1 and 4. Print each result and explain its shape. The input is supplied afresh for this question.',
    starter: salesInput + '\n# Extract the four requested objects.',
    checks: [
      value('branch_b_sales', 'c(45,31,58,33)'),
      value('product_3_sales', 'c(51,58,55)'),
      value('selected_block', 'matrix(c(35,51,28,31,58,33),2,byrow=TRUE)'),
      value('corner_sales', 'matrix(c(42,28,40,30),2,byrow=TRUE)'),
    ],
    explanation:
      'One row or column is simplified to a vector by default. The selected block is 2×3; the corners form a 2×2 matrix in the requested row/column order.',
    manual: selfReview,
  },
  'lab5-logical': {
    title: 'Lab 5 · Use a logical matrix',
    kind: 'code',
    source: 'Lab 5 · Exercise 6',
    prompt:
      'Create target_matrix marking sales >= 50. Extract matching values into high_sales. Use sum(target_matrix) to count matches, and display the count or save it as target_count. Explain the structure of the mask and the extraction order.',
    starter: salesInput + '\n# Build the mask, extract values and count matches.',
    checks: [
      value('target_matrix', `(${salesExpected}) >= 50`),
      value('high_sales', 'c(51,58,55)'),
      ...answers([namedAnswer('Target count', '3', 'target_count')]),
    ],
    explanation:
      'The 3×4 logical mask has TRUE in product column 3 for all branches. Extraction gives 51,58,55. Summing TRUE values gives 3; logical extraction follows column-major order.',
    manual: selfReview,
  },
  'lab5-update': {
    title: 'Lab 5 · Update and restructure',
    kind: 'code',
    source: 'Lab 5 · Exercise 7',
    prompt:
      'Copy the supplied sales to sales_updated. Change Branch B/Product 2 from 31 to 37. Replace product column 4 with c(30,34,32). Add Branch D=c(44,36,52,29) into sales_extended. Remove product column 2 into sales_reduced. Keep sales unchanged and print the three new matrices. Explain the difference between changing one cell and replacing a column.',
    starter: salesInput + '\n# Copy, update, extend and reduce.',
    checks: [
      value('sales', salesExpected),
      value('sales_updated', 'matrix(c(42,35,51,30,45,37,58,34,40,39,55,32),3,byrow=TRUE)'),
      value(
        'sales_extended',
        'matrix(c(42,35,51,30,45,37,58,34,40,39,55,32,44,36,52,29),4,byrow=TRUE)',
      ),
      value('sales_reduced', 'matrix(c(42,51,30,45,58,34,40,55,32,44,52,29),4,byrow=TRUE)'),
    ],
    explanation:
      'The updated matrix is 3×4, adding Branch D gives 4×4, and excluding Product 2 gives 4×3. The original sales stays unchanged because modifications are made on a copy.',
    manual: selfReview,
  },
  'lab5-balloons': {
    title: 'Lab 5 · Optional balloon spacing',
    kind: 'code',
    source: 'Lab 5 · Exercise 8',
    prompt:
      'Two endpoint balloons span a string. Insert either two white balloons or four yellow balloons, with equal neighboring gaps in each arrangement. White spacing is 18 cm longer. Create named inserted (white, yellow) and gap_counts; calculate span in one expression from span/white_gaps - span/yellow_gaps = 18. Create spacing, then white_positions and yellow_positions with seq(), including 0 and span. Display the spacing difference. Explain how you counted gaps. This is the source lab’s optional TYT extension.',
    starter: '# Model the two arrangements with named vectors.',
    checks: [
      value('inserted', 'c(2,4)'),
      check(
        'exists("inserted",inherits=FALSE) && identical(names(inserted),c("white","yellow"))',
        'Name the two inserted counts white and yellow in that order.',
      ),
      value('gap_counts', 'c(3,5)'),
      // Division in the instructor formula introduces floating-point error
      // even though these mathematical results are whole numbers.
      value('span', '135', undefined, 1e-8),
      value('spacing', 'c(45,27)', undefined, 1e-8),
      value('white_positions', 'c(0,45,90,135)', undefined, 1e-8),
      value('yellow_positions', 'c(0,27,54,81,108,135)', undefined, 1e-8),
      displayed('18', 'Display the difference between the two spacings.'),
    ],
    explanation:
      'Two inserted balloons make 3 gaps; four make 5. Solving span/3 - span/5 = 18 gives 135 cm, with spacings 45 and 27 cm. Each position sequence includes both endpoints.',
    manual: selfReview,
    hints: [
      'Draw the endpoints and count the spaces, including the two outer gaps.',
      'Factor span out of the difference of the two reciprocal gap counts.',
    ],
  },
});

const defaultHints = [
  'Work through each requested result in question order.',
  'Open the instructor solution to compare values and structure. Equivalent calculations and helper objects are allowed.',
];
const defaultSolutionNote =
  'Based on the provided instructor answers. Equivalent calculations are accepted; these checks do not grade your written reasoning.';

function practiceTask(id) {
  const definition = definitions[id];
  if (!definition) throw new Error('Missing practice definition for ' + id);
  const task = {
    id,
    ...definition,
    solutionLabel: 'Instructor solution',
    solutionNote: definition.solutionNote || defaultSolutionNote,
    hints: definition.hints || defaultHints,
  };
  if (task.kind === 'written') return { ...task, explanation: task.answer };
  const solution = instructorSolutions[id];
  if (!solution) throw new Error('Missing instructor solution for ' + id);
  return { ...task, solution, captureAnswers: true, successTitle: 'Code checks passed.' };
}

export const introductionPractice = [
  'ps2-panes',
  'ps2-tickets',
  'ps2-types',
  'ps2-remove',
  'ps2-help',
  'ps2-script',
  'lab2-three',
  'lab2-operators',
  'lab2-compound',
  'lab2-seconds',
  'lab2-future',
  'lab2-pi',
].map(practiceTask);
export const foundationsPractice = [
  'ps3-debug',
  'ps3-operators',
  'ps3-length',
  'ps3-matrix',
  'lab3-population',
  'lab3-boxes',
  'lab3-grade',
  'lab3-sales',
  'lab3-departments',
].map(practiceTask);

export const vectorsMatricesPractice = [
  'ps5-construction',
  'ps5-indexing',
  'ps5-filling',
  'ps5-subsets',
  'ps5-repair',
  'ps5-challenge',
  'lab5-combine',
  'lab5-identifiers',
  'lab5-correct',
  'lab5-build',
  'lab5-extract',
  'lab5-logical',
  'lab5-update',
  'lab5-balloons',
].map(practiceTask);
