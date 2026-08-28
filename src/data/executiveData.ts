import type { SpmPortfolio } from '../types/executive';

/** Mock SPM portfolios and sub-portfolios for the Executive view prototype. */
export const spmPortfolios: SpmPortfolio[] = [
  {
    id: 'SPM-01',
    name: 'Customer Journeys',
    owner: 'Avery Quinn',
    division: 'Customer Experience',
    subPortfolios: [
      { id: 'SPM-01-A', name: 'Self-serve claims', trackedInAdo: true, people: 14, healthScore: 78 },
      { id: 'SPM-01-B', name: 'Onboarding redesign', trackedInAdo: true, people: 9, healthScore: 62 },
      { id: 'SPM-01-C', name: 'Contact centre uplift', trackedInAdo: false, people: 6, healthScore: 41 },
      { id: 'SPM-01-D', name: 'Loyalty & retention', trackedInAdo: true, people: 11, healthScore: 71 },
    ],
  },
  {
    id: 'SPM-02',
    name: 'Digital Platforms',
    owner: 'Dana Whitfield',
    division: 'Technology',
    subPortfolios: [
      { id: 'SPM-02-A', name: 'Identity & access', trackedInAdo: true, people: 12, healthScore: 84 },
      { id: 'SPM-02-B', name: 'Core APIs', trackedInAdo: true, people: 18, healthScore: 73 },
      { id: 'SPM-02-C', name: 'Developer experience', trackedInAdo: true, people: 7, healthScore: 69 },
      { id: 'SPM-02-D', name: 'Observability', trackedInAdo: false, people: 5, healthScore: 55 },
      { id: 'SPM-02-E', name: 'Cloud foundations', trackedInAdo: true, people: 10, healthScore: 66 },
    ],
  },
  {
    id: 'SPM-03',
    name: 'People & Performance',
    owner: 'Philip Cutcliffe',
    division: 'P&P Discipline',
    subPortfolios: [
      { id: 'SPM-03-A', name: 'Estate single pane', trackedInAdo: true, people: 8, healthScore: 81 },
      { id: 'SPM-03-B', name: 'Early careers', trackedInAdo: true, people: 6, healthScore: 48 },
      { id: 'SPM-03-C', name: 'Business transformation', trackedInAdo: true, people: 13, healthScore: 57 },
      { id: 'SPM-03-D', name: 'Design system', trackedInAdo: false, people: 4, healthScore: 63 },
    ],
  },
  {
    id: 'SPM-04',
    name: 'Risk & Regulatory',
    owner: 'Chris Patel',
    division: 'Risk',
    subPortfolios: [
      { id: 'SPM-04-A', name: 'Privileged access', trackedInAdo: true, people: 9, healthScore: 76 },
      { id: 'SPM-04-B', name: 'Audit readiness', trackedInAdo: false, people: 7, healthScore: 44 },
      { id: 'SPM-04-C', name: 'Data retention', trackedInAdo: true, people: 5, healthScore: 68 },
    ],
  },
  {
    id: 'SPM-05',
    name: 'Growth & Partnerships',
    owner: 'Morgan Ellis',
    division: 'Commercial',
    subPortfolios: [
      { id: 'SPM-05-A', name: 'Partner integrations', trackedInAdo: true, people: 10, healthScore: 59 },
      { id: 'SPM-05-B', name: 'Market expansion', trackedInAdo: false, people: 8, healthScore: 36 },
      { id: 'SPM-05-C', name: 'Pricing experiments', trackedInAdo: false, people: 3, healthScore: 52 },
      { id: 'SPM-05-D', name: 'Channel enablement', trackedInAdo: true, people: 12, healthScore: 70 },
      { id: 'SPM-05-E', name: 'Campaign ops', trackedInAdo: true, people: 6, healthScore: 64 },
    ],
  },
  {
    id: 'SPM-06',
    name: 'Operations Excellence',
    owner: 'Harper Diaz',
    division: 'Operations',
    subPortfolios: [
      { id: 'SPM-06-A', name: 'Process automation', trackedInAdo: true, people: 15, healthScore: 72 },
      { id: 'SPM-06-B', name: 'Service reliability', trackedInAdo: true, people: 11, healthScore: 80 },
      { id: 'SPM-06-C', name: 'Workforce planning', trackedInAdo: false, people: 4, healthScore: 50 },
    ],
  },
  {
    id: 'SPM-07',
    name: 'Data & AI',
    owner: 'Jamie Ortiz',
    division: 'Technology',
    subPortfolios: [
      { id: 'SPM-07-A', name: 'Intent classification', trackedInAdo: true, people: 8, healthScore: 67 },
      { id: 'SPM-07-B', name: 'Analytics platform', trackedInAdo: true, people: 14, healthScore: 74 },
      { id: 'SPM-07-C', name: 'Feature store', trackedInAdo: false, people: 5, healthScore: 39 },
      { id: 'SPM-07-D', name: 'Responsible AI', trackedInAdo: true, people: 6, healthScore: 71 },
    ],
  },
  {
    id: 'SPM-08',
    name: 'Workplace & Estate',
    owner: 'Taylor Nguyen',
    division: 'Corporate',
    subPortfolios: [
      { id: 'SPM-08-A', name: 'Facilities digital twin', trackedInAdo: false, people: 5, healthScore: 42 },
      { id: 'SPM-08-B', name: 'Space utilisation', trackedInAdo: true, people: 7, healthScore: 61 },
      { id: 'SPM-08-C', name: 'Hybrid work tools', trackedInAdo: true, people: 9, healthScore: 69 },
    ],
  },
];
