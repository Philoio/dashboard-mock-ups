import type {
  PercentValue,
  ScorecardVpGroup,
  ScoreTone,
  UnfundedEpic,
} from '../types/scorecard';

/**
 * Percentages are negatives (higher is worse), so the scale is inverted:
 * Green ≤20%, Amber 21–49%, Red ≥50%.
 */
export function scoreTone(value: PercentValue): ScoreTone {
  if (value === null) return 'na';
  if (value >= 50) return 'bad';
  if (value > 20) return 'warn';
  return 'good';
}

export const scorecardMetricGuide = [
  {
    id: 'snow',
    label: 'SNOW Projects',
    whatWeMeasure: 'Count of ServiceNow projects mapped to the portfolio group.',
    whyThisIsImportant: 'Gives the funded baseline that everything else is measured against.',
    howWeCalculate: 'Count of open SNOW project records assigned to the VP or portfolio group.',
  },
  {
    id: 'epics-unfunded',
    label: 'ADO Epics without funding',
    whatWeMeasure: 'What percentage of epics in ADO does not link to an SPM project ID.',
    whyThisIsImportant: 'To ensure teams are only working on funded work.',
    howWeCalculate:
      'Percentage of all in-progress epics that do not have an SPM project ID, or a link to an initiative with an SPM project ID.',
  },
  {
    id: 'backlog-unfunded',
    label: 'ADO backlog items without funding',
    whatWeMeasure: 'What percentage of work in ADO does not link to an SPM project ID.',
    whyThisIsImportant:
      'Not only has the portfolio been mapped to SNOW, but we can actually trace the work going on in the teams to funding.',
    howWeCalculate:
      'Percentage of all in-progress product backlog items, bugs, support tickets, and user stories that cannot be traced up the backlog hierarchy to an epic, initiative, or portfolio initiative.',
  },
  {
    id: 'spm-not-in-ado',
    label: 'SPM work not in ADO',
    whatWeMeasure:
      'What percentage of open SPM project IDs do not have their work tracked in ADO.',
    whyThisIsImportant: 'To identify funding where no work is taking place or planned to take place.',
    howWeCalculate:
      'Percentage of open SPM project IDs that do not have any corresponding ADO work.',
  },
] as const;

/**
 * Mock baseline mirroring the Delivery Health Scorecard spreadsheet
 * (Digital & Innovation, August 2026).
 */
