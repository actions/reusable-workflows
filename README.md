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

- [`dependabot-rebuild-dist.yml`](./.github/workflows/dependabot-rebuild-dist.yml)

This opt-in workflow rebuilds generated files for an eligible Dependabot pull request and commits only the configured generated directory back to the PR branch. The unprivileged build job has no publishing PAT. A separate publishing job validates the artifact paths and file types, then stages only the generated directory, including additions and deletions. If the generated output is unchanged, it makes no commit. The existing `check-dist.yml` remains read-only and should still be used for independent validation.

**Caller setup**

Configure a fine-grained PAT as a **Dependabot secret** named `DEPENDABOT_BUILD_TOKEN` in the caller repository (or an organization Dependabot secret available to it). Grant it Contents read and write access to that repository. Dependabot-triggered workflows do not necessarily receive regular Actions secrets. The reusable workflow requires its `token` secret, supplied by the caller as shown below; an empty or unavailable PAT fails clearly in the publishing job before it checks the PR or attempts a push. The PAT is not passed to validation or build jobs; do not use `secrets: inherit`.

Call it from a trusted caller workflow, restricted to Dependabot PRs from the same repository. Pin the reusable workflow to a reviewed full commit SHA when using it in production:

```yaml
name: Rebuild Dependabot dist

on:
  pull_request:
    types: [opened, reopened, synchronize]
    paths:
      - 'package.json'
      - 'package-lock.json'

permissions:
  contents: read
  pull-requests: read

concurrency:
  group: dependabot-rebuild-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  rebuild:
    if: >-
      github.actor == 'dependabot[bot]' &&
      github.event.pull_request.user.login == 'dependabot[bot]' &&
      github.event.pull_request.head.repo.full_name == github.repository
    uses: actions/reusable-workflows/.github/workflows/dependabot-rebuild-dist.yml@<reviewed-commit-sha>
    with:
      node-version: '24.x'
      dist-path: 'dist'
      # Optional overrides; these commands run only in the unprivileged build job.
      install-command: 'npm ci --ignore-scripts'
      build-command: 'npm run build'
    secrets:
      token: ${{ secrets.DEPENDABOT_BUILD_TOKEN }}
```

The example uses the `pull_request` trigger and npm manifest path filters; adjust those paths for your project. Defaults are `install-command: npm ci --ignore-scripts`, `build-command: npm run build`, `node-version: 24.x`, and `dist-path: dist`. `dist-path` must be a safe repository-relative path outside Git metadata; absolute paths, traversal components, and symbolic links in the generated output are rejected. Use `install-command` and `build-command` to override the commands independently. Both commands must be trusted caller configuration, never values taken from PR titles, comments, branch names, or other event-controlled data. The workflow only sets up Node.js; callers using pnpm, Yarn, or another package manager must ensure it is available in the build job (for example, by enabling or installing it in `install-command`).

The workflow checks that the PR still has the built head SHA before publishing and never force-pushes or retries generated output against a newer head. It creates a separate commit and uses a normal Git push; if Git rejects a non-fast-forward push because the branch advanced, the workflow reports the failure and requires a fresh run. The head can still advance between the final GitHub API check and the push, so these checks do not make publication atomic or eliminate every race.

**Dependabot updates and PR checks**

The generated commit message includes `[dependabot skip]` to allow Dependabot to rebase and force-push over the generated commit, as described in [GitHub's documentation](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/manage-your-dependency-security/manage-dependabot-prs#allowing-dependabot-to-rebase-and-force-push-over-extra-commits). Rebase scheduling is managed by Dependabot and the caller repository's Dependabot configuration, not by this workflow. A Dependabot refresh can replace the generated commit; the caller must handle `synchronize` events so generated output is rebuilt for the refreshed PR head.

The PAT push is intended to trigger the caller repository's normal PR checks; confirm those checks run under your repository's branch protection and workflow trigger configuration. The caller's actor condition prevents the PAT-generated update from starting another rebuild.

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
