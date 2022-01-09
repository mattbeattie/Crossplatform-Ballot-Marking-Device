# MVP-App-TestHarness

- [Application Architecture](#application-architecture)
  - [Application parts and filesystem structure](#application-parts-and-filesystem-structure)
  - [Adding a new "type" of contest](#adding-a-new-type-of-contest)
- [Running the Application](#running-the-application)
- [Ensuring Quality in the Application](#ensuring-quality-in-the-application)
- [Building Native Binaries](#building-native-binaries)
- [Development Workflow](#development-workflow)
- [Todos](#todos)
  - [Immediate todos](#immediate-todos)
  - [Later todo](#later-todo)

The project (codenamed "Elroy") handles ballot markup. It is part of the overall Markit ecosystem and will eventually be folded into a single application

## Application Architecture

The ballot markup application has three main goals:

1. Load and parse an election data file (EDF)
2. Guide the user through the process of making selections for each contest
3. On submission, generate a cast vote record (CVR) to be sent downstream

To that end, the application is generally structured as follows:

![image](https://user-images.githubusercontent.com/7593323/148698710-5c5656b1-a6ff-4c28-8a65-9682bf844220.png)

### Application parts and filesystem structure

The "Home" Page lives in `src/app/home/`, and is the root of the application. The home page provides the root template which handles loading the application, launching the modals in the header and footer, and allowing the user to work their way through the various contest pages as part of the ballot markup process.

Contest Components live in `src/app/components/`, and contain the HTML templates and business logic required for each type of contest. Given that every election will contain multiple types of contests (e.g., candidate contests, ballot measure contests, etc), each must have their own unique logic and display rules - encapsulated in a single component.

Modals live in `src/app/modals/`, and are responsible for launching a modal view to the user. Modals should be simple and singular in purpose. They may capture and return some user input to the calling page/component, or they may be launched for informational purposes only.

Services live in `src/app/services/`, and are each responsible for single task. Complex business logic should generally not live in any of the aforementioned application parts, and so therefore are handled at the service layer. At this time nothing from the components or modals use anything from the service layer; however, if these application parts find themselves doing something similar or even identical, that logic should be moved to the service layer accordingly.

### Adding a new "type" of contest

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
