## RedwoodJS Validators

Below are code-snippets for a few, application-agnostic [Service Validators](https://redwoodjs.com/docs/services.html#service-validations).
They are all written in TypeScript.

Some have a dependency on code not provided by RedwoodJS. These imports or code-snippets are included, install any packages from NPM as necessary.

### Table of Contents

* [`valArrayContains`](#valArrayContains)
* [`valUUID`](#valUUID)

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

#### `valObjectId`

```TypeScript
import { ObjectId } from 'bson'
import { validate, validateWith } from '@redwoodjs/api'

/**
 * Validates the given `val` is a valid BSON ObjectId.
 *
 * @param val
 * @param message A string to be appended to the `message` of validation errors.
 * @throws
 * * `message.required` - When `val` is `undefined`.
 * * `message.invalid` - When `val` is not a `string` or valid BSON ObjectId.
 */
export const valObjectId = (val: unknown, message: string) => {
  validate(val, { presence: { message: `${message}.required` } })

  validateWith(() => {
    if (typeof val !== 'string' || !ObjectId.isValid(val))
      throw `${message}.invalid`
  })
}
```

#### `valUUID`

```TypeScript
import { validate as validateUUID } from 'uuid'
import { validate, validateWith } from '@redwoodjs/api'

/**
 * Validates the given `val` is a valid UUID.
 *
 * @param val
 * @param message A string to be appended to the `message` of validation errors.
 * @throws
 * * `message.required` - When `val` is `undefined`.
 * * `message.invalid` - When `val` is not a `string` or valid UUID.
 */
export const valUUID = (val: unknown, message: string) => {
  validate(val, { presence: { message: `${message}.required` } })

  validateWith(() => {
    if (typeof val !== 'string' || !validateUUID(val))
      throw `${message}.invalid`
  })
}
```
