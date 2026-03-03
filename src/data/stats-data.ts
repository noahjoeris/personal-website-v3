export type StatsItem = {
  value: string
  description: string
}

export type StatsData = {
  srTitle: string
  items: readonly StatsItem[]
}

export const statsData = {
  srTitle: 'Stats',
  items: [
    {
      value: '6Y+',
      description: 'SOFTWARE ENGINEERING EXPERIENCE IN CYBER SECURITY, CLOUD, WEB3 AND MORE',
    },
    {
      value: '270H+',
      description:
        'BLOCKCHAIN ENGINEERING COHORT TAUGHT BY LEADING POLKADOT DEVS AT POLKADOT BLOCKCHAIN ACADEMY IN HONG KONG',
    },
    {
      value: '$10M+',
      description: 'IN ASSETS MOVED THROUGH DAPPS I BUILT IN THE POLKADOT ECOSYSTEM',
    },
    {
      value: '1 MISSION',
      description: 'BUILD TOOLS THAT STRENGTHEN FINANCIAL FREEDOM AND DIGITAL RESILIENCE',
    },
  ],
} as const satisfies StatsData
