#!/usr/bin/env bash
# Workers Builds does not allow privileged package installation. Keep Chromium's
# Ubuntu 24.04 runtime libraries outside the checkout and load them per process.
set -euo pipefail

npm ci
npm run check
npm run check:reproducible
npx playwright install --only-shell chromium

workshop_browser_libraries=/tmp/mis130-browser-libs
mkdir -p "$workshop_browser_libraries"
(
  cd "$workshop_browser_libraries"
  # The image removes apt indexes. Refresh signed repository metadata in a
  # writable temporary directory instead of the system's /var/lib/apt/lists.
  mkdir -p apt-lists/partial apt-cache/archives/partial
  workshop_apt_options=(
    -o "Dir::State::lists=$workshop_browser_libraries/apt-lists"
    -o "Dir::Cache=$workshop_browser_libraries/apt-cache"
  )
  apt-get "${workshop_apt_options[@]}" update
  # Chromium's Ubuntu 24.04 package list from the pinned Playwright distribution.
  apt-get "${workshop_apt_options[@]}" download \
    libasound2t64 libatk-bridge2.0-0t64 libatk1.0-0t64 libatspi2.0-0t64 \
    libcairo2 libcups2t64 libdbus-1-3 libdrm2 libgbm1 libglib2.0-0t64 \
    libnspr4 libnss3 libpango-1.0-0 libx11-6 libxcb1 libxcomposite1 \
    libxdamage1 libxext6 libxfixes3 libxkbcommon0 libxrandr2 libxi6 libxtst6
  for workshop_package in ./*.deb; do
    dpkg-deb --extract "$workshop_package" ./runtime
  done
)

export LD_LIBRARY_PATH="$workshop_browser_libraries/runtime/usr/lib/x86_64-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
export CI=true
# Fail once with a useful loader error instead of repeating it for every test.
node --input-type=module - <<'JS'
import { chromium } from '@playwright/test';
const browser = await chromium.launch();
await browser.close();
JS
npm test
npm run test:production
