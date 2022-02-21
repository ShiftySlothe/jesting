import {initDb, generate} from 'til-server-test-utils'
import {omit} from 'lodash'
import db from '../../utils/db'
import * as userController from '../users.todo'

function setup() {
  const req = {
    params: {},
    body: {},
  }
  const res = {}

  Object.assign(res, {
    status: jest.fn(
      function status() {
        return this
      }.bind(res),
    ),
    json: jest.fn(
      function json() {
        return this
      }.bind(res),
    ),
    send: jest.fn(
      function send() {
        return this
      }.bind(res),
    ),
  })
  return {req, res}
}

beforeEach(() => initDb())
const safeUser = u => omit(u, ['salt', 'hash'])
test('getUsers returns all users in the DB', async () => {
  const req = {}
  const res = {
    json: jest.fn(),
  }
  await userController.getUsers(req, res)
  expect(res.json).toHaveBeenCalledTimes(1)
})

test('deleteUser only allows the user to delete account, returns 403', async () => {
  const newUser = await db.insertUser(generate.userData())
  const {req, res} = setup()
  req.params = {id: newUser.id}
  req.user = newUser
  req.user.id = 'WrongId'

  await userController.deleteUser(req, res)

  expect(res.json).not.toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledWith(403)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.send).toHaveBeenCalledTimes(1)
  const userInDb = await db.getUser(newUser.id)
  expect(newUser).toEqual(userInDb)
})

test('deleteUser, if no user exists, return 404', async () => {
  const {req, res} = setup()
  const nonExistantId = generate.id()
  req.params = {id: nonExistantId}
  req.user = {id: nonExistantId}
  await userController.deleteUser(req, res)

  expect(res.json).not.toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenLastCalledWith(404)
  expect(res.send).toHaveBeenCalledTimes(1)
})

test('deleteUser, deletes a user', async () => {
  const newUser = await db.insertUser(generate.userData())
  const {req, res} = setup()
  req.params = {id: newUser.id}
  req.user = safeUser(newUser)

  await userController.deleteUser(req, res)

  expect(res.json).toHaveBeenCalledTimes(1)
  const firstCall = res.json.mock.calls[0]
  const firstArg = firstCall[0]
  const {user} = firstArg
  expect(user).toEqual(safeUser(newUser))

  const userInDb = await db.getUser(newUser.id)
  expect(userInDb).toBeUndefined()
})
//////// Elaboration & Feedback /////////
// When you've finished with the exercises:
// 1. Copy the URL below into your browser and fill out the form
// 2. remove the `.skip` from the test below
// 3. Change submitted from `false` to `true`
// 4. And you're all done!
/*
http://ws.kcd.im/?ws=Testing&e=users%20test$20object%20factories&em=
*/
test.skip('I submitted my elaboration and feedback', () => {
  const submitted = false // change this when you've submitted!
  expect(submitted).toBe(true)
})
////////////////////////////////
