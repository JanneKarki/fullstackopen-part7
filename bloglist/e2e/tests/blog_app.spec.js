const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'testaaja',
        username: 'meitsi2',
        password: 'salasana'
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test('Successful login', async ({ page }) => {
    await page.getByTestId('username').fill('meitsi2')
    await page.getByTestId('password').fill('salasana')
    await page.getByRole('button', { name: 'login' }).click()

    await page.waitForSelector('text=testaaja logged in') 
  })

  test('Unsuccessful login', async ({ page }) => {
    await page.getByTestId('username').fill('meitsi2')
    await page.getByTestId('password').fill('vääräsalasana')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.locator('.error')).toContainText('Wrong username or password')
  })
})

describe('When logged in', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'testaaja',
        username: 'meitsi2',
        password: 'salasana'
      }
    })

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'toinen_testaaja',
        username: 'toinen',
        password: 'salasanaB'
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByTestId('username').fill('meitsi2')
    await page.getByTestId('password').fill('salasana')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.locator('text=testaaja logged in')).toBeVisible()
  })

  test('create new blog', async ({ page }) => {

    await page.getByRole('button', { name: 'new blog' }).click() 
  
    await page.getByTestId('title').fill('Playwright blogi')
    await page.getByTestId('author').fill('Testaaja')
    await page.getByTestId('url').fill('https://testi.com')
    await page.getByRole('button', { name: 'create' }).click()
  
    const blog = page.getByTestId('blog')
    await blog.waitFor({ state: 'visible', timeout: 10000 })
    await expect(blog).toHaveText(/Playwright blogi/)
    })  

  test('like a blog', async ({ page, request }) => {

    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('title').fill('Likettävä blogi')
    await page.getByTestId('author').fill('Testaaja')
    await page.getByTestId('url').fill('https://testi.com')
    await page.getByRole('button', { name: 'create' }).click()

    await page.getByText('Likettävä blogi Testaaja').getByRole('button', { name: 'view' }).click()
    const likeButton = page.getByRole('button', { name: 'like' })
    const likes = page.getByTestId('likes-count')
    
    
    
    const likesBefore = await likes.innerText()

    console.log('Likes before:', likesBefore)
    await expect(likes).toHaveText('0')

    await likeButton.click()

    const likesAfter = await likes.innerText()
    console.log('Likes after:', likesAfter)
    await expect(likes).toHaveText('1')
  })

  test('user can delete their own blog', async ({ page }) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('title').fill('Poistettava blogi')
    await page.getByTestId('author').fill('Testaaja')
    await page.getByTestId('url').fill('https://poisto.com')
    await page.getByRole('button', { name: 'create' }).click()
  
    const blog = page.getByText('Poistettava blogi Testaaja')
    await blog.getByRole('button', { name: 'view' }).click()
  
    page.on('dialog', dialog => dialog.accept())
  
    const removeButton = page.getByTestId('remove-button')
    await expect(removeButton).toBeVisible()
    await removeButton.click()
  
    await expect(page.getByText('Poistettava blogi')).toHaveCount(0)
  })

  test('only creator sees the remove button', async ({ page, request, browser }) => {
    
    await page.getByRole('button', { name: 'new blog' }).click()
  
    await page.getByTestId('title').fill('testaajan blogi')
    await page.getByTestId('author').fill('testaaja')
    await page.getByTestId('url').fill('http://testaaja.fi')
    await page.getByRole('button', { name: 'create' }).click()
  
    await page.getByText('testaajan blogi').getByRole('button', { name: 'view' }).click()
    await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
  
    await page.getByRole('button', { name: 'logout' }).click()
  
    await page.getByTestId('username').fill('toinen')
    await page.getByTestId('password').fill('salasanaB')
    await page.getByRole('button', { name: 'login' }).click()
  
    await page.getByText('testaajan blogi').getByRole('button', { name: 'view' }).click()
  
    await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
  })
  
  
})