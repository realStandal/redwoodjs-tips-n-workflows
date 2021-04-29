import { render, screen, waitFor } from '@redwoodjs/testing'
import user from '@testing-library/user-event'

import FormTest from './FormTest'

describe('FormTest', () => {
  it('renders successfully', () => {
    expect(() => {
      const onSubmit = jest.fn()

      render(<FormTest onSubmit={onSubmit} />)
    }).not.toThrow()
  })

  it('does not submit when required fields are empty', async () => {
    const onSubmit = jest.fn((d) => console.log(d))

    render(<FormTest onSubmit={onSubmit} />)

    const submitButton = screen.getByText('Submit')

    await waitFor(() => user.click(submitButton))

    // expect(onSubmit).toHaveBeenCalledTimes(0) - Redundant.
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits when required fields are entered', async () => {
    const name = 'My Name'
    const nickname = ''

    const onSubmit = jest.fn()

    render(<FormTest onSubmit={onSubmit} />)

    const nameField = screen.getByPlaceholderText('Name')
    const submitButton = screen.getByText('Submit')

    await waitFor(() => user.type(nameField, name))
    await waitFor(() => user.click(submitButton))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith({ name, nickname })
  })

  it('submits with the expected, entered data', async () => {
    const name = 'My Name'
    const nickname = 'My Nickname'

    const onSubmit = jest.fn()

    render(<FormTest onSubmit={onSubmit} />)

    const nameField = screen.getByPlaceholderText('Name')
    const nicknameField = screen.getByPlaceholderText('Nickname')
    const submitButton = screen.getByText('Submit')

    await waitFor(() => user.type(nameField, name))
    await waitFor(() => user.type(nicknameField, nickname))
    await waitFor(() => user.click(submitButton))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith({ name, nickname })
  })
})
