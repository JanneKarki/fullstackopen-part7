import { useState } from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog, onLike, onDelete, onComment, currentUser, singleView = false }) => {
  const [comment, setComment] = useState('')

  const isOwner = currentUser?.id === blog.user?.id

  if (!singleView) {
    return (
      <div className="blog" data-testid="blog">
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> {blog.author}
      </div>
    )
  }

  return (
    <div className="blog" data-testid="blog">
      <div>
        <div>{blog.title}</div>
        <div>{blog.author}</div>
      </div>
      <div>{blog.url}</div>
      <div>
        likes <span data-testid="likes-count">{blog.likes}</span>{' '}
        {currentUser && <button onClick={onLike}>like</button>}
      </div>
      <div>{blog.user?.name}</div>
      {isOwner && (
        <button data-testid="remove-button" onClick={onDelete}>
          remove
        </button>
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
            <input
              aria-label="add a comment"
              placeholder="add a comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <button type="submit">add comment</button>
          </form>
          <ul>
            {(blog.comments || []).map((comment, index) => (
              <li key={`${blog.id}-comment-${index}`}>{comment}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Blog
