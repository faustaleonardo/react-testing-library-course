/* eslint-disable import/no-unresolved */
import {render, screen} from '@testing-library/react'
import user from '@testing-library/user-event'
import {Editor} from 'post-editor-01-markup'
import React from 'react'

test('renders a form with title, content, tags, and a submit buttion', () => {
  render(<Editor />)
  screen.getByLabelText(/title/i)
  screen.getByLabelText(/content/i)
  screen.getByLabelText(/tags/i)
  const submitButton = screen.getByText(/submit/i)
  user.click(submitButton)

  expect(submitButton).toBeDisabled()
})

// disabling this rule for now. We'll get to this later
/*
eslint
  testing-library/prefer-explicit-assert: "off",
*/
