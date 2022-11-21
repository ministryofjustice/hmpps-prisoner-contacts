# hmpps-prisoner-contacts
[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=flat&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-prisoner-contacts)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-prisoner-contacts "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-prisoner-contacts/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-prisoner-contacts)

Api for all prisoner contact information.

## Running the app
The easiest way to run the app is to use docker compose to create the service and all dependencies. 

`docker-compose pull`

`docker-compose up`

### Dependencies
The app requires: 
* hmpps-auth - for authentication
* redis - session store and token caching

### Running the app for development

To start the main services excluding the example typescript template app: 

`docker-compose up --scale=app=0`

Install dependencies using `npm install`, ensuring you are using >= `Node v14.x`

And then, to build the assets and start the app with nodemon:

`npm run start:dev`

### Run linter

`npm run lint`

### Run tests

`npm run test`

### Running integration tests

For local running, start a test db, redis, and wiremock instance by:

`docker-compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`
 
Or run tests with the cypress UI:

`npm run int-test-ui`


### Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`

### Generating types

Commands to generate types from the apis:

`npx openapi-typescript https://api-dev.prison.service.justice.gov.uk/v3/api-docs --output server/@types/nomisPrisonerImport/index.d.ts`

`npx openapi-typescript https://prisoner-offender-search-dev.prison.service.justice.gov.uk/v3/api-docs --output server/@types/prisonerSearchImport/index.d.ts`
