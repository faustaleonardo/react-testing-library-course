/* eslint-disable import/no-unresolved */
import {render, screen} from '@testing-library/react'
import user from '@testing-library/user-event'
import {HiddenMessage} from 'hidden-message'
import React from 'react'

jest.mock('react-transition-group', () => {
  return {
    CSSTransition: (props) => (props.in ? props.children : null),
  }
})

test('shows hidden message when toggle is clicked', () => {
  const myMessage = 'hello world'
  render(<HiddenMessage>{myMessage}</HiddenMessage>)
  expect(screen.queryByText(/hello world/i)).not.toBeInTheDocument()

  const toggleButton = screen.getByText(/toggle/i)
  user.click(toggleButton)
  expect(screen.getByText(/hello world/i)).toBeInTheDocument()

  user.click(toggleButton)
  expect(screen.queryByText(/hello world/i)).not.toBeInTheDocument()
})
