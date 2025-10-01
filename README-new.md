# Storybook A11Y Checklist Addon

A comprehensive Storybook addon that helps maintain accessibility (A11Y) checklists per story/component based on WCAG guidelines.

## Features

- 📋 **Complete WCAG 2.2 Guidelines** - Full checklist of all WCAG 2.2 guidelines
- 💾 **Persistent Storage** - Save checklist results to disk as JSON files committed to Git
- 🔄 **Outdated Detection** - Automatically detect when component code changes and checklist needs review
- 🎯 **Tab Interface** - Clean tab interface in Storybook manager UI
- 🔍 **Advanced Filtering** - Search and filter by guideline level (A/AA/AAA), status, or text
- ✅ **Status Tracking** - Mark guidelines as pass/fail/not applicable with reasons
- 🚨 **CI Integration** - CLI tool for pre-commit hooks and CI pipelines
- ⚙️ **Configurable** - Customizable WCAG version, directory, and validation rules

## Installation

```bash
npm install --save-dev storybook-addon-a11y-checklist
```

Add the addon to your Storybook configuration in `.storybook/main.js`:

```js
module.exports = {
  addons: [
    'storybook-addon-a11y-checklist'
  ],
};
```

## Usage

### Basic Usage

1. Start Storybook and navigate to any story
2. Click on the "A11Y Checklist" tab
3. Enter the component path (e.g., `src/components/Button.tsx`)
4. Review each WCAG guideline and mark as Pass/Fail/Not Applicable
5. For failing guidelines, provide a reason explaining the failure
6. Click "Save" to persist the checklist to disk

### File Structure

Checklists are saved in the `a11y-checklists/` directory (configurable) with the following structure:

```
a11y-checklists/
  ├── button--primary.a11y.json
  ├── card--default.a11y.json
  └── modal--basic.a11y.json
```

### JSON Format

Each checklist file contains:

```json
{
  "version": "2.2",
  "storyId": "button--primary",
  "componentName": "Button",
  "componentPath": "src/components/Button.tsx",
  "componentHash": "sha256:abc123...",
  "lastUpdated": "2025-10-01T12:34:56Z",
  "updatedBy": "local-user",
  "results": [
    {
      "guidelineId": "1.1.1",
      "level": "A",
      "status": "pass",
      "reason": ""
    },
    {
      "guidelineId": "1.4.3",
      "level": "AA", 
      "status": "fail",
      "reason": "Insufficient color contrast ratio"
    }
  ],
  "meta": {
    "notes": "",
    "generatedBy": "storybook-addon-a11y-checklist@1.0.0"
  }
}
```

## Configuration

Add configuration to your `.storybook/main.js`:

```js
module.exports = {
  addons: [
    {
      name: 'storybook-addon-a11y-checklist',
      options: {
        wcagVersion: '2.2',
        checklistDir: 'a11y-checklists',
        requireReasonOnFail: true,
      }
    }
  ],
};
```

### Configuration Options

- `wcagVersion` (default: `"2.2"`) - WCAG version to use
- `checklistDir` (default: `"a11y-checklists"`) - Directory to store checklist files
- `requireReasonOnFail` (default: `true`) - Require reason when marking guideline as failed

## CLI Tool

The addon includes a CLI tool for CI/CD integration:

```bash
# Check for outdated or failing checklists
npx a11y-checklist check

# List all checklists
npx a11y-checklist list

# Check with custom directory
npx a11y-checklist check --dir custom-a11y-dir

# Fail build on outdated checklists
npx a11y-checklist check --fail-on-outdated
```

### Pre-commit Hook

Add to your `package.json`:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "a11y-checklist check"
    }
  }
}
```

### GitHub Actions

```yaml
name: A11Y Checklist
on: [push, pull_request]
jobs:
  a11y-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx a11y-checklist check
```

## Features Overview

### Outdated Detection

The addon computes SHA-256 hashes of component source code. When a component changes, its checklist is automatically marked as "outdated" and displays a warning badge.

### Advanced Filtering

- **Search**: Find guidelines by ID, title, or description
- **Level Filter**: Show only A, AA, or AAA level guidelines  
- **Status Filter**: Filter by Pass/Fail/Not Applicable status

### Status Indicators

- 🟢 **Pass**: Guideline requirements are met
- 🔴 **Fail**: Guideline fails (reason required)
- ⚪ **Not Applicable**: Guideline doesn't apply to this component
- ⚠️ **Outdated**: Component code has changed since last review

## Development

```bash
# Install dependencies
npm install

# Start development mode
npm run start

# Build for production
npm run build

# Run tests
npm run test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## License

MIT License - see LICENSE file for details.