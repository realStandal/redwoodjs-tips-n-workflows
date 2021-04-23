import user from '@testing-library/user-event'
import { render, screen, waitFor } from '@redwoodjs/testing'

import OurForm from './OurForm'

describe('OurForm', () => {
  it('renders successfully', () => {
    const onSubmit = jest.fn()
    const onInvalid = jest.fn()

    expect(() =>
      render(<OurForm onInvalid={onInvalid} onSubmit={onSubmit} />)
    ).not.toThrow()
  })

  it('triggers invalid when required fields are empty', async () => {
    const onSubmit = jest.fn()
    const onInvalid = jest.fn()

    render(<OurForm onInvalid={onInvalid} onSubmit={onSubmit} />)

    const submitButton = screen.getByText('Submit') // Or, a localization key: Signup.Form.submit
    await waitFor(() => user.click(submitButton))

    expect(onInvalid.mock.calls.length).toBe(1)
    expect(onSubmit.mock.calls.length).toBe(0)
  })

  it('triggers submit when required fields are populated', async () => {
    const name = 'Malcolm McCormick'
    const nickname = ''

    const onSubmit = jest.fn()
    const onInvalid = jest.fn()

    render(<OurForm onInvalid={onInvalid} onSubmit={onSubmit} />)

    const nameField = screen.getByPlaceholderText('Name') // Or a localization key: OurForm.name.placeholder
    const submitButton = screen.getByText('Submit')

    await waitFor(() => user.type(nameField, name))
    await waitFor(() => user.click(submitButton))

    expect(onInvalid).toHaveBeenCalledTimes(0)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({ name, nickname })
  })

  it('triggers submit with full results', async () => {
    const name = 'Malcolm McCormick'
    const nickname = 'Mac Miller'

    const onSubmit = jest.fn()
    const onInvalid = jest.fn()

    render(<OurForm onInvalid={onInvalid} onSubmit={onSubmit} />)

    const nameField = screen.getByPlaceholderText('Name')
    const nicknameField = screen.getByPlaceholderText('Nickname')
    const submitButton = screen.getByText('Submit')

    await waitFor(() => user.type(nameField, name))
    await waitFor(() => user.type(nicknameField, nickname))
    await waitFor(() => user.click(submitButton))

    expect(onInvalid).toHaveBeenCalledTimes(0)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({ name, nickname })
  })
})
