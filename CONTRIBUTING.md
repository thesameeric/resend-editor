# Contributing to Resend Editor

Thank you for your interest in contributing to `resend-editor`! We welcome contributions from the community to help make this email editor even better.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/resend-editor.git
    cd resend-editor
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```

## Project Structure

-   `src/`: Source code for the editor components.
    -   `src/ui/`: Reusable UI components (buttons, inputs, etc.).
    -   `src/lib/`: Utility functions.
    -   `src/EmailEditor.tsx`: Main entry point component.
-   `dist/`: Output directory for the built package.

## Development Workflow

1.  **Create a new branch** for your feature or bugfix:
    ```bash
    git checkout -b feature/my-awesome-feature
    ```
2.  **Run the development build** in watch mode:
    ```bash
    npm run dev
    ```
    This uses `tsup` to watch for changes and rebuild the package.

3.  **Linting**:
    Ensure your code follows the project's style guidelines:
    ```bash
    npm run lint
    ```

## Building

To build the package for production:

```bash
npm run build
```

This command generates the CommonJS (`dist/index.js`), ESM (`dist/index.mjs`), and Type definitions (`dist/index.d.ts`).

## Pull Request Process

1.  Ensure your code builds successfully (`npm run build`) and passes linting (`npm run lint`).
2.  Commit your changes with clear, descriptive commit messages.
3.  Push your branch to your fork.
4.  Open a Pull Request against the `main` branch of the original repository.
5.  Provide a detailed description of your changes and the problem they solve.

## Code Style

-   We use **TypeScript** for type safety. Please ensure all new code is typed.
-   We use **Tailwind CSS** (via utility classes) for styling within the components.
-   We use **Radix UI** primitives for accessible interactive components.

## Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub. Provide as much detail as possible, including steps to reproduce the issue.

Thank you for contributing!
