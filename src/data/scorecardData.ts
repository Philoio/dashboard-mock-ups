import type { ScorecardMeta, ScorecardVpGroup, ScoreTone, PercentValue } from '../types/scorecard';

export const scorecardMeta: ScorecardMeta = {
  title: 'Delivery Health Scorecard',
  organisation: 'Digital & Innovation',
  period: 'August 2026 Baseline',
  sourceNote:
    'Source: SPM portfolio register, ServiceNow project inventory, and Azure DevOps activity for August 2026.',
};

/** RAG thresholds from the baseline sheet: Green ≥80%, Amber 50–79%, Red <50%. */
export function scoreTone(value: PercentValue): ScoreTone {
  if (value === null) return 'na';
  if (value >= 80) return 'good';
  if (value >= 50) return 'warn';
  return 'bad';
}

export const scorecardMetricGuide = [
  {
    id: 'snow',
    label: 'SNOW Projects',
    whatWeMeasure: 'Count of ServiceNow projects mapped to the portfolio group.',
    target: '—',
    whatGoodLooksLike: 'Complete inventory of funded and in-flight SNOW projects.',
    drillInto: null,
  },
  {
    id: 'spm-ado',
    label: 'SPM projects being managed in ADO',
    whatWeMeasure:
      'Share of SPM items that have initiatives, epics, or features reflected in Azure DevOps.',
    target: '100%',
    whatGoodLooksLike: 'Every SPM project is actively managed in ADO with a clear backlog.',
    drillInto: 'D1 – Area Path Alignment',
  },
  {
    id: 'ado-link',
    label: 'ADO work that links to an SPM project',
    whatWeMeasure:
      'Share of ADO backlog items that are traceable to a funded SPM project reference.',
    target: '≥80%',
    whatGoodLooksLike: 'Backlog work is clearly linked to funded portfolio outcomes.',
    drillInto: 'D3 – Item Quality',
  },
  {
    id: 'people',
    label: 'Total People',
    whatWeMeasure: 'Headcount assigned to the portfolio group.',
    target: '—',
    whatGoodLooksLike: 'Accurate ownership of delivery capacity by portfolio.',
    drillInto: 'D4 – BP Ownership',
  },
  {
    id: 'ado-users',
    label: 'People using ADO',
    whatWeMeasure: 'Share of people who have made at least one change in Azure DevOps.',
    target: '≥80%',
    whatGoodLooksLike: 'Teams are actively using ADO to manage and update their work.',
    drillInto: 'D5 – ADO Activity',
  },
] as const;

/**
 * Mock baseline inspired by the Delivery Health Scorecard spreadsheet.
 * Values mirror the sheet’s RAG patterns and hierarchy.
 */
