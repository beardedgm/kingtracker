# Kingdom Tracker

Kingdom Tracker helps manage your Pathfinder 2E kingdom by tracking resources, structures, and turn activities. Its goal is to provide a quick reference for your kingdom between sessions.

This is a purely client-side application written in HTML, CSS, and JavaScript. To run it, clone the repository and open `index.html` in a web browser—no server setup is required.

When running completely offline you'll need local copies of the UIkit assets referenced in `index.html`. Replace the CDN links with paths to those local files so the page can load without internet access.

The app should work in all modern browsers such as Chrome, Firefox, and Safari. Your data is stored locally using `localStorage`, so clearing browser data will delete your kingdoms.

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
