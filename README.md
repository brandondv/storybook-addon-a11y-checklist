# 🔍 Storybook Addon A11Y Checklist

A comprehensive Storybook addon for maintaining WCAG accessibility checklists per component with server-side persistence, automated tracking, and CI/CD integration.

![npm version](https://img.shields.io/npm/v/storybook-addon-a11y-checklist)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Storybook](https://img.shields.io/badge/Storybook-8%2B-FF4785?logo=storybook)

## ✨ Features

### 🎯 Component-Based Accessibility Tracking
- **Component-centric checklists** - Track accessibility compliance per component, not per story
- **Auto-component detection** - Automatically detects component paths from Storybook stories
- **Manual override support** - Customize component paths when auto-detection isn't sufficient
- **Component versioning** - Tracks component changes with file hashing to detect outdated checklists

### 📋 Comprehensive WCAG 2.2 Support
- **87 WCAG 2.2 Guidelines** - Complete coverage of Level A, AA, and AAA criteria
- **Interactive checklist UI** - Mark items as Pass/Fail/Not Applicable/Unknown
- **Failure reason tracking** - Required explanations for failed accessibility criteria
- **Direct WCAG links** - Quick access to official WCAG specification for each guideline

### 🔄 Smart State Management
- **Server-side persistence** - Checklists saved as JSON files in your project
- **Read-only fallback** - Graceful degradation when server is unavailable
- **Auto-save functionality** - Changes saved automatically with unsaved changes indicator
- **Outdated detection** - Automatically detects when component changes make checklists outdated

### 🎨 Advanced Filtering & Search
- **Multi-select filters** - Filter by WCAG levels (A/AA/AAA) and status simultaneously  
- **Real-time search** - Search across guideline titles, descriptions, and IDs
- **Visual status indicators** - Color-coded badges for quick status identification
- **Summary statistics** - Real-time counts of passed/failed/not applicable/unknown items

### 🚀 CI/CD Integration
- **CLI tool included** - Check accessibility compliance in build pipelines
- **Configurable failure modes** - Fail builds on outdated or failing checklists
- **Detailed reporting** - Comprehensive CLI output for debugging failures
- **Project-wide scanning** - Analyze all checklists across your entire project

## 📦 Installation

```bash
npm install --save-dev storybook-addon-a11y-checklist
```

**Requirements:**
- Storybook 8.0+ or 9.0+
- Node.js 16+

## ⚙️ Setup

### 1. Add to Storybook Configuration

Add the addon to your `.storybook/main.js`:

```javascript
export default {
  addons: [
    // ... other addons
    'storybook-addon-a11y-checklist'
  ],
};
```

### 2. Optional: Configure Settings

Create `.storybook/a11y-checklist.config.js` for custom configuration:

```javascript
export default {
  // WCAG version to use (default: "2.2")
  wcagVersion: "2.2",
  
  // Directory to store checklist files (default: "a11y-checklists")
  checklistDir: "accessibility-checklists",
  
  // Require failure reasons for failed items (default: true)
  requireReasonOnFail: true,
};
```

## 🎮 Usage

### Basic Workflow

1. **Open Storybook** and navigate to any story
2. **Click the "A11Y Checklist" panel** in the addons panel
3. **Review the component path** - auto-detected from your story
4. **Create checklist** if none exists for the component
5. **Work through guidelines** - mark each item as appropriate:
   - ✅ **Pass** - Component meets this accessibility requirement
   - ❌ **Fail** - Component violates this requirement (reason required)
   - **N/A** - This requirement doesn't apply to this component
   - **?** **Unknown** - Status hasn't been determined yet
6. **Save changes** - addon auto-saves with change tracking

### Advanced Features

#### Multi-Level Filtering
```javascript
// Filter by multiple WCAG levels and statuses simultaneously
- Select "Level AA" + "Level AAA" to focus on higher compliance
- Filter by "Failed" items to see what needs fixing
- Combine filters: "Level A" + "Unknown" to find basic requirements to review
```

#### Search Functionality
```javascript
// Search across multiple fields:
- Guideline IDs: "1.1.1", "2.4.3"
- Titles: "Images of Text", "Focus Order"
- Descriptions: "keyboard", "screen reader"
```

#### Component Path Customization
```javascript
// Override auto-detected paths:
- Default: "src/components/Button.tsx" (from story)
- Custom: "packages/ui/components/Button/Button.jsx"
- Monorepo: "apps/web/src/shared/Button.tsx"
```

## 🖥️ CLI Tool

The addon includes a powerful CLI for CI/CD integration:

### Check Command

```bash
# Basic check
npx a11y-checklist check

# Custom directory
npx a11y-checklist check --dir my-a11y-checklists

# Fail on outdated checklists
npx a11y-checklist check --fail-on-outdated

# Don't fail on failing tests (warnings only)
npx a11y-checklist check --no-fail-on-failing
```

### CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `-d, --dir <directory>` | Checklist storage directory | `a11y-checklists` |
| `--fail-on-outdated` | Exit with error if outdated checklists found | `false` |
| `--fail-on-failing` | Exit with error if failing checklists found | `true` |

### Example CI Integration

```yaml
# GitHub Actions example
- name: Check A11Y Compliance
  run: |
    npm run build-storybook
    npx a11y-checklist check --fail-on-outdated --fail-on-failing
```

## 📁 File Structure

The addon creates and manages checklist files in your project:

```
your-project/
├── a11y-checklists/           # Default directory
│   ├── button.json            # Component checklists
│   ├── modal.json
│   └── datepicker.json
├── .storybook/
│   ├── main.js
│   └── a11y-checklist.config.js  # Optional config
└── package.json
```

### Checklist File Format

```json
{
  "version": "2.2",
  "componentId": "button",
  "componentName": "Button",
  "componentPath": "src/components/Button.tsx",
  "componentHash": "abc123def456",
  "lastUpdated": "2024-01-15T10:30:00Z",
  "updatedBy": "developer@company.com",
  "results": [
    {
      "guidelineId": "1.1.1",
      "level": "A",
      "status": "pass"
    },
    {
      "guidelineId": "1.4.3",
      "level": "AA", 
      "status": "fail",
      "reason": "Text contrast ratio is 3.8:1, needs to be 4.5:1 minimum"
    }
  ],
  "meta": {
    "notes": "Component reviewed during sprint 23",
    "generatedBy": "storybook-addon-a11y-checklist@1.0.0"
  }
}
```

## 🎨 UI Components

### Status Indicators

| Status | Badge | Color | Description |
|--------|-------|-------|-------------|
| Pass | ✅ Pass | Green | Requirement is met |
| Fail | ❌ Fail | Red | Requirement is violated |
| N/A | N/A | Gray | Requirement doesn't apply |  
| Unknown | ? Unknown | Yellow | Status not determined |

### Summary Statistics

Real-time overview showing:

- **Total Guidelines**: Complete count of applicable WCAG criteria
- **Passed**: Successfully implemented accessibility features
- **Failed**: Items requiring fixes (with required reasons)
- **Not Applicable**: Guidelines that don't apply to this component
- **Unknown**: Items still needing review

### Filter Controls

- **🔍 Search**: Real-time text search across all guideline content
- **📊 Levels**: Multi-select for WCAG levels (A/AA/AAA)
- **✅ Status**: Multi-select for compliance status

## 🔧 Configuration Options

### Addon Configuration

```javascript
// .storybook/a11y-checklist.config.js
export default {
  // WCAG version to use
  wcagVersion: "2.2",           // "2.1" | "2.2"
  
  // Directory for checklist storage  
  checklistDir: "a11y-checklists",
  
  // Require failure explanations
  requireReasonOnFail: true,    // boolean
  
  // Server configuration (advanced)
  server: {
    port: 6006,                 // Storybook port
    apiPath: "/api/a11y",       // API endpoint path
  }
};
```

## 🚀 Advanced Usage

### Custom Component Detection

For complex project structures, you can customize component path detection:

```javascript
// .storybook/a11y-checklist.config.js
export default {
  // Custom path resolution
  resolveComponentPath: (storyTitle, componentName) => {
    // Example: Map story paths to actual component locations
    const pathMap = {
      'Design System/Button': 'packages/ui/Button/Button.tsx',
      'Features/Modal': 'src/components/Modal/Modal.jsx',
    };
    
    return pathMap[storyTitle] || `src/components/${componentName}.tsx`;
  }
};
```

## 🐛 Troubleshooting

### Common Issues

#### Server Connection Issues
```bash
# If you see "Read-only mode" warnings:
1. Check that Storybook is running on the expected port
2. Verify no firewall blocking localhost connections  
3. Restart Storybook if the server addon isn't loading
```

## 🤝 Contributing

We welcome contributions! 

### Development Setup

```bash
# Clone and install
git clone https://github.com/storybookjs/storybook-addon-a11y-checklist
cd storybook-addon-a11y-checklist
npm install

# Start development
npm run dev

# Run tests
npm test

# Build addon
npm run build
```

## 📄 License

MIT © [package-author]

## 🙏 Acknowledgments

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/) for accessibility standards
- [Storybook](https://storybook.js.org/) for the amazing addon ecosystem
- The accessibility community for guidance and feedback

---

Made with ❤️ for accessible web development
