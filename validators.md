## RedwoodJS Validators

Below are code-snippets for a few, application-agnostic [Service Validators](https://redwoodjs.com/docs/services.html#service-validations).
They are all written in TypeScript.

Some have a dependency on code not provided by RedwoodJS. This imports or code-snippets are included, install any packages from NPM as necessary.

### Table of Contents

* [`valLatin`](#valLatin)
* [`valLen`](#valLen)
* [`valUUID`](#valUUID)
* [`valArrayContains`](#valArrayContains)

#### `valLatin`

```TypeScript
import { validate } from '@redwoodjs/api'

/**
 * Ensures `val` is a string of (modern) [latin characters](https://en.wikipedia.org/wiki/Latin_alphabet).
 *
 * @param val The value to validate
 * @param message A string prepended to error messages.
 * @param between A minimum and maximum length
 *
 * @throws
 * * 'message.length' - When `val.length` is not `between`.
 * * 'message.invalid' - When `val` contains a non-latin character.
 */
export const valLatin = (
  val: unknown,
  message: string,
  between: [number, number] = [0, 50]
) =>
  validate(val, {
    length: { between, message: `${message}.length` },
    format: { pattern: /^[A-Za-z]+$/, message: `${message}.invalid` },
  })
```

#### `valLen`

```TypeScript
import { validate } from '@redwoodjs/api'

/**
 * Convenience wrapper around [`validate(val, { length: ... })`](https://redwoodjs.com/docs/services.html#length).
 *
 * @param val The value to validate
 * @param message A string prepended to error messages.
 * @param between A minimum and maximum length
 *
 * @throws
 * * 'message.length' - When `val.length` is not `between`.
 */
export const valLen = (
  val: unknown,
  message: string,
  between: [number, number] = [0, 50]
) =>
  validate(val, {
    length: { between, message: `${message}.length` },
  })
```

#### `valUUID`

```TypeScript
import { validate as validateUUID } from 'uuid'
import { validate, validateWith } from '@redwoodjs/api'

/**
 * @param val
 * @param message A string to be appended to the `message` of validation errors.
 * @throws
 * * `message.id.required` - When `val` is `undefined`.
 * * `message.id.invalid` - When `val` is not a `string` or valid UUID.
 */
export const valUUID = (val: unknown, message: string) => {
  validate(val, {
    presence: { message: `${message}.id.required` },
  })

  validateWith(() => {
    if (typeof val !== 'string' || !validateUUID(val))
      throw `${message}.id.invalid`
  })
}
```

### `valArrayContains`

```TypeScript
import { validateWith } from '@redwoodjs/api'

/**
 * Ensures the array `val` contains values only found in `allowed`.
 *
 * This **does not** validate `val` contains all of `allowed`.
 *
 * @param value The value to be validated.
 * @param allowed An array of allowed values.
 * @param message An error message to throw if `value` contains a value not found in `allowed`.
 * @throws
 * * 'message.invalid' - When `val` is not a valid array.
 * * 'message.allowed' - When `val` contains a value not found in `allowed`.
 */
export const valArrayContains = <T = unknown>(
  val: Array<T>,
  allowed: Array<T>,
  message: string
) => {
  validateWith(() => {
    if (!Array.isArray(val)) throw `${message}.invalid`
  })

  validateWith(() => {
    if (val.some((arrayVal) => !allowed.includes(arrayVal)))
      throw `${message}.allowed`
  })
}
```
