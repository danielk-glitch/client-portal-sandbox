import brivityMarkBlack from './brivity-mark-black.svg'
import brivityMarkDefault from './brivity-mark-default.svg'
import brivityWordmarkBlack from './brivity-wordmark-black.svg'
import brivityWordmarkDefault from './brivity-wordmark-default.svg'
import placeMarkDefault from './place-mark-default.svg'
import placeWordmarkDefault from './place-wordmark-default.svg'

export const brandAssets = {
  brivity: {
    markBlack: brivityMarkBlack,
    markDefault: brivityMarkDefault,
    wordmarkBlack: brivityWordmarkBlack,
    wordmarkDefault: brivityWordmarkDefault,
  },
  place: {
    markDefault: placeMarkDefault,
    wordmarkDefault: placeWordmarkDefault,
  },
} as const
