# Contributing to SURVIV-OS

Thank you for your interest in contributing to SURVIV-OS! This document provides guidelines and instructions for contributing to the project.

## 🚀 Getting Started

### Setting Up Your Development Environment

1. **Fork the Repository**
   - Click the "Fork" button at the top right of the repository page
   - This creates your own copy of the repository

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/post-apoc-learn.git
   cd post-apoc-learn
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/kingpinzs/post-apoc-learn.git
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Start Development Server**
   ```bash
   npm start
   ```

## 🔄 Development Workflow

### Creating a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### Making Changes

1. **Write Clean Code**
   - Follow existing code style and conventions
   - Use meaningful variable and function names
   - Add comments for complex logic
   - Keep functions small and focused

2. **Test Your Changes**
   ```bash
   # Run unit tests
   npm test
   
   # Run tests with coverage
   npm run coverage
   
   # Run end-to-end tests
   npm run e2e
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Brief description of your changes"
   ```

   Commit message guidelines:
   - Use present tense ("Add feature" not "Added feature")
   - Use imperative mood ("Move cursor to..." not "Moves cursor to...")
   - First line should be 50 characters or less
   - Include detailed description in the body if needed

### Submitting a Pull Request

1. **Update Your Branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template with:
     - Description of changes
     - Related issue numbers
     - Screenshots (if UI changes)
     - Testing done

4. **Address Review Comments**
   - Respond to feedback promptly
   - Make requested changes
   - Push updates to the same branch

## 📝 Code Style Guidelines

### React Components

- Use functional components with hooks
- Follow the existing component structure
- Use PropTypes for type checking
- Keep components focused and reusable

Example:
```jsx
import React from 'react';
import PropTypes from 'prop-types';

const MyComponent = ({ title, onAction }) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
};

export default MyComponent;
```

### Styling

- Use Tailwind CSS utility classes
- Follow the existing class naming patterns
- Keep responsive design in mind
- Test on mobile devices

### Testing

- Write tests for new features
- Maintain or improve code coverage
- Use descriptive test names
- Follow existing test patterns

Example:
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders with title', () => {
    render(<MyComponent title="Test" onAction={() => {}} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('calls onAction when button clicked', () => {
    const mockAction = jest.fn();
    render(<MyComponent title="Test" onAction={mockAction} />);
    
    fireEvent.click(screen.getByText('Action'));
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
});
```

## 🎮 Contributing to Game Content

### Adding New Apps/Tools

1. Create component in `src/components/apps/`
2. Add icon and metadata
3. Update app registry
4. Write tests
5. Add to documentation

### Adding Challenges

1. Define challenge data in `src/data/`
2. Create UI components if needed
3. Implement reward logic
4. Test thoroughly
5. Update documentation

### Adding Threats

1. Define threat behavior
2. Create visual components
3. Implement detection logic
4. Add defense mechanisms
5. Test edge cases

## 🐛 Reporting Bugs

### Before Submitting

- Check if the bug has already been reported
- Try to reproduce the bug
- Gather relevant information

### Bug Report Should Include

- Clear title and description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/recordings (if applicable)
- Browser/OS information
- Console errors (if any)

### Creating an Issue

Go to [Issues](https://github.com/kingpinzs/post-apoc-learn/issues) and click "New Issue"

## 💡 Suggesting Features

We welcome feature suggestions! Please:

1. Check if the feature has been suggested
2. Describe the feature clearly
3. Explain the use case
4. Consider implementation complexity
5. Be open to discussion

## 📚 Documentation

### README Updates

- Keep information accurate
- Use clear language
- Include code examples
- Update table of contents

### Code Comments

- Explain why, not what
- Document complex algorithms
- Add JSDoc comments for functions
- Keep comments up to date

## ✅ Review Process

### What We Look For

- Code quality and style
- Test coverage
- Performance impact
- Documentation updates
- Breaking changes

### Timeline

- Initial review: Within 1 week
- Follow-up reviews: Within 3 days
- Merge: After approval and passing CI

## 🤝 Community Guidelines

### Be Respectful

- Use welcoming language
- Respect different viewpoints
- Accept constructive criticism
- Focus on what's best for the project

### Be Collaborative

- Help others learn
- Share knowledge
- Review others' PRs
- Participate in discussions

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

- Open a [Discussion](https://github.com/kingpinzs/post-apoc-learn/discussions)
- Join our [Discord](https://discord.gg/survivos) (if available)
- Ask in your Pull Request

---

Thank you for contributing to SURVIV-OS! Your efforts help make cybersecurity education more accessible and engaging.