export const scorecardGroups: ScorecardVpGroup[] = [
  {
    id: 'vp-cwc',
    vpName: 'Ching Wan Chiang',
    totals: {
      snowProjects: 304,
      epicsWithoutFundingPct: 28,
      backlogWithoutFundingPct: 58,
      spmWorkNotInAdoPct: 28,
    },
    units: [
      {
        id: 'cwc-aviation',
        name: 'Aviation',
        snowProjects: 29,
        epicsWithoutFundingPct: 18,
        backlogWithoutFundingPct: 45,
        spmWorkNotInAdoPct: 18,
      },
      {
        id: 'cwc-crm',
        name: 'CRM',
        snowProjects: 154,
        epicsWithoutFundingPct: 25,
        backlogWithoutFundingPct: 52,
        spmWorkNotInAdoPct: 25,
      },
      {
        id: 'cwc-castrol',
        name: 'Castrol',
        snowProjects: 85,
        epicsWithoutFundingPct: 33,
        backlogWithoutFundingPct: 59,
        spmWorkNotInAdoPct: 33,
      },
      {
        id: 'cwc-china',
        name: 'China',
        snowProjects: 23,
        epicsWithoutFundingPct: 27,
        backlogWithoutFundingPct: 78,
        spmWorkNotInAdoPct: 27,
      },
      {
        id: 'cwc-data',
        name: 'Cross C&P - Data',
        snowProjects: 13,
        epicsWithoutFundingPct: 38,
        backlogWithoutFundingPct: 54,
        spmWorkNotInAdoPct: 38,
      },
    ],
  },
  {
    id: 'vp-ds',
    vpName: 'David Speed',
    totals: {
      snowProjects: 59,
      epicsWithoutFundingPct: 14,
      backlogWithoutFundingPct: 63,
      spmWorkNotInAdoPct: 14,
    },
    units: [
      {
        id: 'ds-applied',
        name: 'Applied Science',
        snowProjects: 4,
        epicsWithoutFundingPct: 10,
        backlogWithoutFundingPct: 75,
        spmWorkNotInAdoPct: 10,
      },
      {
        id: 'ds-refining',
        name: 'Refining, Bioenergy, Hydrogen and Renewables',
        snowProjects: 55,
        epicsWithoutFundingPct: 18,
        backlogWithoutFundingPct: 51,
        spmWorkNotInAdoPct: 18,
      },
    ],
  },
  {
    id: 'vp-dsh',
    vpName: 'Dushyant Sharma',
    totals: {
      snowProjects: 1,
      epicsWithoutFundingPct: null,
      backlogWithoutFundingPct: 0,
      spmWorkNotInAdoPct: null,
    },
    units: [
      {
        id: 'dsh-product',
        name: 'Product & Projects',
        snowProjects: 1,
        epicsWithoutFundingPct: null,
        backlogWithoutFundingPct: 0,
        spmWorkNotInAdoPct: null,
      },
    ],
  },
  {
    id: 'vp-es',
    vpName: 'Eugene Stipp',
    totals: {
      snowProjects: 5,
      epicsWithoutFundingPct: null,
      backlogWithoutFundingPct: 20,
      spmWorkNotInAdoPct: null,
    },
    units: [
      {
        id: 'es-engineering',
        name: 'Engineering & AI',
        snowProjects: 5,
        epicsWithoutFundingPct: null,
        backlogWithoutFundingPct: 20,
        spmWorkNotInAdoPct: null,
      },
    ],
  },
  {
    id: 'vp-gm',
    vpName: 'Graeme Mean',
    totals: {
      snowProjects: 68,
      epicsWithoutFundingPct: 47,
      backlogWithoutFundingPct: 22,
      spmWorkNotInAdoPct: 47,
    },
    units: [
      {
        id: 'gm-po',
        name: 'P&O',
        snowProjects: 68,
        epicsWithoutFundingPct: 47,
        backlogWithoutFundingPct: 22,
        spmWorkNotInAdoPct: 47,
      },
    ],
  },
  {
    id: 'vp-hb',
    vpName: 'Hannah Barnes',
    totals: {
      snowProjects: 130,
      epicsWithoutFundingPct: 35,
      backlogWithoutFundingPct: 28,
      spmWorkNotInAdoPct: 35,
    },
    units: [
      {
        id: 'hb-techoffice',
        name: 'Cross C&P - Technology Office',
        snowProjects: 9,
        epicsWithoutFundingPct: 33,
        backlogWithoutFundingPct: 32,
        spmWorkNotInAdoPct: 33,
      },
      {
        id: 'hb-mobility',
        name: 'Mobility & Convenience',
        snowProjects: 111,
        epicsWithoutFundingPct: 41,
        backlogWithoutFundingPct: 23,
        spmWorkNotInAdoPct: 41,
      },
      {
        id: 'hb-pulse',
        name: 'bp pulse',
        snowProjects: 10,
        epicsWithoutFundingPct: 30,
        backlogWithoutFundingPct: null,
        spmWorkNotInAdoPct: 30,
      },
    ],
  },
  {
    id: 'vp-pw',
    vpName: 'Paul Williamson',
    totals: {
      snowProjects: 41,
      epicsWithoutFundingPct: 16,
      backlogWithoutFundingPct: 44,
      spmWorkNotInAdoPct: 16,
    },
    units: [
      {
        id: 'pw-trading',
        name: 'Trading & Shipping',
        snowProjects: 27,
        epicsWithoutFundingPct: 12,
        backlogWithoutFundingPct: 41,
        spmWorkNotInAdoPct: 12,
      },
      {
        id: 'pw-supply',
        name: 'Supply Optimisation',
        snowProjects: 14,
        epicsWithoutFundingPct: 19,
        backlogWithoutFundingPct: 48,
        spmWorkNotInAdoPct: 19,
      },
    ],
  },
];

/**
 * Dummy drill-down list for the mock-up. The same list is shown for every
 * percentage clicked in the "ADO Epics without funding" column.
 */
