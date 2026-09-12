import { create } from 'zustand'
import persistentUser from '../services/persistentUser'

const useUserStore = create((set) => ({
  user: null,
  initialize: () => {
    const user = persistentUser.getUser()
    if (user) set({ user })
  },
  setUser: (user) => {
    persistentUser.saveUser(user)
    set({ user })
  },
  logout: () => {
    persistentUser.removeUser()
    set({ user: null })
  }
}))

export default useUserStore
