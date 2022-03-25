# Atomic

This document provides links and installation steps for _Atomic_: a workflow for creating accessible, easy-to-build user interfaces for web applications.

> Just to make sure it's clear: You don't _need_ to use every-single dependency Atomic has selected for you. It's more than appropriate to mix-and-match based on your application's individual needs - or use a technology more familiar to you (and your team).

## Iconography

* [Bootstrap Icons](https://icons.getbootstrap.com/)
* [Heroicons](https://heroicons.com/)
* [Material Community Icons](https://materialdesignicons.com/) (Fallback)

## Dependencies

Atomic suggests for your application additional dependencies, each providing a unique set of features which can be interoperated together. These packages have been selected for their: re-usability, open licenses, community support, and adherence to the [separation of concerns principle](https://en.wikipedia.org/wiki/Separation_of_concerns).

* [clsx](https://github.com/lukeed/clsx#readme) - (a tiny) Utility for constructing `className` strings conditionally.
* [Floating UI](https://github.com/floating-ui/floating-ui#readme) - Low-level library for positioning "floating" elements like tooltips, popovers, dropdowns, menus and more.
* [HeadlessUI](https://github.com/tailwindlabs/headlessui#readme) - Completely unstyled, fully accessible UI components.
* [React Loading Skeleton](https://github.com/dvtng/react-loading-skeleton#readme) - Make beautiful, animated loading skeletons that automatically adapt to your app.
* [React Table (v7)](https://github.com/tanstack/react-table/tree/v7#readme) - Hooks for building lightweight, fast and extendable datagrids for React.
* [Recoil](https://github.com/facebookexperimental/Recoil#readme) - (experimental) State-management utilities for React.
  * Recoil should be considered [an advanced API](https://recoiljs.org/docs/introduction/motivation). See the [Context API](https://reactjs.org/docs/context.html) for a more general state-management solution.
* [SASS/SCSS](https://github.com/sass/sass#readme) - Extension of CSS, adding nested rules, variables, mixins, selector inheritance, and more.
* [TailwindCSS](https://github.com/tailwindlabs/tailwindcss#readme) - A utility-first CSS framework for rapidly building custom user interfaces.

### Installation (pt. 1)

> All installation steps assume you're at the root of your RedwoodJS application.

First, we'll setup our development-time dependencies. This includes SASS and TailwindCSS.

#### TailwindCSS

[RedwoodJS comes with native support for TailwindCSS](https://redwoodjs.com/docs/cli-commands#setup-ui). All that's required is to run the corresponding setup command.

```
yarn rw setup ui tailwindcss
```

#### SASS

RedwoodJS comes with native support for SCSS. You'll just need to complete a few steps to enable this support.

First, install `sass` and `sass-loader`.

```
yarn workspace web add -D sass sass-loader
```

Then, in your application's `App.*` entrypoint, switch out the generated `index.css` for an `index.sass` or `index.scss` file.

```diff
// App.{tsx|js|jsx}

import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

...

- import 'src/index.css'
+ import 'src/index.scss'

const App = ...
```

### Installation (pt. 2)

Now we'll install our runtime dependencies.

First, we'll add all of our npm packages in one-go, and then we'll take care of setting up any of the individual packages.

```
yarn workspace web add clsx react-loading-skeleton react-table recoil @floating-ui/react-dom @headlessui/react 
```

#### React Loading Skeleton

`react-loading-skeleton` requires you to import its provided CSS, to enable minimal styling.

```diff
// App.{tsx|js|jsx}

import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

+ import 'react-loading-skeleton/dist/skeleton.css'

const App = ...
```

(optionally) You can then customize its styling, enabling support for [dark-mode](https://tailwindcss.com/docs/dark-mode).

```diff
// index.{sass|scss}

@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

...

@layer base {
+ .react-loading-skeleton {
+   --base-color: #F4F4F6 !important;
+   --highlight-color: #E5E5EB !important;
+
+   .dark & {
+     --base-color: #2C2E3F !important;
+     --highlight-color: #43465B !important;
+   }
+ }
}

```

#### Recoil

To make our global state accessible throughout our application, we'll need to wrap our app in the `RecoilRoot` component.

```diff
// App.{tsx|js|jsx}

+ import { RecoilRoot } from 'recoil'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

const App = () => {
  ...
    <RedwoodApolloProvider>
+     <RecoilRoot>
        <Routes />
+     </RecoilRoot>
    </RedwoodApolloProvider>
  ...
}
```
