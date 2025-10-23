# Creating New Element Detection Scenarios

This guide explains how to create **brand new** element detection test scenarios from scratch (not porting from Django).

## Overview

Element detection scenarios test how AI annotation systems handle different UI patterns and element densities. Each scenario is a self-contained test page that:

1. **Looks like a real production website** - No hints about correctness
2. **Tracks user interactions** - Records every action in memory
3. **Validates results** - Shows PASS/FAIL based on expected behavior
4. **Generates annotations** - Uses highlighter to create numbered screenshots

## Architecture Quick Reference

```
User visits scenario page
  ↓
ScenarioPageClient renders UI
  ↓
User interacts with element
  ↓
onAction('FILL', 'element-id') called
  ↓
ScenarioContainer records action in state
  ↓
User hovers bottom-left → Navigation appears
  ↓
User clicks "VALIDATE" → ValidationSidebar shows PASS/FAIL
  ↓
User clicks "Highlighter" → Generate screenshots with annotations
```

## Step-by-Step: Creating a New Scenario

### Step 1: Define Scenario Metadata

**File:** `src/lib/scenarios/{dimension}.ts` (e.g., `element-density.ts`, `label-position.ts`)

Create or update the scenario registry file:

```typescript
// src/lib/scenarios/element-density.ts
import type { Scenario } from '@/types/scenario';

export const scenarios: Record<string, Scenario> = {
  'a3c9': {
    id: 'a3c9',
    title: 'Sparse Landing Page',
    description: 'Minimalist SaaS landing page with only 3 interactive elements: email input, CTA button, and navigation link. Large whitespace between elements.',
    expectedAction: 'FILL',
    expectedTarget: 'newsletter-email',
    labels: [
      'element_density=sparse',
      'action_complexity=single-action',
    ],
  },
  // Add your new scenario here
  'abc123': {
    id: 'abc123',  // 4-6 char hex or descriptive ID
    title: 'Your Scenario Title',
    description: 'Detailed description of what the test page looks like and what it tests.',
    expectedAction: 'FILL',  // FILL | CLICK | SELECT
    expectedTarget: 'target-element-id',  // ID of the correct element
    labels: [
      'element_density=moderate',  // sparse | moderate | dense | extreme-dense
      'action_complexity=single-action',  // Currently only single-action supported
      // Add other taxonomy labels as needed
    ],
  },
};
```

**Taxonomy Dimensions:**
- `element_density`: sparse | moderate | dense | extreme-dense
- `label_position`: left | top | inside | placeholder | inline | none
- `form_layout`: single-column | two-column | multi-column-grid | inline-labels | floating-fields | table-form
- `element_differentiation`: text-labels | icon-variation | color-coding | size-variation | position-only | border-style | no-differentiation
- `content_differentiation`: unique-content | similar-content | duplicate-content | sequential-numbering | empty-fields
- `selection_pattern`: dropdown-select | autocomplete | radio-buttons | checkbox-multi | segmented-control | tabs | accordion
- `context_requirement`: no-context | section-context | row-context | workflow-context | multi-level-context
- `action_complexity`: single-action (others not yet supported)

**Important:** Export the scenarios object from `src/lib/scenarios/index.ts`:

```typescript
// src/lib/scenarios/index.ts
import { scenarios as elementDensityScenarios } from './element-density';
import { scenarios as yourNewDimension } from './your-new-dimension';

export const SCENARIOS: Record<string, Scenario> = {
  ...elementDensityScenarios,
  ...yourNewDimension,
};
```

### Step 2: Create Scenario UI Component

**File:** `src/app/element-detection/[scenarioId]/ScenarioPageClient.tsx`

Add your scenario to the component with conditional rendering:

```typescript
'use client';

import { useState } from 'react';
import type { ActionType } from '@/types/scenario';

interface ScenarioPageClientProps {
  scenarioId: string;
  onAction: (action: ActionType, element: string) => void;
}

export default function ScenarioPageClient({ scenarioId, onAction }: ScenarioPageClientProps) {
  // ... existing scenarios ...

  // Your new scenario
  if (scenarioId === 'abc123') {
    return (
      <>
        <style jsx>{`
          /* Your CSS styles here - copy from a real website or design from scratch */
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            padding: 40px 20px;
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            padding: 40px;
          }

          /* Add all your styles here */
        `}</style>

        <div className="container">
          {/* Your HTML structure here */}
          <h1>Your Test Page</h1>

          <form onSubmit={(e) => e.preventDefault()}>
            {/* Interactive elements with onFocus/onClick handlers */}
            <input
              type="text"
              id="target-element-id"
              placeholder="Enter something..."
              onFocus={() => onAction('FILL', 'target-element-id')}
            />

            <button type="submit">Submit</button>
          </form>
        </div>
      </>
    );
  }

  // Default fallback
  return <div>Scenario {scenarioId} not implemented</div>;
}
```

