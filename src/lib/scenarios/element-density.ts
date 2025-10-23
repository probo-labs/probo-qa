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
  '7f2e': {
    id: '7f2e',
    title: 'Business Contact Form',
    description: 'Standard business contact form with 6 fields (Name, Email, Phone, Company, Subject, Message) and Submit button. Comfortable vertical spacing between fields.',
    expectedAction: 'FILL',
    expectedTarget: 'phone-input',
    labels: [
      'element_density=moderate',
      'action_complexity=single-action',
    ],
  },
  'b5d1': {
    id: 'b5d1',
    title: 'Admin Filter Panel',
    description: 'E-commerce admin dashboard with dense filter sidebar containing 15 controls: date pickers, dropdowns, checkboxes, and search inputs. Compact 10px spacing between elements.',
    expectedAction: 'SELECT',
    expectedTarget: 'status-select',
    labels: [
      'element_density=dense',
      'action_complexity=single-action',
    ],
  },
  'c8f3': {
    id: 'c8f3',
    title: 'Trading Terminal',
    description: 'Stock trading terminal with 35+ interactive elements: ticker symbols, buy/sell buttons, quantity inputs, price fields. Grid layout with 2-4px spacing. Multiple toolbars and inline editing.',
    expectedAction: 'CLICK',
    expectedTarget: 'buy-btn-msft',
    labels: [
      'element_density=extreme-dense',
      'action_complexity=single-action',
      'instruction=under-specified',
    ],
  },
} as const;
