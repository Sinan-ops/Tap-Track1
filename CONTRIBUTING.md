# Contributing to Tap-Track

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/tap-track.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Follow the development setup in [INSTALLATION.md](./INSTALLATION.md)

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/description
   ```

2. **Make your changes**
   - Write clear, descriptive commit messages
   - Keep commits focused on single features
   - Test your changes locally

3. **Push to your fork**
   ```bash
   git push origin feature/description
   ```

4. **Create a Pull Request**
   - Provide clear description of changes
   - Link to relevant issues if any
   - Ensure tests pass

## Code Style Guidelines

### JavaScript/React
- Use ES6+ syntax
- Follow camelCase for variables/functions
- Use PascalCase for React components
- Keep functions small and focused
- Add comments for complex logic
- Use 2-space indentation

### Example Component Structure
```javascript
import React from 'react';
import '../styles/Component.css';

function MyComponent() {
  // State and hooks
  const [state, setState] = React.useState(null);

  // Effects
  React.useEffect(() => {
    // Effect logic
  }, []);

  // Handlers
  const handleClick = () => {
    // Handler logic
  };

  // Render
  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
}

export default MyComponent;
```

### CSS
- Use semantic class names
- Organize by component
- Use CSS variables for colors
- Keep styles modular

```css
/* Component.css */
.component {
  padding: 20px;
  background-color: var(--bg-color);
}

.component-header {
  font-size: 18px;
  font-weight: bold;
}
```

### Backend (Express)
- Route handlers in routes/
- Business logic in controllers/
- Database queries in routes/
- Middleware for cross-cutting concerns
- Error handling in middleware

```javascript
// routes/example.js
import express from 'express';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    // Logic here
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
```

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, etc.

### Examples
```
feat(auth): add JWT token refresh endpoint
fix(attendance): correct check-out time calculation
docs(api): update authentication section
```

## Testing

### Before Submitting PR
1. Test locally: `npm run dev`
2. Verify API endpoints: See [API_TESTING.md](./API_TESTING.md)
3. Check console for errors
4. Test with different data scenarios

### API Testing
```bash
# Test endpoints using provided examples
curl -X GET http://localhost:5000/api/health
```

## Documentation

- Update [README.md](./README.md) for major changes
- Update [API_TESTING.md](./API_TESTING.md) for API changes
- Add comments for complex logic
- Keep [DEVELOPMENT.md](./DEVELOPMENT.md) updated

## Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] Changes have been tested locally
- [ ] Commit messages are descriptive
- [ ] No console errors or warnings
- [ ] Related issues are linked
- [ ] Tests pass (if applicable)

## Reporting Issues

1. Check existing issues first
2. Provide detailed description
3. Include steps to reproduce
4. Attach error logs/screenshots
5. Specify environment (OS, Node version, etc.)

## Feature Requests

1. Describe the feature clearly
2. Explain the use case
3. Suggest implementation (optional)
4. Link to related issues if any

## Questions or Need Help?

- Review [DEVELOPMENT.md](./DEVELOPMENT.md)
- Check [API_TESTING.md](./API_TESTING.md)
- Look at existing code for patterns
- Create a discussion issue

## Code Review Process

1. All PRs require at least one approval
2. Tests must pass
3. Code style must be consistent
4. Documentation must be updated
5. No merge conflicts

## Release Process

1. Update version in package.json
2. Update CHANGELOG
3. Create release tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [JavaScript ES6 Guide](https://developers.google.com/web/shows/ttt/series-1/es2015)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)

---

Thank you for contributing to Tap-Track! 🎉
