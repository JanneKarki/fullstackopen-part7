const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash('password', saltRounds)
  const user = new User({ username: 'rootuser', name: 'name', passwordHash })

  await user.save()
})
after(async () => {
    await mongoose.connection.close()
})


describe('invalid user creation', () => {
  test('fails with too short username', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Name',
      password: 'validpass'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    assert.strictEqual(result.body.error, 'User validation failed: username: Username must be at least 3 characters long', true)
  })

  test('fails with too short password', async () => {
    const newUser = {
      username: 'validname',
      name: 'User',
      password: 'pw'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    assert.strictEqual(result.body.error, 'password must be at least 3 characters long', true)
  })

  test('fails with missing username', async () => {
    const newUser = {
      name: 'NoUsername',
      password: 'somepassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      console.log(result.body, "result body")
      assert.strictEqual(result.body.error, 'User validation failed: username: Username is required', true)
  })

  test('fails with missing password', async () => {
    const newUser = {
      username: 'noPasswordUser',
      name: 'NoPass'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      console.log(result.body, "result body")
      assert.strictEqual(result.body.error, 'password is required', true)
  })

  test('fails if username is not unique', async () => {
    const newUser = {
      username: 'rootuser',
      name: 'Duplicate',
      password: 'uniquepass'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      console.log(result.body, "result body")
    assert.strictEqual(result.body.error, 'expected `username` to be unique', true)
  })
})

