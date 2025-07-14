# Kingdom Tracker

Kingdom Tracker helps manage your Pathfinder 2E kingdom by tracking resources, structures, and turn activities. Its goal is to provide a quick reference for your kingdom between sessions.

This is a purely client-side application written in HTML, CSS, and JavaScript. To run it, clone the repository and open `index.html` in a web browser—no server setup is required.

When running completely offline you'll need local copies of the UIkit assets referenced in `index.html`. Replace the CDN links with paths to those local files so the page can load without internet access.

The app should work in all modern browsers such as Chrome, Firefox, and Safari. Your data is stored locally using `localStorage`, so clearing browser data will delete your kingdoms.

## Features

- Track kingdom resources, unrest and XP across turns
- Build and upgrade settlements with a visual grid
- Manage armies and settlement structures
- History log of previous turns and kingdom growth
- Quick actions and keyboard shortcuts for common tasks
- Import and export save files for backup
- Works completely offline once assets are downloaded

## How to Use

1. Clone or download this repository.
2. Open `index.html` in your browser. No server is required.
3. Use the **Kingdom Management** tab to create or import a kingdom.
4. Navigate the other tabs to run turns, view history and manage settlements and armies.
5. Changes are automatically saved to your browser. Use **Export** to create backups.

Kingdom Tracker is distributed under the terms of the GNU General Public License v2. See the [LICENSE](LICENSE) file for the full text.

## Installing Node and Running Tests

Tests require [Node.js](https://nodejs.org/). Install Node 16 or later if it's not already available on your system. Once installed, run:

```bash
npm test
```

The command executes `tests/runTests.js` using Node's built‑in `assert` module. All tests should print `All tests passed.` when successful.

## Test Suite Overview

`tests/runTests.js` loads the logic from `script.js` and uses small stubs for browser globals so it can run in Node. The suite checks kingdom rules such as settlement overcrowding, upgrade costs, event XP, shortcut handlers and more.

## Contributing

Pull requests are welcome. Please follow the existing style found in `script.js`: two‑space indentation, semicolons and CommonJS modules. When adding features, provide accompanying tests in `tests/runTests.js`.
