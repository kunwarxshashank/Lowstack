# Contributing to Lowstack

First off, thank you for considering contributing to Lowstack! It's people like you that make the educational community great.

## 🌈 Code of Conduct

By participating in this project, you agree to abide by the terms of our Code of Conduct (be kind, respectful, and collaborative).

## 🚀 How Can I Contribute?

### Reporting Bugs
- Use the [GitHub Issues](https://github.com/kunwarxshashank/Lowstack/issues) to report bugs.
- Include a clear title and description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements
- Open a [GitHub Issue](https://github.com/kunwarxshashank/Lowstack/issues) with the tag `enhancement`.
- Describe the feature and why it would be useful.

### Pull Requests
1. **Fork** the repository and create your branch from `main`.
2. **Setup your environment** (see [Installation](README.md#installation)).
3. **Write code** following the project's coding style.
4. **Test your changes** locally.
5. **Lint and Type-check** your code:
   ```bash
   npm run lint
   npm run type-check
   ```
6. **Commit** your changes with a descriptive message.
7. **Push** to your fork and submit a **Pull Request**.

## 🛠️ Development Workflow

### Branching Strategy
- `main`: Production-ready code.
- `feature/*`: New features or enhancements.
- `fix/*`: Bug fixes.

### Coding Standards
- We use **ESLint** for linting.
- Follow **React best practices** (functional components, hooks).
- Use **Tailwind CSS** for styling; avoid inline styles.
- Ensure all new components are properly typed with **TypeScript/JSDoc** where applicable.

### Database Changes
- If you make changes to the `prisma/schema.prisma` file, ensure you run `npx prisma generate` and provide a migration plan if applicable.

## 💬 Getting in Touch
If you have questions or need help, feel free to open a discussion or reach out to the project maintainers.

Happy coding! 🚀
