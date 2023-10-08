/* eslint-disable import/no-unresolved */
import React from 'react'
import {render} from '@testing-library/react'
import {ErrorBoundary} from 'error-boundary'
import {reportError as mockReportError} from 'api'
import user from '@testing-library/user-event'

jest.mock('../api')

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  console.error.mockRestore()
})

afterEach(() => {
  jest.clearAllMocks()
})

function Bomb({shouldThrow = false}) {
  if (shouldThrow) {
    throw new Error('💣')
  }
  return null
}

test('calls reportError and renders that there was a problem', async () => {
  await mockReportError.mockResolvedValueOnce({success: true})
  const {rerender, getByText, queryByRole, queryByText} = render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  )

  rerender(
    <ErrorBoundary>
      <Bomb shouldThrow />
    </ErrorBoundary>,
  )

  const error = expect.any(Error)
  const info = {componentStack: expect.stringContaining('Bomb')}
  expect(mockReportError).toHaveBeenCalledWith(error, info)
  expect(mockReportError).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledTimes(2)

  mockReportError.mockClear()
  console.error.mockClear()

  rerender(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  )
  user.click(getByText(/try again?/i))

  expect(mockReportError).toHaveBeenCalledTimes(0)
  expect(console.error).toHaveBeenCalledTimes(0)
  expect(queryByRole('alert')).not.toBeInTheDocument()
  expect(queryByText(/try again?/i)).not.toBeInTheDocument()
})

/*
eslint
  jest/prefer-hooks-on-top: off,
  testing-library/prefer-screen-queries: "off"
*/