export const unfundedEpics: UnfundedEpic[] = [
  {
    id: 'EP-10482',
    title: 'Aviation fuel uplift reconciliation',
    areaPath: 'C&P\\Aviation\\Core Platform',
    state: 'In Progress',
    assignedTo: 'Sam Okonkwo',
    storyPoints: 34,
    lastUpdated: '2026-08-21',
    reason: 'No SPM project ID on epic',
    adoUrl: '#',
  },
  {
    id: 'EP-10517',
    title: 'CRM consent management uplift',
    areaPath: 'C&P\\CRM\\Customer Data',
    state: 'In Progress',
    assignedTo: 'Priya Shah',
    storyPoints: 21,
    lastUpdated: '2026-08-25',
    reason: 'Parent initiative has no SPM project ID',
    adoUrl: '#',
  },
  {
    id: 'EP-10533',
    title: 'Castrol distributor portal refresh',
    areaPath: 'C&P\\Castrol\\Digital Channels',
    state: 'In Progress',
    assignedTo: 'Jordan Lee',
    storyPoints: 55,
    lastUpdated: '2026-08-19',
    reason: 'No SPM project ID on epic',
    adoUrl: '#',
  },
  {
    id: 'EP-10549',
    title: 'China loyalty wallet integration',
    areaPath: 'C&P\\China\\Loyalty',
    state: 'In Progress',
    assignedTo: 'Wei Zhang',
    storyPoints: 13,
    lastUpdated: '2026-08-26',
    reason: 'Orphaned epic — no parent link',
    adoUrl: '#',
  },
  {
    id: 'EP-10562',
    title: 'Cross C&P data quality remediation',
    areaPath: 'C&P\\Cross C&P - Data\\Governance',
    state: 'In Progress',
    assignedTo: 'Alex Rivera',
    storyPoints: 29,
    lastUpdated: '2026-08-24',
    reason: 'No SPM project ID on epic',
    adoUrl: '#',
  },
  {
    id: 'EP-10588',
    title: 'Retail pricing engine migration',
    areaPath: 'C&P\\Mobility & Convenience\\Pricing',
    state: 'In Progress',
    assignedTo: 'Morgan Ellis',
    storyPoints: 44,
    lastUpdated: '2026-08-18',
    reason: 'Parent initiative has no SPM project ID',
    adoUrl: '#',
  },
  {
    id: 'EP-10604',
    title: 'EV charger telemetry pipeline',
    areaPath: 'C&P\\bp pulse\\Telemetry',
    state: 'In Progress',
    assignedTo: 'Riley Chen',
    storyPoints: 21,
    lastUpdated: '2026-08-27',
    reason: 'No SPM project ID on epic',
    adoUrl: '#',
  },
  {
    id: 'EP-10617',
    title: 'Hydrogen plant scheduling tooling',
    areaPath: 'Gas & Low Carbon\\Hydrogen\\Operations',
    state: 'In Progress',
    assignedTo: 'Casey Brooks',
    storyPoints: 34,
    lastUpdated: '2026-08-20',
    reason: 'Orphaned epic — no parent link',
    adoUrl: '#',
  },
  {
    id: 'EP-10631',
    title: 'Applied Science model registry',
    areaPath: 'Innovation\\Applied Science\\ML Platform',
    state: 'In Progress',
    assignedTo: 'Dana Whitfield',
    storyPoints: 18,
    lastUpdated: '2026-08-22',
    reason: 'No SPM project ID on epic',
    adoUrl: '#',
  },
  {
    id: 'EP-10645',
    title: 'P&O workforce planning replatform',
    areaPath: 'P&O\\Workforce\\Planning',
    state: 'In Progress',
    assignedTo: 'Harper Diaz',
    storyPoints: 40,
    lastUpdated: '2026-08-17',
    reason: 'Parent initiative has no SPM project ID',
    adoUrl: '#',
  },
  {
    id: 'EP-10668',
    title: 'Technology Office cost transparency',
    areaPath: 'Cross C&P\\Technology Office\\FinOps',
    state: 'In Progress',
    assignedTo: 'Taylor Nguyen',
    storyPoints: 26,
    lastUpdated: '2026-08-23',
    reason: 'No SPM project ID on epic',
    adoUrl: '#',
  },
  {
    id: 'EP-10679',
    title: 'Trading limits monitoring uplift',
    areaPath: 'T&S\\Trading\\Risk',
    state: 'In Progress',
    assignedTo: 'Chris Patel',
    storyPoints: 31,
    lastUpdated: '2026-08-26',
    reason: 'Orphaned epic — no parent link',
    adoUrl: '#',
  },
];
