import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardContent, TextField } from '@mui/material'

const Blog = ({ blog, onLike, onDelete, onComment, currentUser, singleView = false }) => {
  const [comment, setComment] = useState('')

  const isOwner = currentUser?.id === blog.user?.id

  if (!singleView) {
    return (
      <Card className="blog" data-testid="blog"><CardContent>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> {blog.author}
      </CardContent></Card>
    )
  }

  return (
    <Card className="blog" data-testid="blog"><CardContent>
      <div>
        <div>{blog.title}</div>
        <div>{blog.author}</div>
      </div>
      <div>{blog.url}</div>
      <div>
        likes <span data-testid="likes-count">{blog.likes}</span>{' '}
        {currentUser && <Button onClick={onLike} variant="outlined">like</Button>}
      </div>
      <div>{blog.user?.name}</div>
      {isOwner && (
        <Button data-testid="remove-button" onClick={onDelete} color="error" variant="outlined">
          remove
        </Button>
      )}
      {singleView && (
        <div>
          <h3>comments</h3>
          <form onSubmit={(event) => {
            event.preventDefault()
            if (!comment.trim()) return
            onComment(comment.trim())
            setComment('')
          }}>
            <TextField
              size="small"
              aria-label="add a comment"
              placeholder="add a comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <Button type="submit" variant="contained">add comment</Button>
          </form>
          <ul>
            {(blog.comments || []).map((comment, index) => (
              <li key={`${blog.id}-comment-${index}`}>{comment}</li>
            ))}
          </ul>
        </div>
      )}
    </CardContent></Card>
  )
}

export default Blog
