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
      'detection_issue=highlighter-recorder-mismatch',
      'element_density=sparse',
      'action_complexity=single-action',
    ],
  },
} as const;

