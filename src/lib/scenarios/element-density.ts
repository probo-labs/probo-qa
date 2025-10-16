// Element Density scenarios
// Tests how annotation systems handle different densities of interactive elements

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
} as const;
