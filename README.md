# Reusable Workflows for Developing Actions

This repository contains [reusable workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows) that are useful for developing actions.

## Available reusable workflows

- [`basic-validation.yml`](./.github/workflows/basic-validation.yml)

This workflow helps ensure that the code of the action you are going to deploy:
1. Is well-formated
2. Is linted
3. Successfully builds
4. Passes unit-tests
Additionally node packages used by the action can be audited.

Default use pattern:
```
basic-validation-call:
  uses: actions/reusable-workflows/.github/workflows/basic-validation.yml@main
```

- [`check-dist.yml`](./.github/workflows/check-dist.yml)

This workflow helps ensure that generated innards of `dist` directory match what they are expected to be.
The `dist` is a particular directory in Actions that contains distributable JS files.
In Actions, the `dist` is generated through a build process from other source files.

Default use pattern:
```
check-dist-call:
  uses: actions/reusable-workflows/.github/workflows/check-dist.yml@main
```

- [`codeql-analysis.yml`](./.github/workflows/codeql-analysis.yml)

This workflow helps to analyze repository code for vulnerabilities, bugs, and other errors using CodeQL. 
For that CodeQL Action is used: https://github.com/github/codeql-action

Default use pattern:
```
codeql-analysis-call:
  uses: actions/reusable-workflows/.github/workflows/codeql-analysis.yml@main
```

- [`licensed.yml`](./.github/workflows/licensed.yml)

This workflow helps to check the statuses of cached dependencies used in action with the help of the Licensed tool.

Default use pattern:
```
licensed-call:
  uses: actions/reusable-workflows/.github/workflows/licensed.yml@main
```
## Adjusting reusable workflows

If the default behaviour of a reusable workflow isn't what you need, you can adjust it using the workflow's inputs.
Check the available inputs of reusable workflows in the corresponding YAML file in `.github/workflows/<reusable-workflow-name>.yml`.

Example of disabling audit of npm packages in the basic-validation workflow:
```
basic-validation-call:
  uses: actions/reusable-workflows/.github/workflows/basic-validation.yml@main
  with:
    enable-audit: false
```
