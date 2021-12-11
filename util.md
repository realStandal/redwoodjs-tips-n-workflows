## Utility Functions

Functions and small sets of functions which are entirely application and framework agnostic.

While these functions are not dependent on RedwoodJS themselves, they are built for the environments which RedwoodJS takes advantage of.

* [**Vanilla JS**](#vanilla-js) - Functions made using just JavaScript (TypeScript) - no browser or runtime specific dependencies.
* [**NodeJS**](#nodejs) - Functions which require the [NodeJS](https://nodejs.dev/) runtime.
* [**Web**](#web) - Functions which are intended to run on [modern browsers](https://stackoverflow.com/questions/50829693/what-is-a-modern-browser).

### Vanilla JS

* [`capitalize`](#capitalize)
* [`days`](#days)

#### `capitalize`

```TypeScript
/**
 * Converts the first character in a string `toUpperCase()`.
 */
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1)
```

#### `days`

```TypeScript
/**
 * Returns the (rough) number of seconds in the given number of days.
 */
export const days = (days: number): number => 60 * 60 * 24 * days
```

### NodeJS

* [`randomStr`](#randomStr)

#### `randomStr`

```TypeScript
import { randomInt } from 'crypto'

// This list DOES NOT include URI reserved characters.
// See RFC 3986 section 2.3 for the complete specification.
const RandomCharacters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
const RandomMaxLength = 500

/**
 * Generates a cryptographically secure (using `crypto.randomInt`), random string of characters using `chars` as the dictionary of available characters.
 * By default, `chars` contains all RFC-3986 unreserved URI characters (A-z,1-9,-._~).
 *
 * @param {number} length Must be greater than 0 and less than 500.
 * @param {string} chars Characters used in the randomly generated string.
 */
export const randomStr = (length: number, chars: string = RandomCharacters) => {
  let result = ''

  length = length > RandomMaxLength ? RandomMaxLength : length
  length = 0 >= length ? 1 : length

  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomInt(chars.length - 1))
  }

  return result
}
```

### Web
