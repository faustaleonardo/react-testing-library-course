/* eslint-disable import/no-unresolved */
import {render as rtlRender, screen} from '@testing-library/react'
import user from '@testing-library/user-event'
import {Main} from 'main'
import React from 'react'
import {BrowserRouter} from 'react-router-dom'

function render(ui, {route = '/', ...renderOptions} = {}) {
  window.history.pushState({}, 'Test Page', route)

  function Wrapper({children}) {
    return <BrowserRouter>{children}</BrowserRouter>
  }

  return rtlRender(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  })
}

test('main renders home and can navigate to about page', () => {
  render(<Main />)

  expect(screen.getByRole('heading')).toHaveTextContent(/home/i)
  user.click(screen.getByText(/about/i))
  expect(screen.getByRole('heading')).toHaveTextContent(/about/i)
})

test('landing on a bad page shows no match component', () => {
  render(<Main />, {route: '/something-not-found'})
  expect(screen.getByRole('heading')).toHaveTextContent(/404/i)
})
