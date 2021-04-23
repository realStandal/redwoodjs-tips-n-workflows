import type { Meta, Story } from '@storybook/react'

import OurForm from './OurForm'
import type { OurFormProps } from './OurForm'

export default {
  title: 'Components/OurForm',
  component: OurForm,
  argTypes: {
    onInvalid: {
      action: 'onInvalid',
    },
    onSubmit: {
      action: 'onSubmit',
    },
  },
} as Meta

const Template: Story<OurFormProps> = (args) => <OurForm {...args} />

export const Default = Template.bind({})
