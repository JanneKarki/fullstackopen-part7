import useField from '../hooks/useField'

const BlogForm = ({ createBlog }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title: title.input.value,
      author: author.input.value,
      url: url.input.value
    })
    title.reset()
    author.reset()
    url.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:{' '}
          <input
            data-testid="title"
            {...title.input}
          />
        </div>
        <div>
          author:{' '}
          <input
            data-testid="author"
            {...author.input}
          />
        </div>
        <div>
          url:{' '}
          <input data-testid="url" {...url.input} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
