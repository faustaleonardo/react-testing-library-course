/* eslint-disable import/no-unresolved */
import React from 'react'
import {GreetingLoader} from 'greeting-loader-01-mocking'
import {render, screen, waitFor} from '@testing-library/react'
import user from '@testing-library/user-event'
import {loadGreeting as mockLoadGreeting} from 'api'

jest.mock('../api')

test('loads greeting on click', async () => {
  const testGreeting = 'TEST_GREETING'
  mockLoadGreeting.mockResolvedValueOnce({data: {greeting: testGreeting}})

  render(<GreetingLoader />)
  const input = screen.getByLabelText(/name/i)
  user.type(input, 'Mary')
  const loadButton = screen.getByText(/load greeting/i)
  user.click(loadButton)

  expect(mockLoadGreeting).toHaveBeenCalledWith('Mary')
  expect(mockLoadGreeting).toHaveBeenCalledTimes(1)
  await waitFor(() =>
    expect(screen.getByLabelText(/greeting/)).toHaveTextContent(testGreeting),
  )
})
