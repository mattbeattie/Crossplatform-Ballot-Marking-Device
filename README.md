# MVP-App-TestHarness

<<<<<<< HEAD
- [Application Architecture](#application-architecture)
  - [Home page](#home-page)
  - [Contest components](#contest-components)
  - [Modals](#modals)
  - [Services](#services)
  - [How do I...](#how-do-i)
- [Running the Application](#running-the-application)
- [Building Native Binaries](#building-native-binaries)
=======
- [Running the Application](#running-the-application)
>>>>>>> 61683c67b4f11affaa8d3441ad153db7dbe18dea
- [Development Workflow](#development-workflow)
  - [What to do when your PR shows a failing status check](#what-to-do-when-your-pr-shows-a-failing-status-check)
- [Standardization and Quality Checks](#standardization-and-quality-checks)
  - [Linting](#linting)
  - [Formatting](#formatting)
  - [Unit testing](#unit-testing)
  - [E2E testing](#e2e-testing)
<<<<<<< HEAD
- [Todo](#todo)

The project (codenamed "Elroy") handles ballot markup. It is part of the overall Markit ecosystem and will eventually be folded into a single application

## Application Architecture

Inside the `src/app` directory, there are several root directories where the core of the application's logic lives.

### Home page

The home page lives in `src/app/home/` and is the root of the application.

The home page provides the root template which handles loading the application, launching the modals in the header and footer, and allowing the user to work their way through the various contest pages as part of the ballot markup process.

### Contest components

Contest components live in `src/app/contest-components/`.

Each election will contain multiple types of contests (e.g., candidate contests, ballot measure contests, etc, and each of these contest types will have their own unique logic and display rules. Therefore, each contest's template and logic are encapsulated in its own logic.

### Modals

Modals live in `src/app/modals/`. The modals are as follows:

1. "Settings" modal, which allows the user to change the election definition files on the fly
2. "Selected too many" modal, which handles
3. Present one contest `todo: clean this up and get it working`
4. Vote review `todo: clean this up and get it working`
5. Write-in modal, which handles the user input for the write-in option `todo: clean this up and get it working`

### Services

Services live in `src/app/services/`. Each service is responsible for a single task. The services are as follows:

1. Election model fetcher service, which handles fetching the XML election definition file and converting it to a JSON object
2. Election model constructor service, which handles parsing the JSON election into a usable model which this application can use (also includes the TypeScript interfaces and enums which help define the model)
3. CVR generator service, which handles generating the CVR

### How do I...

#### Add a new type of contest?

If you're adding a new type of contest, you'll need to do the following:

1. Update the election modal constructor service to parse out the new contest type from the election data file, updating and adding to the interfaces as necessary
2. Create a new component for the contest type (`npx ng generate component foo-contest`) and move it into the `contest-components` directory
3. Update `home.module.ts`, adding the new component to the `entryComponents` and `declarations` array
4. Update `home.page.html`, adding a conditional for the new contest type which loads the new component and passes in the contest object accordingly
5. Build the necessary template and logic for the new contest into that contest's component

=======

The project (codenamed "Elroy") handles ballot markup. It is part of the overall Markit ecosystem and will eventually be folded into a single application

>>>>>>> 61683c67b4f11affaa8d3441ad153db7dbe18dea
## Running the Application

Ensure you're using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to handle your node versions. If you don't already have it set up on your machine, use nvm's instructions to download and install it.

This application uses node 16 / npm 7, which is the current active LTS version. To ensure you're on the same version, execute the following:

```bash
nvm use
```

Then install the dependencies as follows:

```bash
npm i
```

To run the application, simply execute the following:

```bash
npm start
```

And navigate to [http://localhost:4200/home](http://localhost:4200/home) in your browser.

<<<<<<< HEAD
## Building Native Binaries

```
todo: need to determine the steps and write them here
```

=======
>>>>>>> 61683c67b4f11affaa8d3441ad153db7dbe18dea
## Development Workflow

To ensure a standardized development workflow, all new changes should be added as Pull Requests. In order to be merged to the main branch, PRs must be:

1. Passing all quality checks (there are implemented as a status check using GitHub Actions)
2. Up to date with the main branch
3. Approved by at least one other person

When merging, the "squash and merge" strategy is used, which ensures all commits in the feature branch have been squashed to a single commit. This keeps the main branch's commit logs clean and readable.

### What to do when your PR shows a failing status check

In the event that your PR fails one or more quality gates, GitHub will show "Merging is blocked" on your PR, and you will see a red X next to the failing status check.

In order to resolve the failing status check, you'll need to do the following:

1. Determine the cause of the issue
2. Reproduce it locally
3. Implement, commit, and push a fix

Once the fix is pushed, GitHub Actions will run again and will re-check your latest code. If everything is successful, it will pass and you're clear to merge as long as the other requirements are met. If it fails again, you'll need to go through the same actions above to see what other errors were found.

So, how do you find out what the problem is? First, click on the "Details" button next to the failing status check. This will take you to the GitHub Actions page, and you'll see what quality gate failed.

Below are some common examples:

#### Install issues

If the install fails, you may see any number of errors. One potential common culprit is an npm version mismatch. Generally speaking, you should only see changes in `package-lock.json` if the dependencies in `package.json` have changed. So if there's a large diff in `package-lock.json` without corresponding changes in `package.json`, you'll need to double check your version of node and ensure you're using the correct one. To do so, follow the steps in the [Running the Application](#running-the-application) section.

#### Formatting issues

If formatting fails, you might see something like the following:

```bash
[warn] Code style issues found in the above file(s). Forgot to run Prettier?
Error: Process completed with exit code 1.
```

You'll need reproduce the error locally using the instructions found here under the [Formatting](#formatting) section. Then implement, commit, and push a fix, and confirm that the next run completes successfully.

#### Linting issues

If linting fails, you might see something like the following:

```bash
Lint errors found in the listed files.

...

✖ X problems (X errors, 0 warnings)
  Y errors and 0 warnings potentially fixable with the `--fix` option.
```

You'll need reproduce the error locally using the instructions found here under the [Linting](#linting) section. Then implement, commit, and push a fix, and confirm that the next run completes successfully.

#### Unit testing issues

There are several possible ways that testing could fail.

Tests may not complete successfully. You'll know this is the case if not all tests succeed, which should be evident in the logs. You'll need to reproduce locally using the instructions found here under the [Unit testing](#unit-testing) section. Then implement, commit, and push a fix, and confirm that the next run completes successfully.

Alternatively, test may all complete successfully, but may be below the coverage threshold. This may happen if you have added code, but did not add tests to cover that code. You'll know this is the case if you see one or more of the following in the logs:

```bash
Coverage for statements (X%) does not meet global threshold (Y%)
Coverage for branches (X%) does not meet global threshold (Y%)
Coverage for lines (X%) does not meet global threshold (Y%)
Coverage for functions (X%) does not meet global threshold (Y%)
```

Why would these errors happen even if all tests are passing? Well, these thresholds will cause the overall test operation to fail if the coverage drops below it. Thresholds confirm a certain level of quality and ensure the code is properly covered.

If this happens to you, you have two options:

1. Implement tests to cover the new code that you added. This is the preferred option.
2. If this is not possible, then you can adjust the thresholds. To do this, adjust the numerical thresholds in the [`karma.conf.js`](./karma.conf.js) config file, which correspond to the percentages you see in your error message. Once you adjust the thresholds so that they're less than or equal to the coverage in your branch, then the test operation should pass.

Either way, you should then commit and push the fix, and confirm that the next run completes successfully.

#### E2E testing issues

Given that the UI tests are based on HTML selectors and expected text, it's possible that changing either of those may cause the E2E smoke tests to fail.

You'll need reproduce the error locally using the instructions found here under the [E2E testing](#e2e-testing) section. Then implement, commit, and push a fix, and confirm that the next run completes successfully.

## Standardization and Quality Checks

### Linting

This repo uses [ESlint](https://eslint.org/) to detect and prevent potential issues using static analysis.

ESlint will run automatically as a pre-commit hook anytime you attempt to make a commit. If it detects any problems, it will prevent the commit and alert you to the issue. Once remediated, you should be able to commit cleanly.

To run ESlint manually, execute the following:

```bash
npm run lint
```

To attempt to fix some of these issues automatically (not all issues can be fixed this way; most will require manual interaction), execute the following:

```bash
npm run lint -- --fix
```

### Formatting

This repo uses [Prettier](https://prettier.io/) to ensure standardized formatting rules across the entire codebase.

It's generally a good idea to configure your IDE to format whenever you make a change to a file. If you're using VS Code, you should install the [Prettier extention](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and enable [format on save](https://code.visualstudio.com/updates/v1_6#_format-on-save).

As an additional check, Prettier will run automatically as a pre-commit hook anytime you attempt to make a commit. Any files you have changed will be auto-formatted and added to your commit.

To run Prettier manually, execute the following:

```bash
npm run format:write # writes all formatting changes to disk
npm run format:check # will fail if more than one file is improperly formatted
```

### Unit testing

This repo uses [Karma](https://angular.io/guide/testing) for unit testing.

To run unit tests manually, execute the following:

```bash
npm run test
```

Unit tests will fail if any tests fail, or if code coverage drops below the enforced thresholds. Generally, ideal code coverage levels (for statements/branches/functions/lines) would be around 80%; however, this repo has been set to

To view detailed coverage reports, run the unit tests and then load `./coverage/index.html` in a web browser. This will allow you to view specific coverage information for any file in the repo.

### E2E testing

This repo uses [Cypress](https://www.cypress.io/) for E2E testing.

To run e2e tests manually, execute the following:

```bash
npm run e2e
```

# Todos

## Immediate todos

- Get vote review and present one contest modals working, and then move them into the modals directory
- CVR generation
- Get write-ins working

## Later todo

- Figure out why some EDFs fail to load
- Figure out how to do the native builds and add documentation for it
- Figure out what needs to be displayed for ballot markup option
- Add tests for everything
- Update compromised packages per GitHub's recommendation
