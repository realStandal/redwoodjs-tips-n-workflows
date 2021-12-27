import { ZxcvbnOptions } from '@zxcvbn-ts/core'

/**
 * Facilitates splitting zxcvbn's common and language-specific dictionaries into seperate chunks,
 * to be loaded when required - not at once with the rest of the application.
 */
export const loadZxcvbn = async () => {
  const common = await import('@zxcvbn-ts/language-common')
  const en = await import('@zxcvbn-ts/language-en')

  const options = {
    dictionary: {
      ...common.default.dictionary,
      ...en.default.dictionary,
    },
    graphs: common.default.adjacencyGraphs,
    translations: en.default.translations,
  }

  ZxcvbnOptions.setOptions(options)
}