export const scorecardGroups: ScorecardVpGroup[] = [
  {
    id: 'vp-cwc',
    vpName: 'Ching Wan Chiang',
    totals: {
      snowProjects: 304,
      spmManagedInAdoPct: 58,
      adoLinkedToSpmPct: 28,
      totalPeople: 100,
      peopleUsingAdoPct: 40,
    },
    units: [
      {
        id: 'cwc-aviation',
        name: 'Aviation',
        snowProjects: 29,
        spmManagedInAdoPct: 45,
        adoLinkedToSpmPct: 18,
        totalPeople: 50,
        peopleUsingAdoPct: 40,
      },
      {
        id: 'cwc-crm',
        name: 'CRM',
        snowProjects: 84,
        spmManagedInAdoPct: 62,
        adoLinkedToSpmPct: 35,
        totalPeople: 28,
        peopleUsingAdoPct: 55,
      },
      {
        id: 'cwc-applied',
        name: 'Applied Science',
        snowProjects: 112,
        spmManagedInAdoPct: 71,
        adoLinkedToSpmPct: 42,
        totalPeople: 14,
        peopleUsingAdoPct: 48,
      },
      {
        id: 'cwc-pulse',
        name: 'bp pulse',
        snowProjects: 79,
        spmManagedInAdoPct: 55,
        adoLinkedToSpmPct: 22,
        totalPeople: 8,
        peopleUsingAdoPct: 25,
      },
    ],
  },
  {
    id: 'vp-ds',
    vpName: 'David Speed',
    totals: {
      snowProjects: 186,
      spmManagedInAdoPct: 74,
      adoLinkedToSpmPct: 61,
      totalPeople: 92,
      peopleUsingAdoPct: 68,
    },
    units: [
      {
        id: 'ds-platforms',
        name: 'Digital Platforms',
        snowProjects: 64,
        spmManagedInAdoPct: 82,
        adoLinkedToSpmPct: 75,
        totalPeople: 34,
        peopleUsingAdoPct: 80,
      },
      {
        id: 'ds-data',
        name: 'Data Products',
        snowProjects: 51,
        spmManagedInAdoPct: 69,
        adoLinkedToSpmPct: 58,
        totalPeople: 27,
        peopleUsingAdoPct: 72,
      },
      {
        id: 'ds-integration',
        name: 'Enterprise Integration',
        snowProjects: 71,
        spmManagedInAdoPct: 70,
        adoLinkedToSpmPct: 49,
        totalPeople: 31,
        peopleUsingAdoPct: 55,
      },
    ],
  },
  {
    id: 'vp-hb',
    vpName: 'Hannah Barnes',
    totals: {
      snowProjects: 142,
      spmManagedInAdoPct: 81,
      adoLinkedToSpmPct: 77,
      totalPeople: 76,
      peopleUsingAdoPct: 84,
    },
    units: [
      {
        id: 'hb-customer',
        name: 'Customer Experience',
        snowProjects: 48,
        spmManagedInAdoPct: 88,
        adoLinkedToSpmPct: 82,
        totalPeople: 29,
        peopleUsingAdoPct: 90,
      },
      {
        id: 'hb-selfserve',
        name: 'Self Serve Journeys',
        snowProjects: 37,
        spmManagedInAdoPct: 80,
        adoLinkedToSpmPct: 79,
        totalPeople: 22,
        peopleUsingAdoPct: 86,
      },
      {
        id: 'hb-ops',
        name: 'Service Operations',
        snowProjects: 57,
        spmManagedInAdoPct: 75,
        adoLinkedToSpmPct: 70,
        totalPeople: 25,
        peopleUsingAdoPct: 76,
      },
    ],
  },
  {
    id: 'vp-gm',
    vpName: 'Graeme Mean',
    totals: {
      snowProjects: 68,
      spmManagedInAdoPct: 47,
      adoLinkedToSpmPct: 22,
      totalPeople: 100,
      peopleUsingAdoPct: 80,
    },
    units: [
      {
        id: 'gm-trading',
        name: 'Trading Technology',
        snowProjects: 24,
        spmManagedInAdoPct: 40,
        adoLinkedToSpmPct: 15,
        totalPeople: 42,
        peopleUsingAdoPct: 78,
      },
      {
        id: 'gm-risk',
        name: 'Risk Systems',
        snowProjects: 19,
        spmManagedInAdoPct: 52,
        adoLinkedToSpmPct: 28,
        totalPeople: 31,
        peopleUsingAdoPct: 85,
      },
      {
        id: 'gm-markets',
        name: 'Markets Delivery',
        snowProjects: 25,
        spmManagedInAdoPct: 49,
        adoLinkedToSpmPct: 24,
        totalPeople: 27,
        peopleUsingAdoPct: 77,
      },
    ],
  },
  {
    id: 'vp-dsh',
    vpName: 'Dushyant Sharma',
    totals: {
      snowProjects: 1,
      spmManagedInAdoPct: 0,
      adoLinkedToSpmPct: null,
      totalPeople: 100,
      peopleUsingAdoPct: null,
    },
    units: [
      {
        id: 'dsh-incubator',
        name: 'Incubation Portfolio',
        snowProjects: 1,
        spmManagedInAdoPct: 0,
        adoLinkedToSpmPct: null,
        totalPeople: 100,
        peopleUsingAdoPct: null,
      },
    ],
  },
  {
    id: 'vp-pc',
    vpName: 'Philip Cutcliffe',
    totals: {
      snowProjects: 97,
      spmManagedInAdoPct: 66,
      adoLinkedToSpmPct: 54,
      totalPeople: 58,
      peopleUsingAdoPct: 71,
    },
    units: [
      {
        id: 'pc-estate',
        name: 'Estate · Single Pane of Glass',
        snowProjects: 22,
        spmManagedInAdoPct: 85,
        adoLinkedToSpmPct: 78,
        totalPeople: 12,
        peopleUsingAdoPct: 92,
      },
      {
        id: 'pc-bt',
        name: 'Business Transformation',
        snowProjects: 31,
        spmManagedInAdoPct: 58,
        adoLinkedToSpmPct: 41,
        totalPeople: 24,
        peopleUsingAdoPct: 63,
      },
      {
        id: 'pc-design',
        name: 'Design & Enablement',
        snowProjects: 18,
        spmManagedInAdoPct: 72,
        adoLinkedToSpmPct: 60,
        totalPeople: 10,
        peopleUsingAdoPct: 70,
      },
      {
        id: 'pc-platform',
        name: 'Platform Engineering',
        snowProjects: 26,
        spmManagedInAdoPct: 64,
        adoLinkedToSpmPct: 52,
        totalPeople: 12,
        peopleUsingAdoPct: 68,
      },
    ],
  },
];
