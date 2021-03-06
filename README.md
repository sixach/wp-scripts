# Sixa WP Scripts

---

A small NPM module and CLI to prepare and bundle WordPress plugins into ZIP archives
for easy distribution and installation.

## Installation

```bash
npm i @sixa/wp-scripts --save-dev
```

## Usage

### Configure `.bundleignore`

Create and configure a `.bundleignore` in your project file to exclude files and 
directories from being packaged into the ZIP archive. Conceptually, `.bundleignore`
is very similar to `.gitignore` and `.npmignore` and - essentially - works the same.

#### Example `.bundleignore`
```text
.bundleignore
.git
.DS_Store
.editorconfig
.gitattributes
.gitignore
.husky
.idea
.prettierrc.js
.stylelintignore
.stylelintrc.js
composer.json
composer.lock
docs
node_modules
package.json
package-lock.json
phpcs.xml.dist
renovate.json
/src
*.zip
```

#### Typical Entries

##### Simple File Name or Path

Example:
```text
.idea
```

Use a simple file name or path to exclude a specific file or directory
**in the project root and any subdirectory**.

##### Wildcard + Extension

Example:
```text
*.zip
```

Use a wildcard + extension to exclude any type of file **in the project root and
any subdirectory**.

##### Root Folder

Example:
```text
/src
```
Use a root file name or path to exclude any specific file or directory
**only from the project root**.
For instance, `/src` matches `./src` but not `./vendor/company/package/src`.

#### Notice
If no `.bundleignore` is available, `@sixa/wp-scripts` automatically finds and
uses the `.npmignore` file. If no `.npmignore` file is present, `.gitignore` is used
instead.
If none of these files are present, no files are ignored.

### Configure NPM Scripts

Add the following NPM script to your `package.json`:
```JSON
{
  "scripts": {
    "bundle": "sixa-wp-scripts bundle NAME-OF-ARCHIVE"
  }
}
```

and replace `NAME-OF-ARCHIVE` with the name of your archive without 
the `.zip` extension.

Running `sixa-wp-scripts bundle NAME-OF-ARCHIVE` traverses the package directory
and creates a file `NAME-OF-ARCHIVE.zip` including every file in the package
directory without the files and directories in `.bundleignore`.

#### Preparation

Unless ignored via `.bundleignore`, `sixa-wp-scripts bundle` copies the directories
`node_modules` and `vendor` into the archive. In many cases, this is the desired
behaviour. However, in most cases, your local development environment will include
development and peer dependencies that you do not intend to distribute in the
plugin archive.

Thus, it is crucial that the bundling is *prepared*. Preparing the bundling process
means that we eliminate all non-production dependencies from library directories.
This can easily be achieved by adding an NPM script to `package.json` that performs
the necessary steps.

The following `prepare-bundle` script can be used as the default script for blocks
and extensions:

```JSON
{
  "scripts": {
    "prepare-bundle": "npm i && npm run build && composer install --no-dev --optimize-autoloader"
  }
}
```

This `prepare-bundle` script performs the following operations:
1) Install NPM dependencies (just in case we haven't yet)
2) Build all assets
3) Reinstall composer with only production dependencies and optimize the autoloader

For blocks and extensions, rather than deleting `node_modules` after `npm run build`,
we ignore `node_modules` in `.bundleignore`.
Luckily, `composer install --no-dev` already removes all non-production dependencies
from `vendor` and we do not need to clean up after `composer`.
The flag `--optimize-autoloader` converts PSR-4 and PSR-0 rules into classmap rules,
which is faster (but inconvenient during development).
