import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import { ErrorNotification, Notification } from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import blogService from './services/blogs'
import loginService from './services/login'

const Navigation = ({ user, onLogout }) => (
  <nav>
    <Link to="/">blogs</Link> {user && <Link to="/blogs/new">new blog</Link>}{' '}
    {user ? (
      <span>
        {user.name} logged in <button onClick={onLogout}>logout</button>
      </span>
    ) : (
      <Link to="/login">login</Link>
    )}
  </nav>
)

const BlogList = ({ blogs, user, onLike, onDelete }) => (
  <div>
    <h2>blogs</h2>
    {blogs
      .slice()
      .sort((a, b) => b.likes - a.likes)
      .map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          onLike={() => onLike(blog)}
          onDelete={() => onDelete(blog)}
          currentUser={user}
        />
      ))}
  </div>
)

const BlogDetail = ({ blogs, user, onLike, onDelete }) => {
  const { id } = useParams()
  const blog = blogs.find((blog) => blog.id === id)

  if (!blog) return <NotFound />

  return (
    <Blog
      blog={blog}
      onLike={() => onLike(blog)}
      onDelete={() => onDelete(blog)}
      currentUser={user}
      singleView
    />
  )
}

const Login = ({ onLogin }) => (
  <div>
    <h2>Log in to application</h2>
    <LoginForm onLogin={onLogin} />
  </div>
)

const NewBlog = ({ createBlog }) => (
  <div>
    <h2>create a new blog</h2>
    <BlogForm createBlog={createBlog} />
  </div>
)

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(setBlogs)
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const notify = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 5000)
  }

  const notifyError = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      navigate('/')
    } catch (error) {
      console.error('wrong credentials', error)
      notifyError('Wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    navigate('/')
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      newBlog.user = { id: user.id, name: user.name, username: user.username }
      setBlogs(blogs.concat(newBlog))
      notify(`a new blog "${newBlog.title}" by ${newBlog.author} added`)
      navigate(`/blogs/${newBlog.id}`)
    } catch (error) {
      console.error('failed to create blog', error)
      notifyError('Failed to create blog')
    }
  }

  const handleLike = async (blogToUpdate) => {
    if (!user) return

    try {
      const returnedBlog = await blogService.update(blogToUpdate.id, {
        ...blogToUpdate,
        user: blogToUpdate.user.id,
        likes: blogToUpdate.likes + 1
      })
      returnedBlog.user = blogToUpdate.user
      setBlogs(blogs.map((blog) => (blog.id !== returnedBlog.id ? blog : returnedBlog)))
    } catch (error) {
      notifyError('Failed to like blog')
    }
  }

  const handleDelete = async (blogToDelete) => {
    if (!window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)) return

    try {
      await blogService.remove(blogToDelete.id)
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id))
      notify(`Deleted blog: ${blogToDelete.title}`)
      navigate('/')
    } catch (error) {
      notifyError('Failed to delete blog')
    }
  }

  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} />
      <Notification message={notification} />
      <ErrorNotification message={errorMessage} />

      <ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={
              <BlogList blogs={blogs} user={user} onLike={handleLike} onDelete={handleDelete} />
            }
          />
          <Route
            path="/login"
            element={user ? <Navigate replace to="/" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/blogs/new"
            element={user ? <NewBlog createBlog={createBlog} /> : <Navigate replace to="/login" />}
          />
          <Route
            path="/blogs/:id"
            element={
              <BlogDetail blogs={blogs} user={user} onLike={handleLike} onDelete={handleDelete} />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
