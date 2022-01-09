# MVP-App-TestHarness

- [Application Architecture](#application-architecture)
  - [Home page](#home-page)
  - [Contest components](#contest-components)
  - [Modals](#modals)
  - [Services](#services)
  - [How do I...](#how-do-i)
- [Running the Application](#running-the-application)
- [Ensuring Quality in the Application](#ensuring-quality-in-the-application)
- [Building Native Binaries](#building-native-binaries)
- [Development Workflow](#development-workflow)

- [Todo](#todo)

The project (codenamed "Elroy") handles ballot markup. It is part of the overall Markit ecosystem and will eventually be folded into a single application

## Application Architecture

Inside the `src/app` directory, there are several root directories where the core of the application's logic lives.

### Home page

The home page lives in `src/app/home/` and is the root of the application.

The home page provides the root template which handles loading the application, launching the modals in the header and footer, and allowing the user to work their way through the various contest pages as part of the ballot markup process.

### Ccomponents

Each contest's HTML template and business logic are encapsulated in its own component inside `src/app/components/`.

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

## Ensuring Quality in the Application

Information regarding the quality checks and how they're enforced in CI can be found in the [Quality Checks](./QUALITY_CHECKS.md) page.

## Building Native Binaries

```
todo: need to determine the steps and write them here
```

## Development Workflow

To ensure a standardized development workflow, all new changes should be added as Pull Requests. In order to be merged to the main branch, PRs must be:

1. Passing all quality checks (there are implemented as a status check using GitHub Actions)
2. Up to date with the main branch
3. Approved by at least one other person

When merging, the "squash and merge" strategy is used, which ensures all commits in the feature branch have been squashed to a single commit. This keeps the main branch's commit logs clean and readable.

## Todos

### Immediate todos

- Get vote review and present one contest modals working, and then move them into the modals directory
- CVR generation
- Get write-ins working

### Later todo

- Figure out why some EDFs fail to load
- Figure out how to do the native builds and add documentation for it
- Figure out what needs to be displayed for ballot markup option
- Add tests for everything
- Update compromised packages per GitHub's recommendation
- Remove this section
