/* eslint-disable import/order */
/* eslint-disable import/no-unresolved */
import * as React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {savePost as mockSavePost} from 'api'
import {Editor} from '../post-editor-01-markup'
import {Redirect as mockRedirect} from 'react-router'
import {sequence, build, fake} from 'test-data-bot'

jest.mock('../api')
afterEach(() => {
  jest.clearAllMocks()
})

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  }
})

const postBuilder = build('Post').fields({
  title: fake((f) => f.lorem.words()),
  content: fake((f) => f.lorem.paragraphs().replace(/\r/g, '')),
  tags: fake((f) => [f.lorem.words(), f.lorem.words()]),
})

const userBuilder = build('User').fields({
  id: sequence((s) => `user-${s}`),
})

const renderEditor = () => {
  const fakeUser = userBuilder()
  render(<Editor user={fakeUser} />)

  const fakePost = postBuilder()
  const titleInput = screen.getByLabelText(/title/i)
  const contentInput = screen.getByLabelText(/content/i)
  const tagsInput = screen.getByLabelText(/tags/i)
  const submitButton = screen.getByText(/submit/i)

  return {
    fakeUser,
    fakePost,
    titleInput,
    contentInput,
    tagsInput,
    submitButton,
  }
}

test('renders a form with title, content, tags, and a submit button', async () => {
  mockSavePost.mockResolvedValueOnce()

  const {
    fakeUser,
    fakePost,
    titleInput,
    contentInput,
    tagsInput,
    submitButton,
  } = renderEditor()
  userEvent.type(titleInput, fakePost.title)
  userEvent.type(contentInput, fakePost.content)
  userEvent.type(tagsInput, fakePost.tags.join(', '))

  const preDate = new Date().getTime()
  userEvent.click(submitButton)
  expect(submitButton).toBeDisabled()

  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    ...fakeUser,
    date: expect.any(String),
  })
  expect(mockSavePost).toHaveBeenCalledTimes(1)
  const date = new Date(mockSavePost.mock.calls[0][0].date).getTime()

  const postDate = new Date().getTime()

  expect(date).toBeGreaterThanOrEqual(preDate)
  expect(date).toBeLessThanOrEqual(postDate)

  await waitFor(() => {
    expect(mockRedirect).toHaveBeenCalledWith({to: '/'}, {})
  })
})

test('renders an error message from the server', async () => {
  const testError = 'test error'
  mockSavePost.mockRejectedValueOnce({data: {error: testError}})

  const {submitButton} = renderEditor()

  userEvent.click(submitButton)

  const postError = await screen.findByRole('alert')
  expect(postError).toHaveTextContent(testError)
  expect(submitButton).toBeEnabled()
})

// disabling this rule for now. We'll get to this later
/*
eslint
  testing-library/prefer-explicit-assert: "off",
*/
