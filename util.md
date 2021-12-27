## Utility Functions

Functions and small sets of functions which are entirely application and framework agnostic.

While these functions are not dependent on RedwoodJS themselves, they are built for the environments which RedwoodJS takes advantage of.

* [**Vanilla JS**](#vanilla-js) - Functions made using just JavaScript (TypeScript) - no browser or runtime specific dependencies.
* [**NodeJS**](#nodejs) - Functions which require the [NodeJS](https://nodejs.dev/) runtime.
* [**Web**](#web) - Functions which are intended to run on [modern browsers](https://stackoverflow.com/questions/50829693/what-is-a-modern-browser).
  * Theoretically, these functions also work in the Deno runtime. This may require minor changes to the API's used.

Functions defined here try to only depend upon the platform which they are designed for. Any deviance from this path are noted.

## Vanilla JS

#### `capitalize`

Convert the first character in a string `toUpperCase`.

<details>
 <summary>Show Code</summary>
 
```TypeScript
/**
 * Converts the first character in a string `toUpperCase()`.
 */
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1)
```
</details>

#### `lowercase`

Convert the first character in a string `toLowerCase`.

<details>
 <summary>Show Code</summary>
 
 ```TypeScript
/**
  * Convert the first character in a string `toLowerCase`.
  */
const lowercase = (str: string): string =>
  str.charAt(0).toLowerCase() + str.slice(1)
 ```
</details>
 
## NodeJS

#### `randomStr`

Generate a cryptographically-secure* random string using characters from a provided, or default, dictionary.

<details>
 <summary>Show Code</summary>
 
```TypeScript
import { randomInt } from 'crypto'

// This list DOES NOT include URI reserved characters.
// See RFC 3986 section 2.3 for the complete specification.
const RandomCharacters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
const RandomMaxLength = 500

// Maximum length of the character dictionary.
// This is a hard-limit as its imposed by the underlying `randomInt`.
const RandomMaxCharsLength = 248

/**
 * Generates a cryptographically secure (using `crypto.randomInt`),
 * random string of characters using `chars` as the dictionary of available characters.
 * By default, `chars` contains all RFC-3986 unreserved URI characters (A-z,1-9,-._~).
 *
 * **Note:** The maximum number of characters which may be present in the dictionary is `247`.
 *
 * @param {number} length Must be greater than 0 and less than 500.
 * @param {string} chars Characters used in the randomly generated string.
 */
export const randomStr = (length: number, chars: string = RandomCharacters) => {
  if (chars.length > RandomMaxCharsLength) {
    chars = chars.slice(0, RandomMaxCharsLength - 1)
  }

  let result = ''

  length = length > RandomMaxLength ? RandomMaxLength : length
  length = 0 >= length ? 1 : length

  for (let i = 0; i < length; i++) {
    const seed = randomInt(chars.length - 1)
    result += chars.charAt(seed)
  }

  return result
}
```
</details>

#### `qp`
 
Convinence function to access  the query string parameters of an (AWS) HTTP event.

<details>
 <summary>Show Code</summary>
 
```TypeScript
import type { APIGatewayProxyEvent as Event } from 'aws-lambda'

/**
 * Convinence function to access the query string parameters of an (AWS) HTTP `event`,
 * returning the value held by `param`.
 *
 * A generic can be provided to easily type the returned value.
 * The given type must extend `string`.
 */
export const qp = <T extends string>(
  event: Event,
  param: string
): T | undefined => event.queryStringParameters[param] as T
```
</details>

## Web

#### `randomStr`

Generate a cryptographically-secure* random string using characters from a provided, or default, dictionary.
 
<details>
 <summary>Show Code</summary>
 
```TypeScript
// This list DOES NOT include URI reserved characters.
// See RFC 3986 section 2.3 for the complete specification.
const RandomCharacters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
const RandomMaxLength = 500

// Maximum value of an 8-bit (unsigned) integer
// This value should be updated if `Uint8Array` is swapped out, below
const RandomMaxSeedValue = 255

/**
 * Generates a cryptographically secure (using `window.crypto.getRandomValues`),
 * random string of characters using `chars` as the dictionary of available characters.
 * By default, `chars` contains all RFC-3986 unreserved URI characters (A-z,1-9,-._~).
 *
 * @param {number} length Must be greater than 0 and less than 500.
 * @param {string} chars Characters used in the randomly generated string.
 */
export const randomStr = (length: number, chars: string = RandomCharacters) => {
  let result = ''

  length = length > RandomMaxLength ? RandomMaxLength : length
  length = 0 >= length ? 1 : length

  const tree = new Uint8Array(length) // trees are now list
  window.crypto.getRandomValues(tree)

  // could just as easily be a for-loop that iterates `length` times
  tree.forEach((cone) => {
    // scale the random-value (0-255) to fit the available chars (0-(chars.length - 1))
    const seed = Math.floor((cone * (chars.length - 1)) / RandomMaxSeedValue)
    result += chars.charAt(seed)
  })

  return result
}
```
</details>

 ---
 
 > \* - The generated string will have all the nessecary steps taken to ensure high-entropy generation, given the constraints imposed by the respective environments and the access to entropic data provided by the underlying machine.
 
