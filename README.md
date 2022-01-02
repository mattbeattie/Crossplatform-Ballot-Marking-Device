# MVP-App-TestHarness

- [Application Architecture](#application-architecture)
- [Development Workflow](#development-workflow)
- [Standardization and Quality Checks](#standardization-and-quality-checks)
  - [Linting](#linting)
  - [Formatting](#formatting)
  - [Unit testing](#unit-testing)
  - [Integration testing](#integration-testing)
- [Todo](#todo)

The project (codenamed "Elroy") handles ballot markup. It is part of the overall Markit ecosystem and will eventually be folded into a single application

## Application Architecture

This application is comprised of a single page (the `home` page) which uses several services and launches mulitiple modal pages to guide users through the ballot markup process.

The services are as follows:

1. The election model service, which handles fetching the XML election definition file and converting it to an object that the application can parse (including the TypeScript interfaces and enums which help define the model)
2. The ballot state service, which holds the state for the user's choices, as well as the logic for generating the CVR (todo: should that be broken out into another service?)

The modals are as follows:

1. Model popup
2. Present one contest
3. Setting modal, which handles changing the election definition file on the fly todo: need to make sure this resets the user state when it switches
4. Vote review
5. Write-in modal, which handles the user input for the write-in option

```
todo: need to update this once I get around to cleaning up the modals
```

## Building native binaries

```
todo: need to determine the steps and write them here
```

## Development Workflow

To ensure a standardized development workflow, all new changes should be added as Pull Requests. In order to be merged to the main branch, PRs must be:

1. Passing all status checks (there are implemented using GitHub Actions)
2. Up to date with the main branch
3. Approved by at least one other person

When merging, the "squash and merge" strategy is used, which ensures all commits in the feature branch have been squashed to a single commit. This keeps the main branch's commit logs clean and readable.

## Standardization and Quality Checks

### Linting

This repo uses [ESlint](https://eslint.org/) to detect and prevent potential issues using static analysis.

ESlint will run automatically as a pre-commit hook anytime you attempt to make a commit. If it detects any problems, it will prevent the commit and alert you to the issue. Once remediated, you should be able to commit cleanly.

To run ESlint manually, execute the following:

```bash
npm run lint
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

### Integration testing

This repo uses [Cypress](https://www.cypress.io/) for integration testing.

To run integration tests manually, execute the following:

```bash
npm run e2e
```

## Todo

- Set node / npm version in package.json
- Git ignore build directory
- Figure out how to do the build?
- Figure out what needs to be displayed for ballot markup option
- Clean up all modals
- User state
