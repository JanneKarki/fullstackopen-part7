import useField from '../hooks/useField'

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
          username{' '}
          <input
            data-testid="username"
            type="text"
            {...username.input}
          />
        </div>
        <div>
          password{' '}
          <input
            data-testid="password"
            type="password"
            {...password.input}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
