import * as React from 'react'
import {FavoriteNumber} from '../favorite-number'
import {render} from '@testing-library/react'
import user from '@testing-library/user-event'

test('renders a number input with a label "Favorite Number"', () => {
  const {getByLabelText} = render(<FavoriteNumber />)
  const input = getByLabelText(/favorite number/i)
  expect(input).toHaveAttribute('type', 'number')
})

test('entering an invalid value shows an error message', () => {
  const {getByLabelText, getByRole, rerender, queryByRole} = render(
    <FavoriteNumber />,
  )
  const input = getByLabelText(/favorite number/i)
  user.type(input, '10')
  expect(getByRole('alert')).toHaveTextContent(/the number is invalid/i)
  rerender(<FavoriteNumber max={10} />)
  expect(queryByRole('alert')).toBe(null)
})

// disabled for the purpose of this lesson. We'll get to this later
/*
eslint
  testing-library/no-dom-import: "off",
  testing-library/prefer-screen-queries: "off"
*/