### Step 3: Implement Interaction Tracking

**Key Patterns:**

#### For FILL actions (text inputs, textareas):

```typescript
// Track first focus only - prevents duplicate recordings
const [focusedFields, setFocusedFields] = useState<Record<string, boolean>>({});

const handleFieldFocus = (fieldId: string) => {
  if (!focusedFields[fieldId]) {
    setFocusedFields(prev => ({ ...prev, [fieldId]: true }));
    onAction('FILL', fieldId);
  }
};

// In JSX:
<input
  type="text"
  id="email-input"
  onFocus={() => handleFieldFocus('email-input')}
/>
```

#### For CLICK actions (buttons, links):

```typescript
const handleButtonClick = (e: React.MouseEvent, elementId: string) => {
  e.preventDefault();  // Prevent default form submission or navigation
  onAction('CLICK', elementId);
};

// In JSX:
<button onClick={(e) => handleButtonClick(e, 'submit-button')}>
  Submit
</button>
```

#### For SELECT actions (dropdowns):

```typescript
const [selectedDropdowns, setSelectedDropdowns] = useState<Record<string, boolean>>({});

const handleDropdownChange = (dropdownId: string) => {
  if (!selectedDropdowns[dropdownId]) {
    setSelectedDropdowns(prev => ({ ...prev, [dropdownId]: true }));
    onAction('SELECT', dropdownId);
  }
};

// In JSX:
<select
  id="status-select"
  onChange={() => handleDropdownChange('status-select')}
>
  <option value="">Select status</option>
  <option value="active">Active</option>
  <option value="inactive">Inactive</option>
</select>
```

**Important Rules:**
- ✅ Record the **first** interaction with each element
- ✅ Track **all** interactive elements (correct AND incorrect)
- ✅ Use `e.preventDefault()` for buttons/links to prevent navigation
- ✅ Use form `onSubmit={(e) => e.preventDefault()}` to prevent page reload
- ❌ Do NOT show success/error messages on the page
- ❌ Do NOT provide any visual hints about correctness

### Step 4: Design Your Test Page

**Design Principles:**

1. **Zero Information Leakage**
   - Page must look like a real production website
   - No success messages, no validation feedback
   - No color coding that hints at correctness
   - No HTML5 validation attributes

2. **Realistic Styling**
   - Use professional-looking CSS
   - Copy styles from real websites for inspiration
   - Maintain consistent spacing and typography
   - Use realistic placeholder text

3. **Minimal External Dependencies**
   - All CSS should be inline (styled-jsx)
   - No external images (use CSS gradients, colors)
   - Keep JavaScript minimal and inline

**Example Density Guidelines:**

| Density | Element Count | Spacing | Example |
|---------|---------------|---------|---------|
| Sparse | 2-4 | 30-50px | Login form with 2 fields |
| Moderate | 20-40 | 5-10px | Contact form with 6-8 fields |
| Dense | 50-100+ | 2-4px | Admin dashboard with filters |
| Extreme Dense | 30-50 in small area | 0-2px | Trading terminal, calendar grid |

### Step 5: Test Your Scenario

After implementing, test the following:

#### 5.1 Basic Functionality
```bash
# Start dev server
pnpm dev

# Visit your scenario
# http://localhost:3000/element-detection/abc123
```

**Check:**
- ✅ Page renders with correct styling
- ✅ Hover bottom-left corner reveals navigation
- ✅ Scenario ID, title, and position display correctly
- ✅ Prev/Next navigation works

#### 5.2 Interaction Tracking
- **Focus on correct element** → Action counter shows "1 action"
- **Focus on wrong element** → Action counter shows "2 actions"
- **Focus on multiple elements** → Counter increments correctly

