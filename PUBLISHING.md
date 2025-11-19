# Publishing Guide

This guide describes how to publish the `resend-editor` package to npm.

## Prerequisites

1.  **npm Account**: You need an account on [npm](https://www.npmjs.com/).
2.  **Login**: Ensure you are logged in to npm in your terminal:
    ```bash
    npm login
    ```

## Publishing Steps

1.  **Commit Changes**: Ensure all your changes are committed and your working directory is clean.

2.  **Update Version**: Run one of the following commands to update the version number in `package.json` and create a git tag:
    ```bash
    # For bug fixes (0.0.1 -> 0.0.2)
    npm version patch

    # For backward-compatible new features (0.0.1 -> 0.1.0)
    npm version minor

    # For breaking changes (0.0.1 -> 1.0.0)
    npm version major
    ```

3.  **Publish**: Run the publish command. This will automatically run the `build` script (via `prepublishOnly`) to ensure the `dist` folder is up-to-date.
    ```bash
    npm publish
    ```
    
    *Note: If this is the first time you are publishing a scoped package (e.g. `@your-username/resend-editor`), you might need to add `--access public`.*

4.  **Push Tags**: Push the new version commit and tag to GitHub:
    ```bash
    git push && git push --tags
    ```

## Testing Locally

Before publishing, you can test the package locally in another project:

1.  **Link**: inside `resend-editor` directory:
    ```bash
    npm link
    ```
2.  **Use Link**: inside your consumer app directory:
    ```bash
    npm link resend-editor
    ```

Alternatively, you can pack it into a tarball to verify the contents:
```bash
npm pack
```
This will create a `.tgz` file that you can inspect or install in another project.
