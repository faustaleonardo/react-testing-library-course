/* eslint-disable import/no-unresolved */
import {render, within} from '@testing-library/react'
import {Modal} from 'modal'
import React from 'react'

test('modal shows the children', () => {
  render(
    <Modal>
      <div data-testid="test" />
    </Modal>,
  )

  const {getByTestId} = within(document.getElementById('modal-root'))
  expect(getByTestId('test')).toBeInTheDocument()
})
