import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { describe, test, beforeEach, expect, vi } from 'vitest'
import BlogForm from './BlogForm'


describe('Blog component', () => {
  let blog
  let currentUser

  beforeEach(() => {
    blog = {
      title: 'Test Driven Development in React',
      author: 'Kent Beck',
      url: 'http://example.com/blog',
      likes: 5,
      user: {
        username: 'testaaja',
        name: 'meitsi'
      }
    }
    currentUser = {
      username: 'testaaja',
      name: 'meitsi'
    }
  })

  test('renders blog title', () => {
    render(<Blog blog={blog} currentUser={currentUser} />)
    expect(screen.getByText('Test Driven Development in React', { exact: false })).toBeDefined()
  })


  test('url, likes and author after view', async () => {
    render(<Blog blog={blog} currentUser={currentUser} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(screen.getByText('http://example.com/blog')).toBeDefined()
    expect(screen.getByText('likes 5')).toBeDefined()
    expect(screen.getByText('Kent Beck'),{ exact: false }).toBeDefined()
  })

  test('clicking the button twice calls event hanlder twice', async () => {
    const mockHandler = vi.fn()

    render(<Blog blog={blog} currentUser={currentUser} onLike={mockHandler}/>)

    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
  test('createBlog with correct data when submitted', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const inputs = screen.getAllByRole('textbox')
    const createButton = screen.getByText('create')

    await user.type(inputs[0], 'React Testing')
    await user.type(inputs[1], 'Tester')
    await user.type(inputs[2], 'http://react-testing.com')
    await user.click(createButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'React Testing',
      author: 'Tester',
      url: 'http://react-testing.com'
    })
  })
})