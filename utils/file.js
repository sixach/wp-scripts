/**
 * Internal dependencies.
 */
const { SCRIPTS_DIR } = require( './constants' );

/**
 * Built-in Node library to interact with the file system.
 *
 * @see    https://nodejs.org/api/fs.html
 */
const { existsSync, readdirSync, statSync } = require( 'fs' );

/**
 * Built-in Node library containing utilities for working with file
 * and directory paths.
 *
 * @see    https://nodejs.org/api/path.html
 */
const path = require( 'path' );

/**
 * Node library to convert glob expressions into JavaScript `RegExp` objects.
 *
 * @see    https://github.com/isaacs/minimatch
 */
const minimatch = require( 'minimatch' );

/**
 * Return true if the given file or folder exists. Return false otherwise.
 *
 * This function is used as a wrapper around `existsSync` from `fs` so that
 * other modules that import this file need not import `fs` additionally.
 *
 * @function
 * @since      1.0.0
 * @param {string} fileOrFolder Path to a file or a folder.
 * @return    {boolean}                    If the file or folder exists.
 * @example
 *
 * pathExists( 'src' );
 *
 * // => boolean true
 */
const pathExists = ( fileOrFolder ) => existsSync( fileOrFolder );

/**
 * Return true if the given path resolves relative to the package root and false otherwise.
 * Path may be a file or a directory. Path must be relative to the package root.
 *
 * @function
 * @since     1.0.0
 * @param {string} fileOrFolder Relative path to a file or directory.
 * @return    {boolean}                    True if the path exists, false otherwise.
 * @example
 *
 * existsInProject( 'package.json' );
 *
 * // => boolean true
 */
const existsInProject = ( fileOrFolder ) => pathExists( getProjectPath( fileOrFolder ) );

/**
 * Return the absolute path built from the current working directory
 * for a given relative path.
 *
 * @function
 * @since     1.0.0
 * @param {string} fileOrFolder Relative path to a file or directory.
 * @return    {string}                    Absolute path including package directory.
 * @example
 *
 * getProjectPath( 'composer.json' );
 *
 * // => string '/Users/name/wp-blocks/wp-block-some/composer.json'
 */
const getProjectPath = ( fileOrFolder ) => path.join( process.cwd(), fileOrFolder );

/**
 * Return the path to the `scripts` directory of this NPM package.
 *
 * @function
 * @since     1.0.0
 * @return    {string}    Path to `scripts` directory.
 * @example
 *
 * getScriptsDirPath();
 *
 * // => string 'Users/name/wp-blocks/wp-block-some/node_modules/@sixach/sixa-wp-scripts/scripts'
 */
const getScriptsDirPath = () => {
	return path.join( path.dirname( __dirname ), SCRIPTS_DIR );
};

/**
 * Return a list of all files in the given directory.
 * This function is recursive and traverses subdirectories.
 *
 * @function
 * @since     1.0.0
 * @param {string} directoryPath Path to traverse.
 * @param {Array}  ignoredFiles  Files to ignore during traversal.
 * @param {Array}  foundFiles    All files found so far (for recursion).
 * @return    {Array}                      All files in and below the given path.
 */
const getAllFilesInDirectory = ( directoryPath, ignoredFiles = [], foundFiles = [] ) => {
	const files = readdirSync( directoryPath );
	outer: for ( let i = 0; i < files.length; i++ ) {
		const fileName = files[ i ];
		const filePath = path.join( directoryPath, fileName );

		// Skip this iteration if the file or directory name is included in the
		// list of ignored files.
		for ( let j = 0; j < ignoredFiles.length; j++ ) {
			const currentIgnoredFile = ignoredFiles[ j ];

			// Enable `/dir` matches to only target directories in the base
			// of the project (akin to .gitignore).
			if ( currentIgnoredFile.startsWith( '/' ) ) {
				if ( filePath.startsWith( currentIgnoredFile.substr( 1 ) ) ) {
					continue outer;
				}
			} else if ( minimatch( fileName, currentIgnoredFile ) ) {
				// Skip this iteration if the file should be ignored.
				continue outer;
			}
		}

		if ( statSync( filePath ).isDirectory() ) {
			foundFiles = getAllFilesInDirectory( filePath, ignoredFiles, foundFiles );
		} else {
			foundFiles.push( filePath );
		}
	}
	return foundFiles;
};

/**
 * Build and return the path to the script with the given name.
 *
 * @function
 * @since     1.0.0
 * @param {string} name Name of the script file.
 * @return    {string}            Absolute path to the script file in this package.
 * @example
 *
 * getScriptPath( 'bundle' );
 *
 * // => string 'Users/name/wp-blocks/wp-block-some/node_modules/@sixach/sixa-wp-scripts/scripts/bundle.js'
 */
const getScriptPath = ( name ) => {
	return path.join( getScriptsDirPath(), `${ name }.js` );
};

/**
 * Return a human readable format of the given size in bytes.
 *
 * @function
 * @since       1.0.0
 * @param {number} sizeInBytes Integer value.
 * @return      {string}                   Human readable file size.
 * @example
 *
 * getHumanReadableSize( 1126 );
 *
 * // => string '1.1kB'
 */
const getHumanReadableSize = ( sizeInBytes ) => {
	if ( sizeInBytes >= 1048576 ) {
		return `${ Math.round( ( sizeInBytes / 1024 / 1024 ) * 10 ) / 10 }MB`;
	}
	if ( sizeInBytes >= 1024 ) {
		return `${ Math.round( ( sizeInBytes / 1024 ) * 10 ) / 10 }KB`;
	}
	return `${ sizeInBytes }B`;
};

module.exports = {
	pathExists,
	existsInProject,
	getProjectPath,
	getScriptsDirPath,
	getScriptPath,
	getHumanReadableSize,
	getAllFilesInDirectory,
};
