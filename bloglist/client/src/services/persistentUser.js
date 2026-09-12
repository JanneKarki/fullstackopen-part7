const storageKey = 'loggedBlogAppUser'

const getUser = () => {
  const userJSON = window.localStorage.getItem(storageKey)
  return userJSON ? JSON.parse(userJSON) : null
}

const saveUser = (user) => {
  window.localStorage.setItem(storageKey, JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem(storageKey)
}

export default { getUser, saveUser, removeUser }
