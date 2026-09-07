import { create } from 'zustand'

let clearTimer

const useNotificationStore = create((set) => ({
  notification: null,
  notify: (message, type = 'success') => {
    clearTimeout(clearTimer)
    set({ notification: { message, type } })
    clearTimer = setTimeout(() => set({ notification: null }), 5000)
  },
  clear: () => {
    clearTimeout(clearTimer)
    set({ notification: null })
  }
}))

export default useNotificationStore
