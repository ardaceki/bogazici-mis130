// Transcribed from the provided instructor HTML answer chunks.
// Initialization is included; rendered output comments are omitted.
// PS 2 Q4 shows its intentional error in a separate chunk, not a runnable script.
export const instructorSolutions = {
  'lab2-three': 'A <- 13\nB <- 27\nC <- 14\nA + B + C\n(A + B + C) / 3\nA * B * C',
  'lab2-operators': 'num1 <- 13\nnum2 <- 5\nnum1 - num2\nnum1 ^ num2\nnum1 %% num2',
  'lab2-compound':
    'A <- 1000\ni <- 12\nn <- 5\nS <- A * (1 + i / 100) ^ n\nround(S, 2)\nA <- 500\nS <- A * (1 + i / 100) ^ n\nround(S, 2)',
  'lab2-seconds':
    'years <- 5\nmonths <- 2\ndays <- 4\nhours <- 3\nminutes <- 2\ntotal_days <- years * 365 + months * 30 + days\ntotal_seconds <- total_days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60\ntotal_seconds',
  'lab2-future': 'PV <- 1000\nr <- 0.08\nn <- 5\nFV <- PV * (1 + r) ^ n\nFV',
  'lab2-pi':
    'sq <- pi ^ 2\nsq_root <- sqrt(pi)\npi_floor <- floor(pi)\npi_ceiling <- ceiling(pi)\nsq * sq_root * pi_floor * pi_ceiling',
  'ps2-tickets':
    '# Cost of three tickets\nticket_price <- 40\nticket_count <- 3\ntotal_cost <- ticket_price * ticket_count\ntotal_cost\ntotal_cost + 10\ntotal_cost\namount_due <- total_cost + 10\namount_due',
  'ps2-types':
    'seat_count <- 24\nroom_label <- "24"\nclass(seat_count)\nclass(room_label)\nseat_count + 1\nseat_count <- "full"\nseat_count\nclass(seat_count)\nseat_count <- 24',
  'ps2-remove':
    'ps01_note <- "practice"\nps01_score <- 8\nls()\nrm(ps01_note)\nps01_score\nps01_note <- "practice"\nps01_note',
  'ps2-script': 'getwd()\nsource("ticket-cost.R")',
  'ps3-debug': 'x <- 10\ny <- "apple"\nz <- x + 5\nprint(z)',
  'ps3-operators':
    'a <- 17\nb <- 5\np <- TRUE\nq <- FALSE\nlist(\n  modulo = a %% b,\n  integer_division = a %/% b,\n  combined = (a %% b) + (a %/% b),\n  gt = a > b,\n  and_case = (a > b) & p,\n  or_case = (a < b) | q\n)',
  'ps3-length':
    'x <- c(4, 8, 12)\nlength(x) <- 6\nx_extended <- x\nlength(x) <- 2\nx_final <- x\n\nlist(x_extended = x_extended, x_final = x_final)',
  'ps3-matrix':
    'm <- matrix(1:12, nrow = 3, byrow = TRUE)\nrownames(m) <- c("R1", "R2", "R3")\ncolnames(m) <- c("C1", "C2", "C3", "C4")\n\nlist(\n  matrix = m,\n  r2c3 = m[2, 3],\n  row_sums = rowSums(m),\n  col_sums = colSums(m)\n)',
  'lab3-population':
    'cityA <- 10000\ncityB <- 20000\n# SOLUTION\n# begin your code below\ncityA_next <- cityA + 0.02*cityB - 0.01*cityA\ncityB_next <- cityB + 0.01*cityA - 0.02*cityB\ncityA <- cityA_next\ncityB <- cityB_next\n\ncityA_next <- cityA + 0.02*cityB - 0.01*cityA\ncityB_next <- cityB + 0.01*cityA - 0.02*cityB\ncityA <- cityA_next\ncityB <- cityB_next\n\ncityA_next <- cityA + 0.02*cityB - 0.01*cityA\ncityB_next <- cityB + 0.01*cityA - 0.02*cityB\ncityA <- cityA_next\ncityB <- cityB_next\n\ncityA_next <- cityA + 0.02*cityB - 0.01*cityA\ncityB_next <- cityB + 0.01*cityA - 0.02*cityB\ncityA <- cityA_next\ncityB <- cityB_next\ncityA_next <- cityA + 0.02*cityB - 0.01*cityA\ncityB_next <- cityB + 0.01*cityA - 0.02*cityB\ncityA <- cityA_next\ncityB <- cityB_next\n\n# end of your code\ncityA\ncityB',
  'lab3-boxes':
    'total <- 983\nper_box <- 24\n# SOLUTION\n# begin your code below\nfull_boxes <- total %/% per_box\nleftover   <- total %% per_box\n# end of your code\nlist(full_boxes = full_boxes, leftover = leftover)',
  'lab3-grade':
    'midterm <- 78\n# SOLUTION\n# begin your code below\nfinal   <- 91\nproj_items <- c(86, 92, 88, 90)\nproject <- mean(proj_items)\n\noverall <- 0.35*midterm + 0.45*final + 0.20*project\n\n# end of your code\nlist(overall=round(overall,2))',
  'lab3-sales':
    'sales <- matrix(c(120,95,140,  85,110,130), nrow=2, byrow=TRUE)\nrownames(sales) <- c("A","B")\ncolnames(sales) <- paste0("M", 1:3)\n# SOLUTION\n# begin your code below\n\ntotal_units_per_product <- rowSums(sales)\ngrand_total     <- sum(sales)\nmonth_totals    <- colSums(sales)\nbest_month      <- which.max(month_totals)  # 1, 2, or 3\n\n# end of your code\nlist(\n  total_units_per_product = total_units_per_product,\n  grand_total = grand_total,\n  month_totals = month_totals,\n  best_month = best_month\n)',
  'lab3-departments':
    '# Step 1: Build the matrix\nscores <- matrix(\n  c(88, 92, 79, 85,   # IT\n    75, 81, 69, 74,   # HR\n    91, 95, 89, 93),  # Sales\n  nrow = 3, byrow = TRUE\n)\n# SOLUTION\n# begin your code below\n\n# Step 2: Add names\nrownames(scores) <- c("IT","HR","Sales")\ncolnames(scores) <- paste0("Q", 1:4)\n\n\n# Step 3a: Average per department\ndept_avg <- rowMeans(scores)\n\n\n# Step 3b: Average per quarter\nquarter_avg <- colMeans(scores)\n\n\n# Step 3c: Which department is best?\nbest_dept <- names(which.max(dept_avg))\n\n\n# Step 4: Factor for department names\ndept_factor <- factor(rownames(scores))\n\n# end of your code\nlist(\n  scores = scores,\n  dept_avg = dept_avg,\n  quarter_avg = quarter_avg,\n  best_dept = best_dept,\n  dept_factor = dept_factor\n)',
};
