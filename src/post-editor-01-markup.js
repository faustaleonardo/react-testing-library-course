import * as React from 'react'
// eslint-disable-next-line import/no-unresolved
import {savePost} from 'api'
import {Redirect} from 'react-router'

function Editor({user}) {
  const [isSaving, setIsSaving] = React.useState(false)
  const [redirect, setRedirect] = React.useState(false)
  const [error, setError] = React.useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSaving(true)
    const {title, content, tags} = e.target.elements
    const newPost = {
      title: title.value,
      content: content.value,
      tags: tags.value.split(',').map((tag) => tag.trim()),
      id: user.id,
      date: new Date().toISOString(),
    }
    savePost(newPost)
      .then(() => {
        setRedirect(true)
      })
      .catch((response) => {
        setError(response.data.error)
        setIsSaving(false)
      })
  }

  if (redirect) {
    return <Redirect to="/" />
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input id="title" name="title" />

      <label htmlFor="content">Content</label>
      <textarea id="content" name="content" />

      <label htmlFor="tags">Tags</label>
      <input id="tags" name="tags" />

      <button type="submit" disabled={isSaving}>
        Submit
      </button>

      {error ? <div role="alert">{error}</div> : null}
    </form>
  )
}

export {Editor}
