import { useState } from 'react'

const Blog = ({ blog, onLike, onDelete, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const isOwner = currentUser?.username === blog.user?.username

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  if (!visible) {
    return (
      <div className="blog" data-testid="blog">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
    )
  }

  return (
    <div className="blog" data-testid="blog">
      <div>
        <div>{blog.title}</div>
        <div>{blog.author}</div>
        <button onClick={toggleVisibility}>hide</button>
      </div>
      <div>{blog.url}</div>
      <div>
      likes <span data-testid="likes-count">{blog.likes}</span>{' '}
        <button onClick={onLike}>like</button>
      </div>
      <div>{blog.user?.name}</div>
      {isOwner && (
        <button data-testid="remove-button" onClick={onDelete}>remove</button>
      )}
    </div>
  )
}

export default Blog
