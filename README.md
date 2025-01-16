# Reusable Workflows for Developing Actions

This repository contains [reusable workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows) that are useful for developing actions.

## Background

These workflows are used for the development lifecycles of the GitHub-provided actions in the [github/actions](https://github.com/actions/) org.
We also provide them here to use in actions that you create!

## Available workflows

- [`basic-validation.yml`](./.github/workflows/basic-validation.yml)

This workflow **compiles** and **tests** the code in the repo. It also checks that it passes **linting** and **formatting** rules. Optionally, it can run `npm audit` on the packages in the repo.

**Usage**
```yaml
basic-validation-call:
  uses: actions/reusable-workflows/.github/workflows/basic-validation.yml@main
```

- [`check-dist.yml`](./.github/workflows/check-dist.yml)

This workflow ensures that the generated contents of the `dist` directory match what they are expected to be.
For actions that follow our [TypeScript](https://github.com/actions/typescript-action) or [JavaScript](https://github.com/actions/javascript-action) templates, `dist` contains the packaged script that is executed by the runner.
Whenever you update the source code, the `dist` files must be regenerated for the changes to take effect.

**Usage**
```yaml
check-dist-call:
  uses: actions/reusable-workflows/.github/workflows/check-dist.yml@main
```

- [`codeql-analysis.yml`](./.github/workflows/codeql-analysis.yml)

This workflow uses [GitHub's code scanning feature](https://docs.github.com/en/code-security/code-scanning) to analyze a repository for vulnerabilities, bugs, and other errors. 
This workflow uses [github/codeql-action](https://github.com/github/codeql-action) to run code scanning.

**Usage**
```yaml
codeql-analysis-call:
  uses: actions/reusable-workflows/.github/workflows/codeql-analysis.yml@main
```

- [`licensed.yml`](./.github/workflows/licensed.yml)

This workflow helps to check the statuses of cached dependencies used in action with the help of the Licensed tool.

**Usage**
```yaml
licensed-call:
  uses: actions/reusable-workflows/.github/workflows/licensed.yml@main
```

- [`update-config-files.yml`](./.github/workflows/update-config-files.yml)

This workflow helps to keep configuration files for such tools as ESLint and Prettier up to date with the reference configuration files from the [actions/reusable-workflows](https://github.com/actions/reusable-workflows) repository.
Once the reference configuration files are changed in the [reference folder](https://github.com/actions/reusable-workflows/tree/main/reusable-configurations), the workflow will automatically create PR with updates in the repo where it's launched.

**Usage**
```yaml
update-config-files-call:
  uses: actions/reusable-workflows/.github/workflows/update-config-files.yml@main
```
## Adjusting reusable workflows

If the default behaviour of a reusable workflow isn't what you need, you can adjust it using the workflow's inputs.
Check the available inputs of reusable workflows in the corresponding YAML file in `.github/workflows/<reusable-workflow-name>.yml`.

Example of disabling auditing of NPM packages in the `basic-validation` workflow:
```yaml
basic-validation-call:
  uses: actions/reusable-workflows/.github/workflows/basic-validation.yml@main
  with:
    enable-audit: false
```
## Recommended permissions

When using the `reusable-workflows` in your GitHub Actions workflow, it is recommended to set the following permissions to ensure proper functionality:

```yaml
permissions:
  contents: read # access to read repository's content
  actions: read # access to reading actions 
```
## License

The scripts and documentation in this project are released under the [MIT License](LICENSE.txt)

## Contributing

Contributions are welcome! See [Contributor's Guide](CONTRIBUTING.md)

## Maintainers 

See [CODEOWNERS](./CODEOWNERS).

## Support

See [SUPPORT.md](./SUPPORT.md).
