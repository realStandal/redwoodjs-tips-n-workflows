# Password Strength Field

This component uses [`zxcvbn-ts`](https://zxcvbn-ts.github.io/zxcvbn/) and [Redwood's `PasswordField`](https://redwoodjs.com/docs/forms.html#overview) to validate a password meets a configurable, minimum unguessability-rating.

It will also display a "strength-meter", hinting to the end-user their current password's releative level of unguessability.

> This directory also contains `lib/zxcvbn.ts`. It should be placed at `src/lib/zxcvbn.ts`. It contains a function which will [lazy load zxcvbn's dictionaries](https://zxcvbn-ts.github.io/zxcvbn/guide/lazy-loading/) when this component is used, helping to boost your application's performance.

## Dependencies

* [zxcvbn-ts](https://zxcvbn-ts.github.io/zxcvbn/)
* [TailwindCSS](https://redwoodjs.com/docs/webpack-configuration.html#tailwind-css) (changes to swap out located in `PasswordStrengthField.css`)
* [postcss-nested](https://github.com/postcss/postcss-nested) (changes to swap out located in `PasswordStrengthField.css`)
* [clsx]() (optional, with slight modification)

## Example Use

> See [`result.score`](https://zxcvbn-ts.github.io/zxcvbn/guide/getting-started/#output) for an explanation as to the expected values of `value`, used in the strength validation below.

```TSX
export const MyPage = () => {
  return (
    <PasswordStrengthField
      autoComplete="new-password"
      name="password"
      // ...
      validation={{
        strength: {
          message: 'Your password does not meet the minimum strength requirement.',
          value: 3, // my recommended "green zone"
        },
        // ...
      }}
    />
  )
}
```
