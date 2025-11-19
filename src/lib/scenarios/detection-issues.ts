// Detection Issue scenarios
// Tests known issues with element detection systems

import type { Scenario } from '@/types/scenario';

export const scenarios: Record<string, Scenario> = {
  'x9a1': {
    id: 'x9a1',
    title: 'SVG Close Button Detection',
    description: 'Modal dialog with SVG close button (X icon) in top-right. SVG has cursor:pointer style. Highlighter does NOT detect it (skips SVGs), but recorder WILL record clicks on it (checks cursor:pointer). Demonstrates detection inconsistency between highlighter and recorder.',
    expectedAction: 'CLICK',
    expectedTarget: 'modal-close-button',
    labels: [
      'detection_issue=svg-cursor-pointer',
      'element_density=sparse',
      'action_complexity=single-action',
    ],
  },
  'x9a2': {
    id: 'x9a2',
    title: 'Dropdown Partial Clickability',
    description: 'Dropdown with "Disabled" text that is clickable, but the caret arrow to its right is not clickable. The caret SVG is a sibling of the clickable div (not inside it), so clicks on the right side of the dropdown do not trigger any action. Demonstrates partial clickability due to DOM structure.',
    expectedAction: 'CLICK',
    expectedTarget: 'dropdown-clickable-area-1',
    labels: [
      'detection_issue=partial-clickability',
      'element_density=sparse',
      'action_complexity=single-action',
    ],
  },
  'x9a3': {
    id: 'x9a3',
    title: 'Uniquify Test Variations',
    description: 'Comprehensive table of 32 dropdown variations testing uniquify logic with different combinations of whitespace, padding, handlers, cursor styles, and multiple children. Tests how uniquify handles parent-child relationships, whitespace-only parents, and nested elements.',
    expectedAction: 'CLICK',
    expectedTarget: 'dropdown-1-clickable',
    labels: [
      'detection_issue=uniquify-testing',
      'element_density=dense',
      'action_complexity=single-action',
    ],
  },
} as const;

