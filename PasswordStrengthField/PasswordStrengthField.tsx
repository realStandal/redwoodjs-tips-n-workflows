import clsx from 'clsx'
import { useEffect, useState } from 'react'
import type { ComponentPropsWithoutRef as ComponentProps } from 'react'
import { PasswordField, useWatch } from '@redwoodjs/forms'
import type { RegisterOptions } from '@redwoodjs/forms'
import { zxcvbn } from '@zxcvbn-ts/core'
import type { ZxcvbnResult } from '@zxcvbn-ts/core'

import { loadZxcvbn } from 'src/lib/zxcvbn'

import './PasswordStrengthField.css'

interface ValidationOptions extends RegisterOptions {
  strength: {
    message: string
    value: number
  }
}

interface PasswordStrengthFieldProps
  extends ComponentProps<typeof PasswordField> {
  validation: ValidationOptions
}

export default ({
  name,
  validation: { strength: validateStrength, ...validation },
  ...props
}: PasswordStrengthFieldProps) => {
  const password = useWatch({ name })

  const [strength, setStrength] = useState<ZxcvbnResult>()

  useEffect(() => {
    const _ = async () => {
      await loadZxcvbn()
    }

    _()
  }, [])

  useEffect(() => {
    const getStrength = async () => {
      const res = await zxcvbn(password)
      setStrength(res)
    }

    if (typeof password === 'string') {
      getStrength()
    }
  }, [password, setStrength])

  return (
    <>
      <PasswordField
        name={name}
        validation={{
          validate: () =>
            strength?.score >= validateStrength.value ||
            validateStrength.message,
          ...validation,
        }}
        {...props}
      />
      <div
        className={clsx('strength-meter', `strength-score-${strength?.score}`)}
      >
        <span className={clsx(strength?.score > 0 && 'active')} />
        <span className={clsx(strength?.score > 1 && 'active')} />
        <span className={clsx(strength?.score > 2 && 'active')} />
        <span className={clsx(strength?.score > 3 && 'active')} />
      </div>
    </>
  )
}
