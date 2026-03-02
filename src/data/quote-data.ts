export type QuoteData = {
  text: string
  author: string
}

export const quoteData = {
  text: "What we're actually striving to create are resilient systems that can genuinely benefit society. In a world facing potentially disruptive challenges, these systems are designed to hold up and continue supporting the freedoms we've come to value over the years.",
  author: 'Gavin Wood',
} as const satisfies QuoteData
