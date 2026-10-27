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
  'ps5-construction':
    'route_id <- seq(from = 210, to = 245, by = 5)\nzone_times <- rep(c("N", "S"), times = 4)\nzone_each <- rep(c("N", "S"), each = 4)\n\nroute_id\nlength(route_id)\nzone_times\nlength(zone_times)\nzone_each\nlength(zone_each)\ndescending <- seq(from = 12, to = 3, by = -3)\nstop_order <- c(seq(1, 7, by = 2), seq(2, 8, by = 2))\ndescending\nstop_order',
  'ps5-indexing':
    'delay <- c(8, 3, 12, 5, 12, 1, 7, 4)\ndelay[c(1, 4, 8)]\ndelay[delay >= 7]\ndelay[-c(2, 6)]\ndelay[c(8, 3, 3, 1)]\nwithout_first_max <- delay[-which.max(delay)]\nmiddle_values <- delay[delay >= 4 & delay < 10]\nkeep_without_second <- delay[-2]\n\nwithout_first_max\nmiddle_values\nkeep_without_second',
  'ps5-filling':
    'values <- 11:22\nby_column <- matrix(values, nrow = 3, ncol = 4)\nby_row <- matrix(values, nrow = 3, ncol = 4, byrow = TRUE)\n\nby_column\nby_row\ndim(by_column)\nnrow(by_row)\nncol(by_row)\nwhich(by_column == 18, arr.ind = TRUE)\nwhich(by_row == 18, arr.ind = TRUE)\nby_row_with_rbind <- rbind(11:14, 15:18, 19:22)\nby_row_with_rbind',
  'ps5-subsets':
    'traffic <- matrix(\n  c(18, 24, 30, 21,\n    27, 33, 20, 26,\n    35, 22, 29, 38),\n  nrow = 3,\n  byrow = TRUE\n)\nrownames(traffic) <- c("R1", "R2", "R3")\ncolnames(traffic) <- c("08", "10", "12", "14")\ntraffic\ntraffic[2, 3]\ntraffic[, 2]\ntraffic[1:2, c(1, 4)]\ntraffic[c(3, 1), c(4, 2)]\nat_least_30 <- traffic[traffic >= 30]\ncorrect_cell <- traffic[2, 4]\nselected_matrix <- traffic[c(1, 3), -2]\n\nat_least_30\ncorrect_cell\nselected_matrix',
  'ps5-repair':
    'counts <- matrix(\n  c(42, 51, 48, 55,\n    39, 410, 44, 50,\n    36, 45, 47, 49),\n  nrow = 3,\n  byrow = TRUE\n)\nrownames(counts) <- c("A", "B", "C")\ncolnames(counts) <- c("P1", "P2", "P3", "P4")\ncounts\ncounts_clean <- counts\ncounts_clean[2, 2] <- 41\ncounts_clean[, 4] <- c(56, 51, 50)\n\ncounts_extended <- rbind(counts_clean, D = c(40, 46, 52, 54))\ncounts_reduced <- counts_extended[, -2]\n\ncounts_clean\ncounts_extended\ncounts_reduced\ndim(counts_reduced)\ncounts_reduced[counts_reduced >= 50]',
  'ps5-challenge':
    'counts <- matrix(\n  c(42, 51, 48, 55,\n    39, 410, 44, 50,\n    36, 45, 47, 49),\n  nrow = 3,\n  byrow = TRUE\n)\nrownames(counts) <- c("A", "B", "C")\ncolnames(counts) <- c("P1", "P2", "P3", "P4")\ncounts\ncounts[, c(4, 1)]\ncounts_with_na <- counts\ncounts_with_na[counts_with_na > 100] <- NA\ncounts_with_na\ncounts_corrected <- counts\ncounts_corrected[2, 2] <- 41\nsum(counts_corrected >= 50)',
  'lab5-combine':
    'branch_a <- c(42, 35, 51, 28)\nbranch_b <- c(45, 31, 58, 33)\nbranch_c <- c(40, 39, 55, 30)\n\nall_sales <- c(branch_a, branch_b, branch_c)\n\nall_sales\nlength(all_sales)\nclass(all_sales)',
  'lab5-identifiers':
    'branch_a <- c(42, 35, 51, 28)\nbranch_b <- c(45, 31, 58, 33)\nbranch_c <- c(40, 39, 55, 30)\n\nall_sales <- c(branch_a, branch_b, branch_c)\n\nall_sales\nproduct_ids <- seq(from = 101, to = 104, by = 1)\nbranch_labels <- rep(c("A", "B", "C"), each = 4)\nproduct_pattern <- rep(product_ids, times = 3)\n\nproduct_ids\nbranch_labels\nproduct_pattern\nc(length(branch_labels), length(product_pattern), length(all_sales))',
  'lab5-correct':
    'recorded_b <- c(45, 310, 58, 33)\nrecorded_b\nbranch_b_corrected <- recorded_b\nbranch_b_corrected[2] <- 31\n\nbranch_b_desc <- sort(branch_b_corrected, decreasing = TRUE)\nbest_product_position <- which.max(branch_b_corrected)\ntarget_sales <- branch_b_corrected[branch_b_corrected >= 40]\nfirst_three <- branch_b_corrected[-4]\n\nbranch_b_corrected\nbranch_b_desc\nbest_product_position\ntarget_sales\nfirst_three',
  'lab5-build':
    'branch_a <- c(42, 35, 51, 28)\nbranch_b <- c(45, 31, 58, 33)\nbranch_c <- c(40, 39, 55, 30)\n\nall_sales <- c(branch_a, branch_b, branch_c)\n\nall_sales\nsales <- rbind(branch_a, branch_b, branch_c)\n\nsales_from_matrix <- matrix(\n  c(branch_a, branch_b, branch_c),\n  nrow = 3,\n  byrow = TRUE\n)\n\nsales\nsales_from_matrix\ndim(sales)\nnrow(sales)\nncol(sales)',
  'lab5-extract':
    'branch_a <- c(42, 35, 51, 28)\nbranch_b <- c(45, 31, 58, 33)\nbranch_c <- c(40, 39, 55, 30)\n\nall_sales <- c(branch_a, branch_b, branch_c)\n\nall_sales\nsales <- rbind(branch_a, branch_b, branch_c)\n\nsales_from_matrix <- matrix(\n  c(branch_a, branch_b, branch_c),\n  nrow = 3,\n  byrow = TRUE\n)\n\nsales\nbranch_b_sales <- sales[2, ]\nproduct_3_sales <- sales[, 3]\nselected_block <- sales[1:2, 2:4]\ncorner_sales <- sales[c(1, 3), c(1, 4)]\n\nbranch_b_sales\nproduct_3_sales\nselected_block\ncorner_sales',
  'lab5-logical':
    'branch_a <- c(42, 35, 51, 28)\nbranch_b <- c(45, 31, 58, 33)\nbranch_c <- c(40, 39, 55, 30)\n\nall_sales <- c(branch_a, branch_b, branch_c)\n\nall_sales\nsales <- rbind(branch_a, branch_b, branch_c)\n\nsales_from_matrix <- matrix(\n  c(branch_a, branch_b, branch_c),\n  nrow = 3,\n  byrow = TRUE\n)\n\nsales\ntarget_matrix <- sales >= 50\nhigh_sales <- sales[target_matrix]\ntarget_count <- sum(target_matrix)\n\ntarget_matrix\nhigh_sales\ntarget_count',
  'lab5-update':
    'branch_a <- c(42, 35, 51, 28)\nbranch_b <- c(45, 31, 58, 33)\nbranch_c <- c(40, 39, 55, 30)\n\nall_sales <- c(branch_a, branch_b, branch_c)\n\nall_sales\nsales <- rbind(branch_a, branch_b, branch_c)\n\nsales_from_matrix <- matrix(\n  c(branch_a, branch_b, branch_c),\n  nrow = 3,\n  byrow = TRUE\n)\n\nsales\nsales_updated <- sales\nsales_updated[2, 2] <- 37\nsales_updated[, 4] <- c(30, 34, 32)\n\nbranch_d <- c(44, 36, 52, 29)\nsales_extended <- rbind(sales_updated, branch_d)\nsales_reduced <- sales_extended[, -2]\n\nsales_updated\nsales_extended\nsales_reduced',
  'lab5-balloons':
    'inserted <- c(white = 2, yellow = 4)\ngap_counts <- inserted + 1\n\nspan <- 18 / (1 / gap_counts["white"] - 1 / gap_counts["yellow"])\nspacing <- span / gap_counts\n\nwhite_positions <- seq(\n  from = 0,\n  to = span,\n  length.out = gap_counts["white"] + 1\n)\nyellow_positions <- seq(\n  from = 0,\n  to = span,\n  length.out = gap_counts["yellow"] + 1\n)\n\nspan\nspacing\nwhite_positions\nyellow_positions\nspacing["white"] - spacing["yellow"]',
};
