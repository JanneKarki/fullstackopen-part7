import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set) => ({
  blogs: [],
  initialize: async () => {
    const blogs = await blogService.getAll()
    set({ blogs })
  },
  createBlog: async (blogObject, user) => {
    const newBlog = await blogService.create(blogObject)
    newBlog.user = user
    set((state) => ({ blogs: state.blogs.concat(newBlog) }))
    return newBlog
  },
  updateBlog: (updatedBlog) => {
    set((state) => ({
      blogs: state.blogs.map((blog) => blog.id === updatedBlog.id ? updatedBlog : blog)
    }))
  },
  removeBlog: (id) => {
    set((state) => ({ blogs: state.blogs.filter((blog) => blog.id !== id) }))
  },
  addComment: async (id, comment) => {
    const updatedBlog = await blogService.addComment(id, comment)
    set((state) => ({
      blogs: state.blogs.map((blog) => blog.id === updatedBlog.id ? updatedBlog : blog)
    }))
    return updatedBlog
  }
}))

export default useBlogStore
