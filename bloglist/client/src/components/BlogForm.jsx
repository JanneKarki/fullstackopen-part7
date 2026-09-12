import useField from '../hooks/useField'
import { Button, TextField } from '@mui/material'

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
          <TextField
            label="title"
            inputProps={{ 'data-testid': 'title' }}
            size="small"
            {...title.input}
          />
        </div>
        <div>
          <TextField
            label="author"
            inputProps={{ 'data-testid': 'author' }}
            size="small"
            {...author.input}
          />
        </div>
        <div>
          <TextField label="url" inputProps={{ 'data-testid': 'url' }} size="small" {...url.input} />
        </div>
        <Button type="submit" variant="contained">create</Button>
      </form>
    </div>
  )
}

export default BlogForm
