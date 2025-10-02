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

- **Story-adjacent files** - Checklist files (`.a11y.json`) are stored right next to your story files
- **Server-side persistence** - Checklists saved as JSON files with automatic directory management
- **Read-only fallback** - Graceful degradation when server is unavailable
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
  
  // Require failure reasons for failed items (default: true)
  requireReasonOnFail: true,
};
```

## 📁 File Organization

Checklist files are automatically stored next to your story files for better organization and discoverability:

```
src/
  components/
    Button/
      Button.tsx
      Button.stories.tsx
      Button.a11y.json      ← Accessibility checklist
    Header/
      Header.jsx
      Header.stories.js
      Header.a11y.json      ← Accessibility checklist
```

This approach provides several benefits:

- **Co-location**: Accessibility data stays with your components
- **Git friendly**: Changes to components and their accessibility status are tracked together
- **Team collaboration**: Easy to find and review accessibility checklists during code reviews
- **No configuration**: No need to configure or maintain separate directories

## 🎮 Usage

### Basic Workflow

1. **Open Storybook** and navigate to any story
2. **Click the "A11Y Checklist" panel** in the addons panel
3. **Work through guidelines** - mark each item as appropriate:
   - ✅ **Pass** - Component meets this accessibility requirement
   - ❌ **Fail** - Component violates this requirement (reason required)
   - **N/A** - This requirement doesn't apply to this component
   - **?** **Unknown** - Status hasn't been determined yet
4. **Save changes** - addon saves with change tracking

## 🖥️ CLI Tool

The addon includes a powerful CLI for CI/CD integration:

### Check Command

```bash
# Basic check (scans for .a11y.json files throughout the project)
npx a11y-checklist check

# Fail on outdated checklists
npx a11y-checklist check --fail-on-outdated

# Don't fail on failing tests (warnings only)
npx a11y-checklist check --no-fail-on-failing
```

### CLI Options

| Option | Description | Default |
|--------|-------------|---------|
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

Vibe coded with ❤️ for accessible web development
