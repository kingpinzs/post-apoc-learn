# Using SURVIV-OS as a Template

This guide explains how to use the SURVIV-OS project as a template to create your own cybersecurity training game or similar interactive learning application.

## 🎯 What This Template Provides

### Pre-configured Tech Stack
- **React 18** - Modern component-based framework
- **Tailwind CSS** - Utility-first styling system
- **Jest** - Unit testing framework
- **Cypress** - End-to-end testing
- **React Scripts** - Build tooling and development server

### Game Architecture
- **Component-based UI** - Modular and reusable components
- **State management** - React hooks for game state
- **Event system** - Real-time threat generation
- **Save system** - LocalStorage persistence
- **Mobile-first design** - Touch-optimized interactions

### Testing Infrastructure
- Unit test examples with React Testing Library
- E2E test configuration with Cypress
- Code coverage reporting
- Test utilities and helpers

## 🚀 Creating a New Repository from This Template

### Option 1: Using GitHub's Template Feature

1. **Navigate to the Repository**
   - Go to https://github.com/kingpinzs/post-apoc-learn

2. **Use as Template**
   - Click the "Use this template" button (if available)
   - Choose "Create a new repository"
   - Enter your repository name and description
   - Choose public or private visibility
   - Click "Create repository from template"

3. **Clone Your New Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/your-new-repo.git
   cd your-new-repo
   ```

### Option 2: Manual Fork and Customize

1. **Fork the Repository**
   ```bash
   # Clone the original repository
   git clone https://github.com/kingpinzs/post-apoc-learn.git my-new-game
   cd my-new-game
   
   # Remove original git history (optional)
   rm -rf .git
   git init
   
   # Create your own repository on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/your-new-repo.git
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Verify Setup**
   ```bash
   npm start
   ```

## 🔧 Customizing Your Repository

### 1. Update Project Metadata

Edit `package.json`:
```json
{
  "name": "your-game-name",
  "version": "1.0.0",
  "homepage": "https://YOUR_USERNAME.github.io/your-repo-name",
  "description": "Your game description"
}
```

### 2. Update Documentation

**README.md**
- Replace SURVIV-OS branding with your project name
- Update game description and features
- Modify installation instructions
- Update links and credits
- Add your screenshots

**CONTRIBUTING.md**
- Update repository URLs
- Customize contribution guidelines
- Modify code style preferences

### 3. Customize the Application

**Update Branding**
```bash
# Replace in all files:
# - SURVIV-OS → Your Game Name
# - Post-Apocalyptic → Your Theme
# - kingpinzs → Your Username
```

**Update Metadata Files**
- `public/index.html` - Page title and meta tags
- `public/manifest.json` - App name and theme
- `public/favicon.ico` - Your favicon

### 4. Modify Game Content

**Replace Game Data**
- `src/data/` - Challenge data, threats, apps
- Update theme and storyline
- Modify UI text and messages
- Change visual assets

**Customize Components**
- `src/components/` - Modify existing components
- `src/components/apps/` - Replace or add new apps
- `src/components/ui/` - Customize UI components

**Update Styling**
- `tailwind.config.js` - Theme colors and fonts
- `src/index.css` - Global styles
- Component-level Tailwind classes

### 5. Configure Testing

**Update Test Names**
```bash
# In all test files, update:
# - App names
# - Component names
# - Expected text/behavior
```

**Add New Tests**
```bash
# Follow existing patterns in:
src/__tests__/
src/components/__tests__/
```

### 6. Update GitHub Actions (if present)

```yaml
# .github/workflows/
# Update:
# - Repository references
# - Deploy URLs
# - Notification settings
```

## 📦 Essential Files to Customize

| File | Purpose | Priority |
|------|---------|----------|
| `package.json` | Project metadata | **High** |
| `README.md` | Documentation | **High** |
| `public/index.html` | Page title, meta | **High** |
| `public/manifest.json` | PWA config | **High** |
| `src/App.jsx` | Main component | **High** |
| `src/data/` | Game content | **High** |
| `tailwind.config.js` | Theme config | Medium |
| `CONTRIBUTING.md` | Contributor guide | Medium |
| `.github/workflows/` | CI/CD config | Medium |
| Test files | Update assertions | Low |

## 🎨 Theming Your Game

### Color Scheme

Edit `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'game-primary': '#your-color',
        'game-secondary': '#your-color',
        'game-accent': '#your-color',
        // Add your custom colors
      }
    }
  }
}
```

### Typography

```javascript
// tailwind.config.js
theme: {
  extend: {
    fontFamily: {
      'game': ['Your Font', 'fallback'],
    }
  }
}
```

### Visual Style

- Update component classes in `src/components/`
- Modify animations and transitions
- Change layout and spacing
- Update iconography (lucide-react icons)

## 🔄 Migration Checklist

- [ ] Clone/fork repository
- [ ] Install dependencies (`npm install`)
- [ ] Update `package.json` metadata
- [ ] Replace README.md content
- [ ] Update page title in `public/index.html`
- [ ] Replace favicon and images
- [ ] Customize app manifest
- [ ] Update game data in `src/data/`
- [ ] Modify main App component
- [ ] Update styling and theme
- [ ] Replace game text and messages
- [ ] Update test assertions
- [ ] Configure GitHub Pages/deployment
- [ ] Test build (`npm run build`)
- [ ] Run test suite (`npm test`)
- [ ] Update GitHub repository settings
- [ ] Add your own LICENSE
- [ ] Update CONTRIBUTING.md

## 🚢 Deployment Options

### GitHub Pages

Already configured! Just:
```bash
npm run deploy
```

Then enable GitHub Pages in repository settings.

### Netlify

1. Connect your repository
2. Build command: `npm run build`
3. Publish directory: `build`

### Vercel

1. Import your repository
2. Framework preset: Create React App
3. Deploy

### Custom Server

```bash
npm run build
# Serve the 'build' folder with any static server
npx serve -s build
```

## 📚 Learning Resources

### React
- [React Documentation](https://react.dev)
- [React Hooks](https://react.dev/reference/react)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Utility Classes](https://tailwindcss.com/docs/utility-first)

### Testing
- [Jest](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Cypress](https://docs.cypress.io)

## 💡 Project Ideas

Use this template to create:

- **Educational games** - Math, science, history, languages
- **Training simulators** - Professional skills, certifications
- **Interactive tutorials** - Software tools, programming
- **Gamified learning** - Any subject with challenges and progression
- **Security training** - Alternative cybersecurity scenarios
- **Quiz applications** - With game mechanics and progression

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tests Fail
```bash
# Update test snapshots
npm test -- -u
```

### Deployment Issues
```bash
# Verify homepage in package.json
# Check GitHub Pages settings
# Review build output
```

## 🤝 Support

- Original project: [SURVIV-OS Repository](https://github.com/kingpinzs/post-apoc-learn)
- Open an issue for template-related questions
- Check CONTRIBUTING.md for development guidelines

## 📄 License

This template is available under the MIT License. When creating your own project:
- You may use this code freely
- Provide attribution if desired (but not required)
- Create your own LICENSE file for your project

---

**Happy Building!** 🎮 Transform this template into your own unique learning experience.
