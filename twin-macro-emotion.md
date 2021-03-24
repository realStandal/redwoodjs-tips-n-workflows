# RedwoodJS using Twin.Macro & Emotion

> An example built using these steps can be found [here](https://github.com/realStandal/redwoodjs-twin-emotion-example).

Setting up [Twin.Macro](https://github.com/ben-rogerson/twin.macro) and [Emotion](https://emotion.sh/) in a RedwoodJS project is very straight-forward. Most of the steps from the [`twin-react-emotion`](https://github.com/ben-rogerson/twin.examples/tree/master/react-emotion) example apply to its use with Redwood.

By the end of this guide, you'll have a RedwoodJS application which lets you write components using Emotion, with styles powered by [TailwindCSS](https://tailwindcss.com/), made-easy via Twin.Macro.

- [RedwoodJS using Twin.Macro & Emotion](#redwoodjs-using-twinmacro--emotion)
- [Setup](#setup)
  - [RedwoodJS](#redwoodjs)
  - [Babel](#babel)
  - [Twin and Emotion](#twin-and-emotion)
- [Code-Modification](#code-modification)
  - [Babel](#babel-1)
  - [TypeScript Support](#typescript-support)
  - [Intentionally Skipping "Add `GlobalStyles`"](#intentionally-skipping-add-globalstyles)
- [Testing it out](#testing-it-out)
  - [`RedBox`](#redbox)
  - [`PossiblyRedBox`](#possiblyredbox)
  - [`GreenBox`](#greenbox)
- [🎉🎉🎉](#)

# Setup

Generating a RedwoodJS project and installing dependencies to meet Twin's needs.

## RedwoodJS

> To test features and show-off where Redwood is at, I'll be generating the new project using TypeScript; the steps to reproduce using JavaScript should be relatively the same, minus the explicit "TypeScript" section found later. You'll ofcourse want to skip the `--no-javascript` flag below, if so.

Starting from the *very* beginning, let's create a blank RedwoodJS application-written in TypeScript-using:

```bash
$ yarn create redwood-app APP_NAME --no-javascript
```

With a project created, enter it and start by setting up TailwindCSS:

```bash
$ cd APP_NAME/
$ yarn rw setup tailwind
```

## Babel

Redwood already includes `@babel/core`, so we'll only need to install `@emotion/babel-plugin-jsx-pragmatic` and explicitly define `babel-plugin-macros` as a dependency.

> Using `yarn why babel-plugin-macros` reveals the dependency is already present, hoisted up from Redwood's use of Storybook; we're including it to ensure it remains given any changes to Redwood's API or dependencies. I think it's safe to say `@babel/core` will stick around.

We'll begin by entering the *web*-side of our Redwood project. **We'll be sticking to the *web*-side for the remainder of this guide.**

```bash
$ cd web/
```

Now we'll install the dependencies, adding both as `devDependencies`:

```bash
$ yarn add -D @emotion/babel-plugin-jsx-pragmatic babel-plugin-macros
```

## Twin and Emotion

Next we'll install Twin.Macro and Emotion in two parts.

Twin will come first; [it only runs at compile-time](https://github.com/ben-rogerson/twin.macro#how-it-works), so it gets added as a `devDependency`

```bash
$ yarn add -D twin.macro
```

Now we'll finish off our installation-steps by adding the Emotion `dependencies` we'll need:

```bash
$ yarn add @emotion/react @emotion/styled
```

> At this point we're finished installing dependencies. To be on the safe side, you may want to delete all `node_modules` directories from your project and re-run `yarn install` from the root of your project.

# Code-Modification

The easy part.

## Babel

Now let's setup Twin.Macro's [babel configuration](https://github.com/ben-rogerson/twin.examples/tree/master/react-emotion#add-the-babel-config).

We'll be modifying `web/.babelrc.js` to contain the following:

```JavaScript
module.exports = {
  extends: "../babel.config.js",
  plugins: [
    "babel-plugin-macros",
    [
      "@emotion/babel-plugin-jsx-pragmatic",
      {
        export: "jsx",
        import: "__cssprop",
        module: "@emotion/react",
      }
    ],
    [
      "@babel/plugin-transform-react-jsx",
      {
        pragma: "__cssprop",
        pragmaFrag: "React.Fragment"
      }
    ]
  ]
}
```

> The above configuration will automatically inject a [jsx pragma](https://emotion.sh/docs/css-prop#jsx-pragma) to the top of all applicable source-files. To manually specify the pragma in each file, follow Babel-config instruction B) from the [`twin-react-emotion` guide](https://github.com/ben-rogerson/twin.examples/tree/master/react-emotion#add-the-babel-config).

## TypeScript Support

> Remember when I said there was a step you may want to skip if you decided to go the JavaScript route? This is that step.

In `web/src/`, add a file named `twin.d.ts`, filling it with the following:

```TypeScript
// web/src/twin.d.ts
import 'twin.macro'
import styledImport from '@emotion/styled'
import { css as cssImport } from '@emotion/react'

declare module 'twin.macro' {
  // The styled and css imports
  const styled: typeof styledImport
  const css: typeof cssImport
}
```

More information on why this is needed can be found in the [`twin-react-emotion` guide](https://github.com/ben-rogerson/twin.examples/tree/master/react-emotion#complete-the-typescript-setup).

We'll round-off the TypeScript configuration by adding `jsxImportSource` set to `"@emotion/react"` to `web/tsconfig.json`:

```YAML
{
  "compilerOptions": {
    // ...
    "types": ["jest"],
    "jsx": "preserve",
    "jsxImportSource": "@emotion/react"
  }
}
```

## Intentionally Skipping "Add `GlobalStyles`"

[Twin.Macro's guide](https://github.com/ben-rogerson/twin.examples/tree/master/react-emotion#add-the-global-styles) has you include [preflight base styles](https://unpkg.com/tailwindcss/dist/base.css) using a `<GlobalStyles>` component at the root of a project.

Instead, I'm going to suggest you use the definition RedwoodJS provides when you `setup tailwind`. As the linked-guide says, these are the same styles.

> I ran into issues *seeing* these styles; I didn't get any errors or warnings pointing me in a direction as to why.

# Testing it out

Let's test out our hard-work using Storybook and Redwood's built-in component-generator.

We'll create two components, they'll be incredibly complex, so buckle up.

```bash
$ yarn rw g component RedBox --typescript
$ yarn rw g component PossiblyRedBox --typescript
$ yarn rw g component GreenBox --typescript
```

## `RedBox`

```TypeScript
// web/src/components/RedBox/RedBox.tsx
import tw from 'twin.macro'

const RedBox = tw.div`bg-red-500`

export default RedBox
```

```TypeScript
// web/src/components/RedBox/RedBox.stories.tsx
import RedBox from './RedBox'

const text = 'The text of a red box.'

export const generated = () => {
  return <RedBox>{text}</RedBox>
}

export default { title: 'Components/RedBox' }
```

## `PossiblyRedBox`

```TypeScript
// web/src/components/PossiblyRedBox/PossiblyRedBox.tsx
import tw, { styled } from 'twin.macro'

export interface PossiblyRedBoxProps {
  red?: boolean
}

const PossiblyRedBox = styled.div<PossiblyRedBoxProps>`
  ${({ red }) => red && tw`bg-red-500`}
`

export default PossiblyRedBox
```

```TypeScript
// web/src/components/PossiblyRedBox/PossiblyRedBox.stories.tsx
import PossiblyRedBox from './PossiblyRedBox'

const text = 'The text of a possibly red box.'

export const NotRed = () => {
  return <PossiblyRedBox>{text}</PossiblyRedBox>
}

export const Red = () => {
  return <PossiblyRedBox red>{text}</PossiblyRedBox>
}

export default { title: 'Components/PossiblyRedBox' }
```

## `GreenBox`

```TypeScript
// GreenBox.tsx
import tw, { css } from 'twin.macro'

const bgStyles = css`
  & {
    ${tw`bg-green-500`}
  }
`

const GreenBox = ({ children }) => <div css={bgStyles}>{children}</div>

export default GreenBox
```

```TypeScript
// GreenBox.stories.tsx
import GreenBox from './GreenBox'

const text = 'The text of a green box.'

export const generated = () => {
  return <GreenBox>{text}</GreenBox>
}

export default { title: 'Components/GreenBox' }
```

# 🎉🎉🎉

You can use `yarn rw storybook` to view the examples.
