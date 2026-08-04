# AI-Assisted Development Approach

I use AI development tools to improve speed and learning without replacing engineering judgement.

## How I use AI tools

- Break larger requirements into smaller implementation tasks
- Compare possible solution designs before choosing an approach
- Investigate error messages and generate debugging hypotheses
- Draft test cases, edge cases and documentation outlines
- Review repetitive code for clarity and consistency
- Learn unfamiliar frameworks and APIs through focused examples

## Verification process

AI-generated suggestions are treated as untrusted drafts. Before keeping a change, I:

1. Read the code and make sure I can explain the logic.
2. Check the suggestion against the project requirements.
3. Run automated tests and add tests for important edge cases.
4. Perform manual checks for user-facing workflows and failure states.
5. Simplify or rewrite code that is difficult to maintain.
6. Document assumptions and known limitations.

## Development principles

- Prefer small, reviewable changes over large unexplained rewrites.
- Keep business rules separate from interfaces and infrastructure where practical.
- Use version control and meaningful commits to preserve a clear development history.
- Raise uncertainty early rather than hiding a blocker.
- Use AI to accelerate understanding, not to claim knowledge I do not have.

## Tools and practices demonstrated in this repository

- ChatGPT-assisted problem decomposition, debugging and documentation
- Python, JavaScript, React, Node.js, Express and SQL/MySQL
- REST APIs, authentication, validation and role-based workflows
- pytest, Jest and GitHub Actions
- Git/GitHub workflows and Agile-style task breakdown
- Reproducible setup instructions and project-specific README files
