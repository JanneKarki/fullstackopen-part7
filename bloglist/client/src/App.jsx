import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import { ErrorNotification, Notification } from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import Users from './components/Users'
import UserView from './components/UserView'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import useBlogStore from './stores/blogStore'
import useNotificationStore from './stores/notificationStore'
import useUserStore from './stores/userStore'

const Navigation = ({ user, onLogout }) => (
  <AppBar position="static" sx={{ mb: 4, borderRadius: 2 }}>
    <Toolbar>
      <Typography variant="h5" sx={{ flexGrow: 1 }}>Blog App</Typography>
      <Button color="inherit" component={Link} to="/">blogs</Button>
      <Button color="inherit" component={Link} to="/users">users</Button>
      {user && <Button color="inherit" component={Link} to="/blogs/new">new blog</Button>}
    {user ? (
      <Button color="inherit" onClick={onLogout}>logout</Button>
    ) : (
      <Button color="inherit" component={Link} to="/login">login</Button>
    )}
    </Toolbar>
  </AppBar>
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

const BlogDetail = ({ blogs, user, onLike, onDelete, onComment }) => {
  const { id } = useParams()
  const blog = blogs.find((blog) => blog.id === id)

  if (!blog) return <NotFound />

  return (
    <Blog
      blog={blog}
      onLike={() => onLike(blog)}
      onDelete={() => onDelete(blog)}
      currentUser={user}
      onComment={(comment) => onComment(blog, comment)}
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
  const navigate = useNavigate()
  const user = useUserStore((state) => state.user)
  const initializeUser = useUserStore((state) => state.initialize)
  const setUserInStore = useUserStore((state) => state.setUser)
  const logoutUser = useUserStore((state) => state.logout)
  const blogs = useBlogStore((state) => state.blogs)
  const [users, setUsers] = useState([])
  const initializeBlogs = useBlogStore((state) => state.initialize)
  const createBlogInStore = useBlogStore((state) => state.createBlog)
  const updateBlogInStore = useBlogStore((state) => state.updateBlog)
  const removeBlogInStore = useBlogStore((state) => state.removeBlog)
  const addCommentInStore = useBlogStore((state) => state.addComment)
  const notification = useNotificationStore((state) => state.notification)
  const notify = useNotificationStore((state) => state.notify)

  useEffect(() => {
    initializeBlogs()
  }, [initializeBlogs])

  useEffect(() => {
    userService.getAll().then(setUsers)
  }, [])

  useEffect(() => {
    initializeUser()
  }, [initializeUser])

  useEffect(() => {
    if (user) blogService.setToken(user.token)
  }, [user])

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await loginService.login(credentials)
      setUserInStore(loggedUser)
      blogService.setToken(loggedUser.token)
      navigate('/')
    } catch (error) {
      console.error('wrong credentials', error)
      notify('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await createBlogInStore(blogObject, {
        id: user.id,
        name: user.name,
        username: user.username
      })
      notify(`a new blog "${newBlog.title}" by ${newBlog.author} added`)
      navigate(`/blogs/${newBlog.id}`)
    } catch (error) {
      console.error('failed to create blog', error)
      notify('Failed to create blog', 'error')
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
      updateBlogInStore(returnedBlog)
    } catch (error) {
      notify('Failed to like blog', 'error')
    }
  }

  const handleDelete = async (blogToDelete) => {
    if (!window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)) return

    try {
      await blogService.remove(blogToDelete.id)
      removeBlogInStore(blogToDelete.id)
      notify(`Deleted blog: ${blogToDelete.title}`)
      navigate('/')
    } catch (error) {
      notify('Failed to delete blog', 'error')
    }
  }

  const handleComment = async (blog, comment) => {
    try {
      await addCommentInStore(blog.id, comment)
    } catch (error) {
      notify('Failed to add comment', 'error')
    }
  }

  return (
    <Container maxWidth="md">
      <Navigation user={user} onLogout={handleLogout} />
      {notification?.type === 'error' ? (
        <ErrorNotification message={notification.message} />
      ) : (
        <Notification message={notification?.message ?? null} />
      )}

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
          <Route path="/users" element={<Users users={users} />} />
          <Route path="/users/:id" element={<UserView users={users} />} />
          <Route
            path="/blogs/:id"
            element={
              <BlogDetail
                blogs={blogs}
                user={user}
                onLike={handleLike}
                onDelete={handleDelete}
                onComment={handleComment}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
