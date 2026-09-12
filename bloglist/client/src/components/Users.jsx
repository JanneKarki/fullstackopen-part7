import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const Users = ({ users }) => (
  <div>
    <h2>Users</h2>
    <TableContainer component={Paper}>
      <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Username</TableCell>
          <TableCell>Blogs created</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell><Link to={`/users/${user.id}`}>{user.name}</Link></TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.blogs.length}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>
    </TableContainer>
  </div>
)

export default Users
