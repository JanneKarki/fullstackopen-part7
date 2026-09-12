import { Link, useParams } from 'react-router-dom'
import NotFound from './NotFound'

const UserView = ({ users }) => {
  const { id } = useParams()
  const user = users.find((user) => user.id === id)

  if (!user) return <NotFound />

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserView
