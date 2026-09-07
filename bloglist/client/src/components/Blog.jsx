import { useState } from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog, onLike, onDelete, currentUser, singleView = false }) => {
  const [visible, setVisible] = useState(false)

  const isOwner = currentUser?.username === blog.user?.username

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  if (!visible && !singleView) {
    return (
      <div className="blog" data-testid="blog">
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
    )
  }

  return (
    <div className="blog" data-testid="blog">
      <div>
        <div>{blog.title}</div>
        <div>{blog.author}</div>
        {!singleView && <button onClick={toggleVisibility}>hide</button>}
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
    </div>
  )
}

export default Blog
