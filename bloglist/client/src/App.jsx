import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import { Notification, ErrorNotification } from './components/Notification'
import { useRef } from 'react'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, duration = 5000) => {
    setNotification(message)
    setTimeout(() => setNotification(null), duration)
  }

  const notifyError = (message, duration = 5000) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), duration)
  }


  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (error) {
      console.error('wrong credentials')
      notifyError('Wrong username or password')
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)

      newBlog.user = {
        id: user.id,
        name: user.name,
        username: user.username
      }
      setBlogs(blogs.concat(newBlog))
      notify(`a new blog "${newBlog.title}" by ${newBlog.author} added`)
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      console.error('failed to create blog', error)
      notifyError('Failed to create blog')
    }
  }
  const handleLike = async (blogToUpdate) => {
    const user = blogToUpdate.user
    const updatedBlog = {
      ...blogToUpdate,
      user: blogToUpdate.user.id, // Vain käyttäjän ID backendille
      likes: blogToUpdate.likes + 1,
    }

    try {
      const returnedBlog = await blogService.update(blogToUpdate.id, updatedBlog)
      returnedBlog.user = user
      setBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog : returnedBlog))
    } catch (error) {
      notifyError('Failed to like blog')
    }
  }

  const handleDelete = async (blogToDelete) => {
    const ok = window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)
    if (!ok) return

    try {
      await blogService.remove(blogToDelete.id)
      setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
      notify(`Deleted blog: ${blogToDelete.title}`)
    } catch (error) {
      notifyError('Failed to delete blog')
    }
  }


  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} />
        <ErrorNotification message={errorMessage} />

        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />
      <ErrorNotification message={errorMessage} />

      <p>{user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable data-testid="new-blog-button" buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes) // laskeva järjestys
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            onLike={() => handleLike(blog)}
            onDelete={() => handleDelete(blog)}
            currentUser={user}
          />
        )}

    </div>
  )
}

export default App