#### 5.3 Validation
- **Click "VALIDATE" button** → Sidebar appears
- **Check PASS scenario:** 1 action, correct element → Green "SUCCESS"
- **Check FAIL scenario:** Multiple actions OR wrong element → Red "FAIL"
- **Check validation message** → Displays clear pass/fail reason

#### 5.4 Highlighter Integration
- **Click "Highlighter" button** → Triggers screenshot generation
- **Wait for processing** → Sidebar shows cached timestamp
- **View thumbnails** → All 5 screenshots generated (base, clickable, fillable, selectable, non-interactive)
- **View JSON** → Candidate elements correctly identified

#### 5.5 Index Page
- **Visit `/element-detection`** → Your scenario appears in correct density section
- **Check ordering** → Scenarios ordered by ID
- **Check labels** → Only non-default labels display as badges

### Step 6: Document Your Scenario

Add comments to your code explaining:

```typescript
// Scenario abc123: Your Scenario Name
// Tests: [What specific challenge this scenario tests]
// Expected: User should [describe expected interaction]
// Common Failures: [What mistakes AI systems typically make]
if (scenarioId === 'abc123') {
  // ...
}
```

## Complete Example: Dense Table with Action Buttons

Here's a full example of a new scenario testing duplicate button labels:

```typescript
// 1. Metadata in src/lib/scenarios/content-differentiation.ts
export const scenarios: Record<string, Scenario> = {
  'd4f8': {
    id: 'd4f8',
    title: 'Table with Duplicate Delete Buttons',
    description: 'User management table with 5 rows, each row has identical "Delete" button. Tests if AI can distinguish identical buttons using row context.',
    expectedAction: 'CLICK',
    expectedTarget: 'delete-btn-3',  // Third row
    labels: [
      'element_density=moderate',
      'content_differentiation=duplicate-content',
      'action_complexity=single-action',
    ],
  },
};

// 2. Component in ScenarioPageClient.tsx
if (scenarioId === 'd4f8') {
  const [clickedButtons, setClickedButtons] = useState<Record<string, boolean>>({});

  const handleDeleteClick = (e: React.MouseEvent, buttonId: string) => {
    e.preventDefault();
    if (!clickedButtons[buttonId]) {
      setClickedButtons(prev => ({ ...prev, [buttonId]: true }));
      onAction('CLICK', buttonId);
    }
  };

  return (
    <>
      <style jsx>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f5f5f5;
          padding: 40px 20px;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        h1 {
          font-size: 28px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 30px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-size: 14px;
          font-weight: 600;
          color: #495057;
          border-bottom: 2px solid #dee2e6;
        }

        td {
          padding: 12px;
          border-bottom: 1px solid #dee2e6;
          font-size: 14px;
          color: #212529;
        }

        .delete-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 6px 16px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .delete-btn:hover {
          background: #c82333;
        }
      `}</style>

      <div className="container">
        <h1>User Management</h1>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alice Johnson</td>
              <td>alice@company.com</td>
              <td>Admin</td>
              <td>
                <button
                  className="delete-btn"
                  id="delete-btn-1"
                  onClick={(e) => handleDeleteClick(e, 'delete-btn-1')}
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td>Bob Smith</td>
              <td>bob@company.com</td>
              <td>Editor</td>
              <td>
                <button
                  className="delete-btn"
                  id="delete-btn-2"
                  onClick={(e) => handleDeleteClick(e, 'delete-btn-2')}
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td>Carol Williams</td>
              <td>carol@company.com</td>
              <td>Viewer</td>
              <td>
                <button
                  className="delete-btn"
                  id="delete-btn-3"
                  onClick={(e) => handleDeleteClick(e, 'delete-btn-3')}
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td>David Brown</td>
              <td>david@company.com</td>
              <td>Editor</td>
              <td>
                <button
                  className="delete-btn"
                  id="delete-btn-4"
                  onClick={(e) => handleDeleteClick(e, 'delete-btn-4')}
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td>Eve Davis</td>
              <td>eve@company.com</td>
              <td>Admin</td>
              <td>
                <button
                  className="delete-btn"
                  id="delete-btn-5"
                  onClick={(e) => handleDeleteClick(e, 'delete-btn-5')}
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
```

## Common Patterns

### Pattern 1: Form with Multiple Fields (FILL action)

```typescript
const [focusedFields, setFocusedFields] = useState<Record<string, boolean>>({});

