# RedwoodJS - Tips & Workflows

These are step-by-steps which I consider rough, jotted-down notes I've taken while using the [RedwoodJS framework](https://redwoodjs.com/).
Many of these documents may also be found on the [RedwoodJS forum](https://community.redwoodjs.com).

## Table of Contents

* DX
  * [Modified `settings.json`](./settings.json)
  * [Dockerfile](./Dockerfile)
* API
  * Middleware 
    * [Relation Middleware](./relation-middleware)
  * [Validators](./validators.md)
  * [Utility](./util.md)
* Web
  * "Blog" Entries
    * [Atomic: UI Workflow](./atomic.md#atomic)
    * [Form Workflows](./form-workflows.md#form-workflows) (Dated)
    * [Testing Forms](./testing-forms-source)
  * Components
    * [`<PasswordStrengthField>`](./PasswordStrengthField)
      * Demonstrates building user-land `<Form>` components which have custom `validation={}` options.
  * Hooks
    * [`useColumnBreakpoint`](./useColumnBreakpoint.md)
    * [`useStateCallback`](./useStateCallback.ts)
    * [`useToast`](./useToast.ts)
    * [`useToastMutation`](./useToastMutation.ts)
    * [`useToggle`](./useToggle.ts)

### To-be-written

- Essentail Storybook addons
- Generator Templates
- 🔑 to using TypeScript
- Multi-tenancy architecture and authentication
- Service resolver naming best practices
- UUIDs over auto-increment
- Using i18next
- Finding front-end design inspiration
- Running RedwoodJS in containers
- Fixing TailwindCSS' flickering dark-mode
- CASL.js integration (Prisma, React, ...)
- Audit logging
- E-mailing and templating

### Archive

* [Twin.Macro and Emotion](./twin-macro-emotion.md) ([Twin](https://github.com/ben-rogerson/twin.macro) | [Emotion](https://github.com/emotion-js/emotion))
