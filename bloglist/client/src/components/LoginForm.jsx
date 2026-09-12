import useField from '../hooks/useField'
import { Button, TextField } from '@mui/material'

// Login form component
const LoginForm = ({ onLogin }) => {
  const username = useField('text')
  const password = useField('password')

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin({ username: username.input.value, password: password.input.value })
    username.reset()
    password.reset()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="username"
            inputProps={{ 'data-testid': 'username' }}
            size="small"
            {...username.input}
          />
        </div>
        <div>
          <TextField
            label="password"
            inputProps={{ 'data-testid': 'password' }}
            size="small"
            {...password.input}
          />
        </div>
        <Button type="submit" variant="contained">login</Button>
      </form>
    </div>
  )
}

export default LoginForm
