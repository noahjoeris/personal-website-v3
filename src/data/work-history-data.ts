export type WorkHistoryItem = {
  company: string
  position: string
  duration: string
  imgUrl: `/images/work-history/${string}`
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
      duration: '2026-PRESENT',
      imgUrl: '/images/work-history/bitcoin.svg',
    },
    {
      company: 'VELOCITY LABS',
      position: 'FULL STACK BLOCKCHAIN ENGINEER',
      duration: '2024-2026',
      imgUrl: '/images/work-history/velocity-labs.png',
    },
    {
      company: 'FREELANCE',
      position: 'WEB3 ENGINEER',
      duration: '2024',
      imgUrl: '/images/work-history/freelance.ico',
    },
    {
      company: 'AIRBUS DEFENCE AND SPACE',
      position: 'SOFTWARE ENGINEER',
      duration: '2023-2024',
      imgUrl: '/images/work-history/airbus-defence-space.jpeg',
    },
    {
      company: 'AIRBUS CYBERSECURITY',
      position: 'WORKING STUDENT - CYBER SECURITY',
      duration: '2019-2023',
      imgUrl: '/images/work-history/airbus-cybersecurity.webp',
    },
  ],
} as const satisfies WorkHistoryData
