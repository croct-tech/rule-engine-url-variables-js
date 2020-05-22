<p align="center">
    <a href="https://croct.com">
        <img src="https://cdn.croct.io/brand/logo/repo-icon-green.svg" alt="Croct" height="80"/>
    </a>
    <br />
    <strong>URL Variables Extension</strong>
    <br />
    A <a href="https://github.com/croct-tech/plug-rule-engine-js">Rule Engine</a> extension for passing variables through the URL.
</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@croct/rule-url-variables"><img alt="Version" src="https://img.shields.io/npm/v/@croct/rule-url-variables" /></a>
    <a href="https://github.com/croct-tech/rule-url-variables-js/actions?query=workflow%3AValidations"><img alt="Build" src="https://github.com/croct-tech/rule-url-variables-js/workflows/Validations/badge.svg" /></a>
    <a href="https://codeclimate.com/repos/5ec7c9285bf7ef01620091ed/maintainability"><img alt="Maintainability" src="https://api.codeclimate.com/v1/badges/64335c5cbe443d763dfa/maintainability" /></a>
    <a href="https://codeclimate.com/repos/5ec7c9285bf7ef01620091ed/test_coverage"><img alt="Coverage" src="https://api.codeclimate.com/v1/badges/64335c5cbe443d763dfa/test_coverage" /></a>
    <br />
    <br />
    <a href="https://github.com/croct-tech/rule-url-variables-js/releases">📦Releases</a>
    ·
    <a href="https://github.com/croct-tech/rule-url-variables-js/issues/new?labels=bug&template=bug-report.md">🐞Report Bug</a>
    ·
    <a href="https://github.com/croct-tech/rule-url-variables-js/issues/new?labels=enhancement&template=feature-request.md">✨Request Feature</a>
</p>

## Installation

The recommended way to install this plugin is using NPM. It pairs nicely with module bundlers such as Rollup, Webpack or Browserify and includes Typescript typings.

Run the following command to install the latest version:

```sh
npm install @croct/rule-url-variables
```

## Basic usage

```typescript
import croct from '@croct/plug';
import '@croct/rule-engine';
import '@croct/rule-url-variables';

croct.plug({
    appId: '<APP_ID>',
    plugins: {
        rules: {
            extensions: {
                urlVariables: {
                    prefix: 'ct-',
                },
            },
            pages: {
                // (omitted for conciseness)
            }
        },
    },
});
```

## Contributing
Contributions to the package are always welcome! 

- Report any bugs or issues on the [issue tracker](https://github.com/croct-tech/rule-url-variables-js/issues).
- For major changes, please [open an issue](https://github.com/croct-tech/rule-url-variables-js/issues) first to discuss what you would like to change.
- Please make sure to update tests as appropriate.

## Testing

Before running the test suites, the development dependencies must be installed:

```sh
npm install
```

Then, to run all tests:

```sh
npm run test
```

Run the following command to check the code against the style guide:

```sh
npm run lint
```

## Building

Before building the project, the dependencies must be installed:

```sh
npm install
```

Then, to build the CommonJS module:

```sh
npm run build
```

## Copyright Notice

This project is released under the [MIT License](LICENSE).
