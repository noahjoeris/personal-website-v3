export type WorkHistoryItem = {
  company: string
  position: string
  startYear: number
  endYear: number | 'present'
}

export type WorkHistoryData = {
  title: string
  items: readonly WorkHistoryItem[]
}

export const workHistoryData = {
  title: 'WORK HISTORY',
  items: [
    {
      company: 'OPEN SOURCE',
      position: 'BITCOIN ENGINEER',
      startYear: 2026,
      endYear: 'present',
    },
    {
      company: 'VELOCITY LABS',
      position: 'FULL STACK BLOCKCHAIN ENGINEER',
      startYear: 2024,
      endYear: 2026,
    },
    {
      company: 'FREELANCE',
      position: 'WEB3 ENGINEER',
      startYear: 2024,
      endYear: 2024,
    },
    {
      company: 'AIRBUS DEFENCE AND SPACE',
      position: 'SOFTWARE ENGINEER',
      startYear: 2023,
      endYear: 2024,
    },
    {
      company: 'AIRBUS CYBERSECURITY',
      position: 'WORKING STUDENT - CYBER SECURITY',
      startYear: 2019,
      endYear: 2023,
    },
  ],
} as const satisfies WorkHistoryData
