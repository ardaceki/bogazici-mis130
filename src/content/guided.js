import { check, value } from './helpers.js';
const step = (prompt, starter, solution, checks, explanation) => ({
  prompt,
  starter,
  solution,
  checks,
  explanation,
  concept: null,
  details: null,
  manual: null,
});
export const guided = {
  assignment: [
    step(
      'A name can hold a number. Run this line to store 40 as ticket_price.',
      'ticket_price <- 40',
      'ticket_price <- 40',
      [value('ticket_price', '40')],
      'ticket_price now holds 40.',
    ),
    step(
      'Add a new line: ticket_count <- 3.',
      'ticket_price <- 40\n',
      'ticket_price <- 40\nticket_count <- 3',
      [value('ticket_count', '3')],
      'You now have two named values: price 40 and count 3.',
    ),
    step(
      'Multiply the two values. Add: total_cost <- ticket_price * ticket_count.',
      'ticket_price <- 40\nticket_count <- 3\n',
      'ticket_price <- 40\nticket_count <- 3\ntotal_cost <- ticket_price * ticket_count',
      [value('total_cost', '120')],
      'total_cost holds 120. <- means “store this value”.',
    ),
  ],
  'number-text': [
    step(
      'Run seat_count <- 24. No quotation marks: this is a number.',
      'seat_count <- 24',
      'seat_count <- 24',
      [value('seat_count', '24')],
      'R stores 24 as a number.',
    ),
    step(
      'Add room_label <- "24". Quotation marks make it text.',
      'seat_count <- 24\n',
      'seat_count <- 24\nroom_label <- "24"',
      [value('room_label', '"24"')],
      'The text "24" looks like a number, but it is a label.',
    ),
    step(
      'class() tells you the type. Add: seat_type <- class(seat_count).',
      'seat_count <- 24\nroom_label <- "24"\n',
      'seat_count <- 24\nroom_label <- "24"\nseat_type <- class(seat_count)',
      [value('seat_type', '"numeric"')],
      'The class is numeric.',
    ),
    step(
      'Now check the text. Add: room_type <- class(room_label).',
      'seat_count <- 24\nroom_label <- "24"\nseat_type <- class(seat_count)\n',
      'seat_count <- 24\nroom_label <- "24"\nseat_type <- class(seat_count)\nroom_type <- class(room_label)',
      [value('room_type', '"character"')],
      'Text has class character.',
    ),
  ],
  workspace: [
    step(
      'Run these two lines to create a note and a score.',
      'note <- "practice"\nscore <- 8',
      'note <- "practice"\nscore <- 8',
      [value('note', '"practice"'), value('score', '8')],
      'Both names are in the R session.',
    ),
    step(
      'ls() lists your objects. Add ls() and run.',
      'note <- "practice"\nscore <- 8\n',
      'note <- "practice"\nscore <- 8\nls()',
      [
        check(
          'all(c("note","score") %in% .workshop_result)',
          'Add ls() as your last line so both note and score appear.',
        ),
      ],
      'The list shows note and score.',
    ),
    step(
      'Delete only the note. Add rm(note).',
      'note <- "practice"\nscore <- 8\n',
      'note <- "practice"\nscore <- 8\nrm(note)',
      [check('!exists("note",inherits=FALSE)', 'Add rm(note).'), value('score', '8')],
      'note is removed. score remains.',
    ),
  ],
  'working-directory': [
    step(
      'getwd() tells you the current folder. Run this line.',
      'working_directory <- getwd()',
      'working_directory <- getwd()',
      [
        check(
          'exists("working_directory",inherits=FALSE) && identical(working_directory,getwd())',
          'Run the supplied line.',
        ),
      ],
      'This is the folder R uses for relative file paths.',
    ),
    step(
      'list.files() lists files in that folder. Add files <- list.files().',
      'working_directory <- getwd()\n',
      'working_directory <- getwd()\nfiles <- list.files()',
      [
        check(
          'exists("files",inherits=FALSE) && identical(files,list.files())',
          'Add files <- list.files().',
        ),
      ],
      'This site uses a virtual folder inside your browser.',
    ),
  ],
  division: [
    step(
      '17 items. A box holds 5. %/% counts full boxes. Add boxes <- items %/% capacity.',
      'items <- 17\ncapacity <- 5\n',
      'items <- 17\ncapacity <- 5\nboxes <- items %/% capacity',
      [value('boxes', '3')],
      'Three boxes are full: 3 × 5 = 15.',
    ),
    step(
      '%% finds what is left. Add leftover <- items %% capacity.',
      'items <- 17\ncapacity <- 5\nboxes <- items %/% capacity\n',
      'items <- 17\ncapacity <- 5\nboxes <- items %/% capacity\nleftover <- items %% capacity',
      [value('leftover', '2')],
      'Two items remain: 17 − 15 = 2.',
    ),
  ],
  comparisons: [
    step(
      '> asks “is it bigger?” Add enough <- stock > order.',
      'stock <- 17\norder <- 5\n',
      'stock <- 17\norder <- 5\nenough <- stock > order',
      [value('enough', 'TRUE')],
      '17 is bigger than 5, so the answer is TRUE.',
    ),
    step(
      '== asks “are they equal?” Add exact <- stock == order.',
      'stock <- 17\norder <- 5\nenough <- stock > order\n',
      'stock <- 17\norder <- 5\nenough <- stock > order\nexact <- stock == order',
      [value('exact', 'FALSE')],
      '17 and 5 are not equal: FALSE. Use two equals signs for a comparison.',
    ),
  ],
  vectors: [
    step(
      'c() puts values together. Run the line to create sales.',
      'sales <- c(120, 95, 140)',
      'sales <- c(120, 95, 140)',
      [value('sales', 'c(120,95,140)')],
      'sales contains three values in order. Open Objects to see them.',
    ),
    step(
      'length() counts the values. Add months <- length(sales).',
      'sales <- c(120, 95, 140)\n',
      'sales <- c(120, 95, 140)\nmonths <- length(sales)',
      [value('months', '3')],
      'There are three months.',
    ),
    step(
      'sum() adds the values. Add total <- sum(sales).',
      'sales <- c(120, 95, 140)\nmonths <- length(sales)\n',
      'sales <- c(120, 95, 140)\nmonths <- length(sales)\ntotal <- sum(sales)',
      [value('total', '355')],
      '120 + 95 + 140 = 355.',
    ),
  ],
  index: [
    step(
      'R counts positions from 1. Add second <- sales[2] to get the second value.',
      'sales <- c(120, 95, 140)\n',
      'sales <- c(120, 95, 140)\nsecond <- sales[2]',
      [value('second', '95')],
      'Position 2 contains 95.',
    ),
    step(
      'Choose two positions with c(). Add selected <- sales[c(1, 3)].',
      'sales <- c(120, 95, 140)\nsecond <- sales[2]\n',
      'sales <- c(120, 95, 140)\nsecond <- sales[2]\nselected <- sales[c(1, 3)]',
      [value('selected', 'c(120,140)')],
      'You selected the first and third values: 120 and 140.',
    ),
  ],
  'matrix-names': [
    step(
      'A and B are product names. Add rownames(sales) <- c("A", "B").',
      'sales <- matrix(c(120,95,140,85,110,130), nrow=2, byrow=TRUE)\n',
      'sales <- matrix(c(120,95,140,85,110,130), nrow=2, byrow=TRUE)\nrownames(sales) <- c("A", "B")',
      [check('identical(rownames(sales),c("A","B"))', 'Add the row names A and B.')],
      'Each row now has a product name.',
    ),
    step(
      'Name the months. Add colnames(sales) <- c("M1", "M2", "M3").',
      'sales <- matrix(c(120,95,140,85,110,130), nrow=2, byrow=TRUE)\nrownames(sales) <- c("A", "B")\n',
      'sales <- matrix(c(120,95,140,85,110,130), nrow=2, byrow=TRUE)\nrownames(sales) <- c("A", "B")\ncolnames(sales) <- c("M1", "M2", "M3")',
      [check('identical(colnames(sales),c("M1","M2","M3"))', 'Add the column names M1, M2, M3.')],
      'Each column now has a month name.',
    ),
    step(
      'Use [row, column]. Add second_B <- sales[2, 2].',
      'sales <- matrix(c(120,95,140,85,110,130), nrow=2, byrow=TRUE)\nrownames(sales) <- c("A", "B")\ncolnames(sales) <- c("M1", "M2", "M3")\n',
      'sales <- matrix(c(120,95,140,85,110,130), nrow=2, byrow=TRUE)\nrownames(sales) <- c("A", "B")\ncolnames(sales) <- c("M1", "M2", "M3")\nsecond_B <- sales[2, 2]',
      [value('second_B', '110')],
      'Row 2, column 2 contains 110. Click that cell in Objects.',
    ),
  ],
};
