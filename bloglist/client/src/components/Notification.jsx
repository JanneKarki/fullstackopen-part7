import { Alert } from '@mui/material'

export const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>
}

export const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }
  return <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>
}
