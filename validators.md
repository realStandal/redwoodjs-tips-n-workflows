## RedwoodJS Validators

Below are code-snippets for a few, application-agnostic [Service Validators](https://redwoodjs.com/docs/services.html#service-validations).
They are all written in TypeScript.

Some have a dependency on code not provided by RedwoodJS. These imports or code-snippets are included, install any packages from NPM as necessary.

### `valArrayContains`

<details>
 <summary>Show Code</summary>
 
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
</details>

#### `valObjectId`
 
Validate a value is a [BSON](https://docs.mongodb.com/manual/reference/method/ObjectId/) `ObjectId`.

<details>
 <summary>Show Code</summary>

```TypeScript
import { ObjectId } from 'bson'
import { validate, validateWith } from '@redwoodjs/api'

/**
 * Validates the given `val` is a valid BSON ObjectId.
 *
 * @param val
 * @param message An error message when `val` is not a BSON ObjectId.
 */
export const valObjectId = (val: unknown, message: string) => {
  validate(val, { presence: { message: `${message}.required` } })

  validateWith(() => {
    if (typeof val !== 'string' || !ObjectId.isValid(val))
      throw `${message}.invalid`
  })
}
```
</details>

#### `valUUID`
 
Validate a value is a [v4 UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random)) using the [`uuid` package](https://www.npmjs.com/package/uuid).
  
<details>
 <summary>Show Code</summary>
 
```TypeScript
import { validate as isUUID, version as getUUIDVersion } from 'uuid'

import { ServiceValidationError } from '@redwoodjs/api'

/**
 * Validates the given `value` is a [version 4 UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random)).
 *
 * @param value The value to assert is a v4 UUID.
 * @param message The error message, thrown if `value` is not a UUID.
 */
export const validateUUID = (value: unknown, message = 'Invalid ID') => {
  if (
    typeof value !== 'string' ||
    !isUUID(value) ||
    getUUIDVersion(value) !== 4
  ) {
    throw new ServiceValidationError(message)
  }
}
```
</details>
