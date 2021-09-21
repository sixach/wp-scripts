# Sixa WP Scripts

---

A small NPM module and CLI to prepare and bundle WordPress plugins into ZIP archives
for easy distribution and installation.

## Installation

```bash
npm i @sixach/wp-scripts --save-dev
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
If no `.bundleignore` is available, `@sixach/wp-scripts` automatically finds and
uses the `.npmignore` file. If no `.npmignore` file is present, `.gitignore` is used
instead.
If none of these files are present, no files are ignored.

### Configure NPM Scripts

Add the following NPM scripts to your `package.json`:
```JSON
{
  "scripts": {
    "prepare-bundle": "sixa-wp-scripts prepare-bundle",
    "bundle": "sixa-wp-scripts bundle NAME-OF-ARCHIVE"
  }
}
```

and replace `NAME-OF-ARCHIVE` with the name of your archive without 
the `.zip` extension.