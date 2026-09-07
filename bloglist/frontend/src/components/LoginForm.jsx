import { useState } from 'react'

// Login form component
const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          username <input data-testid='username' type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password <input data-testid='password' type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
