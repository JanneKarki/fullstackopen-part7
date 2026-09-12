import { create } from 'zustand'

const storageKey = 'loggedBlogAppUser'

const useUserStore = create((set) => ({
  user: null,
  initialize: () => {
    const userJSON = window.localStorage.getItem(storageKey)
    if (userJSON) {
      set({ user: JSON.parse(userJSON) })
    }
  },
  setUser: (user) => {
    window.localStorage.setItem(storageKey, JSON.stringify(user))
    set({ user })
  },
  logout: () => {
    window.localStorage.removeItem(storageKey)
    set({ user: null })
  }
}))

export default useUserStore