const handleFieldFocus = (fieldId: string) => {
  if (!focusedFields[fieldId]) {
    setFocusedFields(prev => ({ ...prev, [fieldId]: true }));
    onAction('FILL', fieldId);
  }
};

return (
  <form onSubmit={(e) => e.preventDefault()}>
    <input id="name" onFocus={() => handleFieldFocus('name')} />
    <input id="email" onFocus={() => handleFieldFocus('email')} />
    <input id="phone" onFocus={() => handleFieldFocus('phone')} />
    <button type="submit">Submit</button>
  </form>
);
```

### Pattern 2: Multiple Similar Buttons (CLICK action)

```typescript
const [clickedButtons, setClickedButtons] = useState<Record<string, boolean>>({});

const handleClick = (e: React.MouseEvent, btnId: string) => {
  e.preventDefault();
  if (!clickedButtons[btnId]) {
    setClickedButtons(prev => ({ ...prev, [btnId]: true }));
    onAction('CLICK', btnId);
  }
};

return (
  <div>
    <button onClick={(e) => handleClick(e, 'btn-1')}>Action</button>
    <button onClick={(e) => handleClick(e, 'btn-2')}>Action</button>
    <button onClick={(e) => handleClick(e, 'btn-3')}>Action</button>
  </div>
);
```

### Pattern 3: Dropdown Selection (SELECT action)

```typescript
const [changed, setChanged] = useState<Record<string, boolean>>({});

const handleChange = (selectId: string) => {
  if (!changed[selectId]) {
    setChanged(prev => ({ ...prev, [selectId]: true }));
    onAction('SELECT', selectId);
  }
};

return (
  <select id="status" onChange={() => handleChange('status')}>
    <option value="">Select...</option>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
);
```

## Troubleshooting

### Scenario doesn't appear in index
- ✅ Check scenario is exported from dimension file
- ✅ Verify dimension file is imported in `src/lib/scenarios/index.ts`
- ✅ Ensure scenario has required labels (at least `action_complexity`)

### Navigation doesn't show
- ✅ Hover bottom-left corner (small 20x12px area)
- ✅ Check `ScenarioNavigationWrapper` is rendered
- ✅ Verify no CSS z-index conflicts

### Validation always fails
- ✅ Check `expectedAction` matches actual action type
- ✅ Verify `expectedTarget` matches element ID exactly
- ✅ Ensure `onAction()` is called with correct parameters
- ✅ Test with browser console to see recorded actions

### Highlighter fails to generate
- ✅ Check `.env` has `HIGHLIGHTER_SCRIPT_PATH` set correctly
- ✅ Verify highlighter script exists at specified path
- ✅ Check browser console for JavaScript errors
- ✅ Ensure page elements have valid IDs

### Actions recorded multiple times
- ✅ Use state flags to track already-interacted elements
- ✅ Check condition `if (!focusedFields[fieldId])` before calling `onAction()`
- ✅ Don't attach multiple event listeners to same element

## Best Practices

### ✅ DO:
- Design realistic-looking production UIs
- Track all interactive elements (correct and incorrect)
- Use semantic HTML with proper IDs
- Test validation with both correct and incorrect actions
- Add clear comments explaining the test purpose
- Follow existing code style and patterns

### ❌ DON'T:
- Show success/error messages on test page
- Add visual hints about correctness
- Use external dependencies or images
- Create multi-step scenarios (not supported yet)
- Modify shared infrastructure without discussion
- Skip testing before committing

## Reference: Existing Scenarios

Study these examples for inspiration:

- **a3c9** - Sparse landing page (3 elements, large spacing)
- **7f2e** - Moderate contact form (6 fields, comfortable spacing)
- See `src/lib/scenarios/` for complete list

## Related Files

- **Scenario metadata:** `src/lib/scenarios/`
- **Page component:** `src/app/element-detection/[scenarioId]/ScenarioPageClient.tsx`
- **Validation logic:** `src/lib/validation.ts`
- **Type definitions:** `src/types/scenario.ts`
- **Index page:** `src/app/element-detection/page.tsx`

## Questions?

Check the existing codebase for examples, or refer to:
- `docs/porting-scenarios.md` - Guide for porting from Django (if it exists)
- Project README - General setup and testing instructions
- Git history - See how previous scenarios were implemented
