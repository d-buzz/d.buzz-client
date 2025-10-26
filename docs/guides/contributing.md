# Contributing to D.Buzz Client

Thank you for your interest in contributing to D.Buzz! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

- Be respectful and inclusive
- Welcome newcomers
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Spam or off-topic content
- Sharing private information

## Getting Started

### 1. Fork the Repository

```bash
# Click "Fork" on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/d.buzz-client.git
cd d.buzz-client

# Add upstream remote
git remote add upstream https://github.com/d-buzz/d.buzz-client.git
```

### 2. Set Up Development Environment

```bash
# Install Node.js 18+
nvm install 18
nvm use 18

# Install dependencies
yarn install

# Create .env.development
cp .env.example .env.development

# Start development server
yarn start
```

### 3. Create a Branch

```bash
# Update your fork
git fetch upstream
git checkout dev
git merge upstream/dev

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

## Development Workflow

### Branch Strategy

```
main/mainnet    → Production (stable)
    ↑
testnet         → Staging environment
    ↑
dev             → Development branch
    ↑
feature/*       → Feature branches
fix/*           → Bug fix branches
```

### Workflow Steps

1. **Create Branch**: From `dev` branch
2. **Develop**: Make your changes
3. **Test**: Ensure all tests pass
4. **Commit**: Follow commit guidelines
5. **Push**: To your fork
6. **Pull Request**: To `dev` branch
7. **Code Review**: Address feedback
8. **Merge**: Maintainer merges

## Coding Standards

### JavaScript Style Guide

We follow **Airbnb JavaScript Style Guide** with some modifications:

```javascript
// ✅ Good
const MyComponent = ({ title, onSubmit }) => {
  const [value, setValue] = useState('')

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <div>
      <h1>{title}</h1>
      <input value={value} onChange={handleChange} />
    </div>
  )
}

// ❌ Bad
const MyComponent = (props) => {
  var value = useState('')[0]
  const setValue = useState('')[1]

  return <div>
    <h1>{props.title}</h1>
    <input value={value} onChange={(e)=>{setValue(e.target.value)}} />
  </div>
}
```

### ESLint Configuration

```javascript
// .eslintrc
{
  "extends": "react-app",
  "rules": {
    "semi": ["error", "never"],
    "comma-dangle": ["error", "never"],
    "quotes": ["error", "single"],
    "indent": ["error", 2],
    "no-multiple-empty-lines": ["error", { "max": 1 }]
  }
}
```

### Run Linter

```bash
# Check for errors
yarn lint

# Auto-fix issues
yarn lint --fix
```

### Naming Conventions

#### Components
```javascript
// PascalCase for components
const UserProfile = () => {}
const BuzzRenderer = () => {}
```

#### Functions
```javascript
// camelCase for functions
const handleSubmit = () => {}
const fetchUserData = async () => {}
```

#### Constants
```javascript
// UPPER_SNAKE_CASE for constants
const API_BASE_URL = 'https://api.example.com'
const MAX_BUZZ_LENGTH = 280
```

#### Files
```
Components:     PascalCase (UserProfile.js)
Utilities:      camelCase (helper.js)
Styles:         camelCase (styles.js)
Tests:          *.test.js or *.spec.js
```

### Component Structure

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createUseStyles } from 'react-jss'
import PropTypes from 'prop-types'

// 2. Styles
const useStyles = createUseStyles(theme => ({
  container: {
    padding: theme.spacing.unit * 2
  }
}))

// 3. Component
const MyComponent = ({ title, onSubmit }) => {
  // Hooks
  const classes = useStyles()
  const [value, setValue] = useState('')
  const dispatch = useDispatch()

  // Effects
  useEffect(() => {
    // Side effects
  }, [])

  // Handlers
  const handleSubmit = () => {
    onSubmit(value)
  }

  // Render
  return (
    <div className={classes.container}>
      <h1>{title}</h1>
    </div>
  )
}

// 4. PropTypes
MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

// 5. Export
export default MyComponent
```

## Commit Guidelines

### Semantic Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **test**: Adding/updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(auth): add MetaMask login support"

# Bug fix
git commit -m "fix(posts): resolve infinite scroll issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(api): simplify RPC node failover logic"

# With body
git commit -m "feat(wallet): add transaction history

- Implement transaction fetching
- Add pagination support
- Create transaction list component

Closes #123"
```

### Commit Best Practices

✅ **Do**:
- Write clear, concise commit messages
- Use present tense ("add feature" not "added feature")
- Reference issue numbers
- Keep commits atomic (one logical change)
- Commit working code

❌ **Don't**:
- Commit broken code
- Mix unrelated changes
- Use vague messages ("fix stuff", "updates")
- Commit sensitive data

## Pull Request Process

### Before Submitting

```bash
# Update from upstream
git fetch upstream
git rebase upstream/dev

# Run tests
yarn test

# Run linter
yarn lint

# Build successfully
yarn build:dev
```

### Creating a Pull Request

1. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature
   ```

2. **Open PR on GitHub**:
   - Base: `d-buzz/d.buzz-client:dev`
   - Compare: `your-fork:feature/your-feature`

3. **Fill Out Template**:
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tests pass locally
   - [ ] Linter passes
   - [ ] Manual testing completed

   ## Screenshots (if applicable)

   ## Related Issues
   Closes #123
   ```

### PR Title Format

```
type(scope): description

Examples:
feat(wallet): add transaction history view
fix(auth): resolve login redirect issue
docs(api): update API service documentation
```

### Review Process

1. **Automated Checks**: CircleCI runs tests and linter
2. **Code Review**: Maintainer reviews code
3. **Feedback**: Address comments and requested changes
4. **Approval**: Maintainer approves PR
5. **Merge**: Maintainer merges to `dev`

### Addressing Feedback

```bash
# Make changes based on feedback
# Commit changes
git add .
git commit -m "fix: address PR feedback"

# Push to same branch
git push origin feature/your-feature
```

## Testing

### Running Tests

```bash
# All tests
yarn test

# Watch mode
yarn test --watch

# Coverage
yarn test --coverage

# Specific file
yarn test MyComponent.test.js
```

### Writing Tests

#### Component Tests

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import MyComponent from './MyComponent'
import store from 'store'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(
      <Provider store={store}>
        <MyComponent title="Test" />
      </Provider>
    )

    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('handles user interaction', () => {
    const handleClick = jest.fn()

    render(<MyComponent onClick={handleClick} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalled()
  })
})
```

#### Saga Tests

```javascript
import { call, put } from 'redux-saga/effects'
import { fetchDataSaga } from './sagas'
import * as api from 'services/api'

describe('fetchDataSaga', () => {
  it('fetches data successfully', () => {
    const generator = fetchDataSaga()

    expect(generator.next().value).toEqual(
      call(api.fetchData)
    )

    expect(generator.next({ data: [] }).value).toEqual(
      put({ type: 'FETCH_DATA_SUCCESS', payload: { data: [] } })
    )
  })
})
```

### Test Coverage

Aim for **80%+ code coverage** for new features.

```bash
yarn test --coverage

# View coverage report
open coverage/lcov-report/index.html
```

## Documentation

### Code Documentation

```javascript
/**
 * Renders a buzz with content, media, and actions
 *
 * @param {string} content - The buzz text content
 * @param {string} author - Author username
 * @param {object} metadata - JSON metadata with tags, images
 * @param {boolean} preview - Show preview mode (default: false)
 *
 * @example
 * <BuzzRenderer
 *   content="Hello world"
 *   author="alice"
 *   metadata={{ tags: ['test'] }}
 * />
 */
const BuzzRenderer = ({ content, author, metadata, preview = false }) => {
  // Implementation
}
```

### Updating Documentation

When adding features, update:
- **README.md**: Project overview
- **docs/**: Relevant documentation files
- **Component docs**: JSDoc comments
- **API docs**: Function documentation

## Issue Reporting

### Bug Reports

Include:
- **Description**: Clear description
- **Steps to Reproduce**: Detailed steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, Node version
- **Screenshots**: If applicable

### Feature Requests

Include:
- **Description**: Clear feature description
- **Use Case**: Why it's needed
- **Proposed Solution**: How it could work
- **Alternatives**: Other approaches considered

## Community

### Getting Help

- **GitHub Issues**: Bug reports and features
- **Discussions**: Questions and ideas
- **D.Buzz**: Join the community on Hive

### Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in commits

## License

By contributing, you agree that your contributions will be licensed under the Unlicense (public domain).

---

Thank you for contributing to D.Buzz! 🐝
