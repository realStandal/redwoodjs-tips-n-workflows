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
  validation: { strength: validateStrength, ...validation },
  ...props
}: PasswordStrengthFieldProps) => {
  const fields = useWatch() as { password?: string }

  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [strength, setStrength] = useState<ZxcvbnResult>()

  // Load zxcvbn's options when the component mounts.
  useEffect(() => {
    const _ = async () => {
      await loadZxcvbn()
    }

    _()
  }, [])

  // When `fields` changes, re-compute the strength of the given password.
  // For performance reasons, this computation only takes place in certain situations.
  useEffect(() => {
    const getStrength = async (password: string) => {
      const res = await zxcvbn(password)
      setStrength(res)
    }

    if (typeof fields === 'object') {
      const { password } = fields

      if (typeof password === 'string' && password !== currentPassword) {
        setCurrentPassword(password)
        getStrength(password)
      }
    }
  }, [currentPassword, fields, setCurrentPassword, setStrength])

  return (
    <>
      <PasswordField
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
