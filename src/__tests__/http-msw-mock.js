/* eslint-disable import/no-unresolved */
import React from 'react'
import {GreetingLoader} from 'greeting-loader-01-mocking'
import {render, screen, waitFor} from '@testing-library/react'
import user from '@testing-library/user-event'
import 'whatwg-fetch'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

const server = setupServer(
  rest.post('/greeting', (req, res, ctx) => {
    return res(ctx.json({data: {greeting: `Hello ${req.body.subject}`}}))
  }),
)

beforeAll(() => server.listen({onUnhandledRequest: 'error'}))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

test('loads greeting on click', async () => {
  render(<GreetingLoader />)
  const input = screen.getByLabelText(/name/i)
  user.type(input, 'Mary')
  const loadButton = screen.getByText(/load greeting/i)
  user.click(loadButton)

  await waitFor(() =>
    expect(screen.getByLabelText(/greeting/)).toHaveTextContent('Hello Mary'),
  )
})
