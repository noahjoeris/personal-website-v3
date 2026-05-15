export type QuoteData = {
  text: string
  author: string
}

export const quoteData = {
  text: "I don't believe that we shall ever have a good money again before we take the thing out of the hands of government, and since we can't take them violently out of the hands of government, all we can do is by some sly roundabout way introduce something they can't stop.",
  author: 'Friedrich Hayek',
} as const satisfies QuoteData
