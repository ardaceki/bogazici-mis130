import { code, choice, written, value } from './helpers.js';
import { vectorsMatricesPractice } from './course-practice.js';

const aInput = 'A <- matrix(c(0.3,4.5,55.3,91,0.1,105.5,-4.2,8.2,27.9),nrow=3)';
const delayInput = 'delay <- c(8,3,12,5,12,1,7,4)';
const boardInput = 'board <- matrix(0,nrow=6,ncol=7)\nboard[6,4] <- 1';

export default {
  id: 'vectors-matrices',
  weeks: 'Weeks 3–5',
  number: '03',
  title: 'Vectors & matrices',
  subtitle: 'Generate, select, correct, and restructure data',
  source: 'Lectures 3–4 · PS 5 · Lab 5',
  sources: [
    'Week 3/Lecture-3.html',
    'Week 4/Lecture-4.html',
    'Week 5/PS/PS-05.html',
    'Week 5/Lab/Lab-05.html',
  ],
  learn: [
    code(
      'vector-combine',
      'Combine aligned observations',
      'A vector keeps values in order. Combine branch_a then branch_b into combined. Add the two branch vectors element by element into paired_totals. Save length(combined) in observations.',
      'branch_a <- c(42,35,51,28)\nbranch_b <- c(45,31,58,33)',
      'branch_a <- c(42,35,51,28)\nbranch_b <- c(45,31,58,33)\ncombined <- c(branch_a,branch_b)\npaired_totals <- branch_a + branch_b\nobservations <- length(combined)',
      'c() appends observations: combined has 8 values. Addition pairs corresponding positions and gives 87,66,109,61. Keep the same product order in both inputs.',
      [
        value('combined', 'c(42,35,51,28,45,31,58,33)'),
        value('paired_totals', 'c(87,66,109,61)'),
        value('observations', '8'),
      ],
      {
        hints: [
          'Concatenating vectors and adding them produce different lengths.',
          'combined <- c(branch_a,branch_b)\npaired_totals <- branch_a + branch_b',
        ],
      },
    ),
    code(
      'vector-seq-step',
      'Control the sequence step',
      'Use seq(from=...,to=...,by=...) to create route_id from 210 through 245 in steps of 5, then reverse_route from 245 through 210 in steps of 5.',
      '# Generate increasing and decreasing route identifiers.',
      'route_id <- seq(from=210,to=245,by=5)\nreverse_route <- seq(from=245,to=210,by=-5)',
      'by controls the step, including its direction. The increasing IDs are 210,215,220,225,230,235,240,245; a decreasing sequence needs by=-5.',
      [value('route_id', 'seq(210,245,5)'), value('reverse_route', 'seq(245,210,-5)')],
      {
        concept:
          'Unlike :, seq() lets you choose a step other than 1. If a step does not reach the endpoint exactly, the sequence stops before passing it.',
        hints: [
          'The sign of by must point from from toward to.',
          'reverse_route <- seq(245,210,by=-5)',
        ],
      },
    ),
    code(
      'vector-seq-length',
      'Choose the number of values',
      'Create checkpoints containing exactly seven evenly spaced values from 5 to 50 using length.out. Store the distance between the first two points in gap.',
      '# Specify the number of values rather than the step.',
      'checkpoints <- seq(from=5,to=50,length.out=7)\ngap <- checkpoints[2]-checkpoints[1]',
      'Seven values include both endpoints, so there are six gaps. The points are 5,12.5,20,27.5,35,42.5,50 and the gap is 7.5.',
      [value('checkpoints', 'seq(5,50,length.out=7)'), value('gap', '7.5')],
      {
        hints: [
          'Use length.out for how many points you want.',
          'gap <- checkpoints[2]-checkpoints[1]',
        ],
      },
    ),
    code(
      'vector-repeat',
      'Repeat elements or patterns',
      'Create grouped as four A labels followed by four B labels, using rep(each=...). Create alternating as the complete A,B pattern repeated four times using rep(times=...).',
      'labels <- c("A","B")',
      'labels <- c("A","B")\ngrouped <- rep(labels,each=4)\nalternating <- rep(labels,times=4)',
      'each repeats one element before moving on. times repeats the complete pattern. Both results have length 8, but different order.',
      [value('grouped', 'rep(c("A","B"),each=4)'), value('alternating', 'rep(c("A","B"),times=4)')],
      {
        hints: [
          'Picture blocks of labels for each, and repeated pairs for times.',
          'grouped <- rep(labels,each=4)',
        ],
      },
    ),
    code(
      'vector-sort',
      'Sort and handle missing values',
      'Sort candidate_times into ascending (default missing-value handling), descending, and missing_last (increasing order with NA retained at the end).',
      'candidate_times <- c(21,7,NA,15,13)',
      'candidate_times <- c(21,7,NA,15,13)\nascending <- sort(candidate_times)\ndescending <- sort(candidate_times,decreasing=TRUE)\nmissing_last <- sort(candidate_times,na.last=TRUE)',
      'sort() drops NA by default. decreasing=TRUE reverses value order. na.last=TRUE retains missing values at the end; it does not turn them into zero.',
      [
        value('ascending', 'c(7,13,15,21)'),
        value('descending', 'c(21,15,13,7)'),
        value('missing_last', 'c(7,13,15,21,NA)'),
      ],
      {
        hints: [
          'Use decreasing for direction and na.last for missing values.',
          'missing_last <- sort(candidate_times,na.last=TRUE)',
        ],
      },
    ),
    code(
      'vector-index-order',
      'Select, reorder and repeat',
      'Using delay, save positions 8,3,3,1 as repeated. Select all even positions dynamically into even_values. Store the last value in last_value using length().',
      delayInput,
      delayInput +
        '\nrepeated <- delay[c(8,3,3,1)]\neven_values <- delay[seq(2,length(delay),by=2)]\nlast_value <- delay[length(delay)]',
      'The index vector sets the result order and may repeat positions. repeated is 4,12,12,8; even positions give 3,5,1,4; the last value is 4.',
      [
        value('repeated', 'c(4,12,12,8)'),
        value('even_values', 'c(3,5,1,4)'),
        value('last_value', '4'),
      ],
      {
        hints: [
          'Indexes refer to positions, not the values stored there.',
          'Generate even positions with seq(2,length(delay),by=2).',
        ],
      },
    ),
    code(
      'vector-negative',
      'Exclude a computed position',
      'Create without_second by excluding position 2. Find the first maximum position in first_max, then exclude only that position into without_first_max. Keep delay unchanged.',
      delayInput,
      delayInput +
        '\nwithout_second <- delay[-2]\nfirst_max <- which.max(delay)\nwithout_first_max <- delay[-first_max]',
      'Negative indexes exclude positions. which.max() gives the first maximum, here position 3. Excluding it leaves the other 12; filtering out every maximum would answer a different question.',
      [
        value('without_second', 'c(8,12,5,12,1,7,4)'),
        value('first_max', '3'),
        value('without_first_max', 'c(8,3,5,12,1,7,4)'),
        value('delay', 'c(8,3,12,5,12,1,7,4)'),
      ],
      {
        hints: [
          'Use -position inside square brackets.',
          'without_first_max <- delay[-which.max(delay)]',
        ],
      },
    ),
    code(
      'vector-logical',
      'Filter with combined conditions',
      'Store a logical vector named in_range marking delay values at least 4 and below 10. Use that mask to create selected.',
      delayInput,
      delayInput + '\nin_range <- delay >= 4 & delay < 10\nselected <- delay[in_range]',
      '& combines conditions at each position. The mask is TRUE,FALSE,FALSE,TRUE,FALSE,FALSE,TRUE,TRUE and selected is 8,5,7,4 in original order.',
      [
        value('in_range', 'c(TRUE,FALSE,FALSE,TRUE,FALSE,FALSE,TRUE,TRUE)'),
        value('selected', 'c(8,5,7,4)'),
      ],
      {
        hints: [
          'Write both comparisons against the entire delay vector.',
          'in_range <- delay >= 4 & delay < 10',
        ],
      },
    ),
    code(
      'vector-overwrite',
      'Correct selected elements',
      'Copy recorded_b into corrected. Change only its second element to 31. Then copy corrected into flagged and change positions 1 and 3 to -99. Keep the original input unchanged.',
      'recorded_b <- c(45,310,58,33)',
      'recorded_b <- c(45,310,58,33)\ncorrected <- recorded_b\ncorrected[2] <- 31\nflagged <- corrected\nflagged[c(1,3)] <- -99',
      'Indexing on the left of <- changes the selected elements. A scalar can replace several selected positions. Explicit copies keep the earlier versions available.',
      [
        value('corrected', 'c(45,31,58,33)'),
        value('flagged', 'c(-99,31,-99,33)'),
        value('recorded_b', 'c(45,310,58,33)'),
      ],
      { hints: ['Copy the object before assigning to its indexes.', 'flagged[c(1,3)] <- -99'] },
    ),
    code(
      'vector-clocks',
      'Put vector tools together',
      'Hotel clocks A and B differ by 4 hours, B and C by 3 hours; either difference may be ahead or behind. A reads 14. Build ab_sign with each=2 and bc_sign with times=2 from c(-1,1). Calculate possible_time_c for all four cases, then find impossible_options among c(7,13,15,17,21) using %in% and !. No loop is needed.',
      'time_a <- 14\nanswer_options <- c(7,13,15,17,21)',
      'time_a <- 14\nanswer_options <- c(7,13,15,17,21)\nab_sign <- rep(c(-1,1),each=2)\nbc_sign <- rep(c(-1,1),times=2)\npossible_time_c <- time_a + 4*ab_sign + 3*bc_sign\nimpossible_options <- answer_options[!(answer_options %in% possible_time_c)]',
      'The aligned sign vectors cover four direction combinations. The possible readings are 7,13,15,21, leaving 17 (option D). %in% marks membership; ! reverses the mask. This is the lecture’s hotel-clock scenario.',
      [
        value('ab_sign', 'c(-1,-1,1,1)'),
        value('bc_sign', 'c(-1,1,-1,1)'),
        value('possible_time_c', 'c(7,13,15,21)'),
        value('impossible_options', '17'),
      ],
      {
        concept:
          'x %in% y returns one logical value per element of x, indicating whether it appears in y.',
        hints: [
          'Use one position in each sign vector for the same case.',
          'possible_time_c <- 14 + 4*ab_sign + 3*bc_sign\nimpossible_options <- answer_options[!(answer_options %in% possible_time_c)]',
        ],
      },
    ),
    code(
      'matrix-fill-direction',
      'Compare filling directions',
      'Build column_filled and row_filled from 11:22, both with 3 rows and 4 columns. Use default filling for the first and byrow=TRUE for the second. Save their second-row, third-column entries as column_cell and row_cell.',
      'values <- 11:22',
      'values <- 11:22\ncolumn_filled <- matrix(values,nrow=3,ncol=4)\nrow_filled <- matrix(values,nrow=3,ncol=4,byrow=TRUE)\ncolumn_cell <- column_filled[2,3]\nrow_cell <- row_filled[2,3]',
      'The same vector gives different arrangements. The default fills down columns, producing 18 at [2,3]; byrow=TRUE fills across rows, producing 17 there.',
      [
        value('column_filled', 'matrix(11:22,3)'),
        value('row_filled', 'matrix(11:22,3,byrow=TRUE)'),
        value('column_cell', '18'),
        value('row_cell', '17'),
      ],
      {
        hints: [
          'Keep the dimensions the same so you can compare only filling order.',
          'row_filled <- matrix(values,nrow=3,ncol=4,byrow=TRUE)',
        ],
      },
    ),
    code(
      'matrix-bind',
      'Build a matrix from vectors',
      'Construct as_rows by stacking 11:14,15:18,19:22 as rows with rbind(). Construct as_columns with the same arrangement by binding the four appropriate column vectors using cbind().',
      '# Build the same 3×4 arrangement in two ways.',
      'as_rows <- rbind(11:14,15:18,19:22)\nas_columns <- cbind(c(11,15,19),c(12,16,20),c(13,17,21),c(14,18,22))',
      'rbind joins row vectors; cbind joins column vectors. Both produce the row-filled arrangement of 11:22 with dimensions 3×4.',
      [
        value('as_rows', 'matrix(11:22,3,byrow=TRUE)'),
        value('as_columns', 'matrix(11:22,3,byrow=TRUE)'),
      ],
      {
        hints: [
          'Read each column of the target arrangement from top to bottom.',
          'The first cbind vector is c(11,15,19).',
        ],
      },
    ),
    code(
      'matrix-subset-order',
      'Select rows and columns in order',
      'From A, save row 1 as first_row, column 2 as second_column, and rows 3 then 1 with columns 2–3 as reordered. Save dim(reordered) in dimensions.',
      aInput,
      aInput +
        '\nfirst_row <- A[1,]\nsecond_column <- A[,2]\nreordered <- A[c(3,1),2:3]\ndimensions <- dim(reordered)',
      'A blank index keeps all entries in that dimension. One row or column becomes a vector by default. reordered has rows (105.5,27.9) and (91,-4.2), with dimensions 2×2.',
      [
        value('first_row', 'c(0.3,91,-4.2)'),
        value('second_column', 'c(91,0.1,105.5)'),
        value('reordered', 'matrix(c(105.5,27.9,91,-4.2),2,byrow=TRUE)'),
        value('dimensions', 'c(2,2)'),
      ],
      {
        hints: [
          'The row index vector sets the order of rows in the result.',
          'reordered <- A[c(3,1),2:3]',
        ],
      },
    ),
    code(
      'matrix-exclude-shape',
      'Exclude indexes and preserve shape',
      'Exclude row 1 and column 2 into reduced. Then exclude row 1 and columns 2–3 into a vector named single_column. Repeat the latter selection with drop=FALSE into kept_matrix.',
      aInput,
      aInput +
        '\nreduced <- A[-1,-2]\nsingle_column <- A[-1,-c(2,3)]\nkept_matrix <- A[-1,-c(2,3),drop=FALSE]',
      'Negative indexes exclude rows or columns. With only one column left, R normally drops the matrix dimension. drop=FALSE keeps a 2×1 matrix containing 4.5 and 55.3.',
      [
        value('reduced', 'matrix(c(4.5,8.2,55.3,27.9),2,byrow=TRUE)'),
        value('single_column', 'c(4.5,55.3)'),
        value('kept_matrix', 'matrix(c(4.5,55.3),ncol=1)'),
      ],
      {
        concept:
          'drop=FALSE preserves the matrix dimensions when a selection would otherwise simplify to a vector. This is a workshop bridge from the lecture’s dimension-dropping examples.',
        hints: [
          'A negative vector excludes several indexes together.',
          'kept_matrix <- A[-1,-c(2,3),drop=FALSE]',
        ],
      },
    ),
    code(
      'matrix-logical-order',
      'Select with a logical matrix',
      'Create mask marking entries in traffic at least 30. Use it to create selected. Store the number of matches in match_count.',
      'traffic <- matrix(c(18,24,30,21,27,33,20,26,35,22,29,38),3,byrow=TRUE)',
      'traffic <- matrix(c(18,24,30,21,27,33,20,26,35,22,29,38),3,byrow=TRUE)\nmask <- traffic >= 30\nselected <- traffic[mask]\nmatch_count <- sum(mask)',
      'A logical matrix has the same 3×4 shape as traffic. One-index logical selection produces a vector in column-major order: 35,33,30,38. The count is 4.',
      [
        value(
          'mask',
          'matrix(c(FALSE,FALSE,TRUE,FALSE,FALSE,TRUE,FALSE,FALSE,TRUE,FALSE,FALSE,TRUE),3,byrow=TRUE)',
        ),
        value('selected', 'c(35,33,30,38)'),
        value('match_count', '4'),
      ],
      {
        hints: [
          'Create the comparison for the entire matrix.',
          'selected <- traffic[mask]\nmatch_count <- sum(mask)',
        ],
      },
    ),
    code(
      'matrix-overwrite-sequence',
      'Overwrite a row, cells and a column',
      'Copy A to B. Set row 2 to 1:3; set column 2 in rows 1 and 3 to 900; then replace column 3 using the current row 3. Preserve A. Inspect the final matrix.',
      aInput,
      aInput + '\nB <- A\nB[2,] <- 1:3\nB[c(1,3),2] <- 900\nB[,3] <- B[3,]\nB',
      'Each assignment uses the current values. Before replacing column 3, row 3 is 55.3,900,27.9, so B[2,3] becomes 900. The lecture’s second manually typed Output block shows 105.5 there; its executable example and R give 900.',
      [
        value('B', 'matrix(c(0.3,900,55.3,1,2,900,55.3,900,27.9),3,byrow=TRUE)'),
        value('A', 'matrix(c(0.3,4.5,55.3,91,0.1,105.5,-4.2,8.2,27.9),3)'),
      ],
      {
        hints: [
          'Apply each change before evaluating the next right-hand side.',
          'B[,3] <- B[3,] uses row 3 after the earlier modifications.',
        ],
      },
    ),
    code(
      'matrix-diagonal',
      'Extract the main diagonal',
      'Use diag(A) to save the main diagonal in diagonal. Save its length in diagonal_length.',
      aInput,
      aInput + '\ndiagonal <- diag(A)\ndiagonal_length <- length(diagonal)',
      'diag(A) selects A[1,1], A[2,2], A[3,3]: 0.3,0.1,27.9. The result is a vector of length 3.',
      [value('diagonal', 'c(0.3,0.1,27.9)'), value('diagonal_length', '3')],
      { hints: ['The main diagonal has equal row and column indexes.', 'diagonal <- diag(A)'] },
    ),
    code(
      'matrix-offset-diagonal',
      'Optional: select an offset diagonal',
      'For the supplied 6×7 matrix M, build sel with col(M)-row(M)==2, then save M[sel] as diagonal_values and which(sel,arr.ind=TRUE) as coordinates.',
      'M <- matrix(1:42,nrow=6,ncol=7)',
      'M <- matrix(1:42,nrow=6,ncol=7)\nsel <- col(M)-row(M)==2\ndiagonal_values <- M[sel]\ncoordinates <- which(sel,arr.ind=TRUE)',
      'An offset of +2 selects (1,3),(2,4),(3,5),(4,6),(5,7). Their values are 13,20,27,34,41. row() and col() supply coordinate matrices; which(...,arr.ind=TRUE) reports matching positions.',
      [
        value('sel', 'col(matrix(0,6,7))-row(matrix(0,6,7))==2'),
        value('diagonal_values', 'c(13,20,27,34,41)'),
        value('coordinates', 'cbind(1:5,3:7)'),
      ],
      {
        hints: [
          'Positive column-minus-row offsets lie above the main diagonal.',
          'sel <- col(M)-row(M)==2',
        ],
      },
    ),
    code(
      'connect4-cells',
      'Represent moves as matrix updates',
      'Create a 6×7 numeric board of zeros. Place Player 1 at [6,4] and Player 2 at [6,5]. Copy it to moved_board. Undo Player 2’s move in board by restoring only [6,5] to zero. Save [6,4] in occupant.',
      '# Zero means empty; players use 1 and 2.',
      'board <- matrix(0,6,7)\nboard[6,4] <- 1\nboard[6,5] <- 2\nmoved_board <- board\nboard[6,5] <- 0\noccupant <- board[6,4]',
      'The bottom row is row 6. A single-cell assignment affects just that position. moved_board preserves both moves; board retains only Player 1’s move.',
      [
        value('moved_board', 'local({x<-matrix(0,6,7);x[6,4]<-1;x[6,5]<-2;x})'),
        value('board', 'local({x<-matrix(0,6,7);x[6,4]<-1;x})'),
        value('occupant', '1'),
      ],
      { hints: ['Use [row,column] on the left of an assignment.', 'board[6,5] <- 0'] },
    ),
    code(
      'connect4-lowest',
      'Optional: find the lowest empty row',
      'Column 4 already contains a disc in row 6. Find its empty row indexes with which(). Start lowest_row as NA_integer_, then update it to the largest empty row index inside if(length(empty_rows)>0). Store the result for an entirely full column in full_result using the same guarded approach.',
      boardInput +
        '\nfull_column <- rep(2,6)\n# Guard the maximum calculation when no empty positions exist.',
      boardInput +
        '\nfull_column <- rep(2,6)\nempty_rows <- which(board[,4]==0)\nlowest_row <- NA_integer_\nif(length(empty_rows)>0) { lowest_row <- max(empty_rows) }\nfull_empty <- which(full_column==0)\nfull_result <- NA_integer_\nif(length(full_empty)>0) { full_result <- max(full_empty) }',
      'Larger row indexes are lower on the board, so row 5 is the next slot. A full column has no empty indexes: skip max() and keep NA_integer_. The if condition must be one logical value.',
      [value('empty_rows', '1:5'), value('lowest_row', '5'), value('full_result', 'NA_integer_')],
      {
        concept:
          'if(condition) runs its block only when condition is TRUE. NA_integer_ is a missing integer, used here when there is no valid row.',
        hints: [
          'Check length(empty_rows)>0 before computing max(empty_rows).',
          'Set the missing default before the if block.',
        ],
      },
    ),
    code(
      'connect4-character',
      'Use a character board and a local win check',
      'Create a character board with "-" for every empty cell. Put "X" at [6,4] and "O" at [5,4]. Also put four X values in row 3, columns 2–5. Save column 3’s empty row indexes in open_rows and all(board[3,2:5]=="X") in four_in_row. This exercise inspects specified cells, rather than implementing a complete game.',
      '# Keep the character representation consistent throughout.',
      'board <- matrix("-",6,7)\nboard[6,4] <- "X"\nboard[5,4] <- "O"\nboard[3,2:5] <- "X"\nopen_rows <- which(board[,3]=="-")\nfour_in_row <- all(board[3,2:5]=="X")',
      'A matrix can hold characters as well as numbers, but its cells share one underlying type. open_rows is 1,2,4,5,6. all() is TRUE only when every selected comparison is TRUE. A full game would also need gravity, turns, and checks across the entire board.',
      [
        value('board', 'local({x<-matrix("-",6,7);x[6,4]<-"X";x[5,4]<-"O";x[3,2:5]<-"X";x})'),
        value('open_rows', 'c(1,2,4,5,6)'),
        value('four_in_row', 'TRUE'),
      ],
      {
        hints: [
          'Use "-" as the empty value in every comparison for this representation.',
          'four_in_row <- all(board[3,2:5]=="X")',
        ],
        manual:
          'These are deliberately constructed matrix states for indexing practice. They are not a complete sequence of legal Connect 4 moves.',
      },
    ),
  ],
  practice: vectorsMatricesPractice,
  exam: [
    choice(
      'paper-repeat-pattern',
      'Read a repetition pattern',
      'Predict x without running the code.',
      'x <- rep(c("N","S"),each=2,times=2)',
      ['N,S,N,S,N,S,N,S', 'N,N,S,S,N,N,S,S', 'N,N,N,N,S,S,S,S'],
      1,
      'each=2 first produces N,N,S,S; times=2 repeats that whole result.',
    ),
    choice(
      'paper-first-maximum',
      'Remove one maximum',
      'What does result contain?',
      delayInput + '\nresult <- delay[-which.max(delay)]',
      ['8,3,5,1,7,4', '8,3,5,12,1,7,4', '8,3,12,5,1,7,4'],
      1,
      'which.max returns the first maximum position, 3. Only that position is excluded; the other 12 remains.',
    ),
    choice(
      'paper-matrix-direction',
      'Trace matrix filling',
      'What is m[2,3]?',
      'm <- matrix(11:22,nrow=3)',
      ['17', '18', '20'],
      1,
      'Default filling places 17,18,19 in column 3, so row 2 contains 18.',
    ),
    choice(
      'paper-matrix-logical',
      'Trace logical extraction order',
      'Predict the order returned by the last line.',
      'm <- matrix(c(18,24,30,21,27,33,20,26,35,22,29,38),3,byrow=TRUE)\nm[m >= 30]',
      ['30,33,35,38', '35,33,30,38', '38,35,33,30'],
      1,
      'Logical matrix extraction traverses columns: 35 in column 1, 33 in column 2, 30 in column 3, 38 in column 4.',
    ),
    choice(
      'paper-matrix-drop',
      'Predict the result structure',
      'What structure does result have?',
      'm <- matrix(1:12,3,byrow=TRUE)\nresult <- m[1:2,2]',
      ['A 2×1 matrix', 'A numeric vector of length 2', 'A 1×2 matrix'],
      1,
      'Selecting a single column drops the matrix dimensions by default. Use drop=FALSE to preserve a 2×1 matrix.',
    ),
    written(
      'paper-index-diagnosis',
      'Explain invalid indexes',
      'Explain why delay[c(-2,4)] is invalid. Write two expressions, one with positive indexes and one with negative indexes, that retain positions 1 and 3–8 of an eight-element delay vector. Explain what a zero index does.',
      'Positive indexes select; negative indexes exclude. R does not permit both signs together, except that zero may be mixed with either sign. Use delay[c(1,3:8)] or delay[-2]. Zero selects no element.\n\nSelf-review: did you distinguish positions from values and provide both equivalent selections?',
    ),
    written(
      'paper-matrix-repair',
      'Repair one cell on paper',
      'A 3×4 counts matrix has the erroneous value 410 at [2,2]. Explain the effect of counts[2,] <- 41. Write code to correct only the cell on a copy, add a fourth row c(40,46,52,54), and remove column 2. State the final dimensions.',
      'counts[2,] <- 41 overwrites every cell of row 2.\ncounts_clean <- counts\ncounts_clean[2,2] <- 41\ncounts_extended <- rbind(counts_clean,c(40,46,52,54))\ncounts_reduced <- counts_extended[,-2]\nThe result has 4 rows and 3 columns.\n\nSelf-review: preserve the original and change exactly one erroneous cell before extending the table.',
    ),
    written(
      'paper-vector-plan',
      'Plan a vector solution',
      'Describe how to model four ahead/behind combinations when clock A reads 14, the A–B difference is 4 and the B–C difference is 3. Write R expressions to generate the cases and identify the impossible choice among 7,13,15,17,21. Explain why the sign vectors must align.',
      'ab_sign <- rep(c(-1,1),each=2)\nbc_sign <- rep(c(-1,1),times=2)\npossible <- 14 + 4*ab_sign + 3*bc_sign\noptions <- c(7,13,15,17,21)\noptions[!(options %in% possible)]\nThe possible readings are 7,13,15,21; 17 is impossible. Each shared position represents one pair of directions.\n\nSelf-review: all four direction combinations must appear once; compare calculated possibilities with the options, rather than removing a memorized position.',
    ),
  ],
};
