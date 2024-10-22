import supertest from 'supertest';
import {server, uiudRegexp} from '../src/server';
import { isUserValid } from '../src/helpers';
import { User, UserRequest } from '../src/db/users';
import { UUID } from 'crypto';

const newUser: UserRequest = {
  username: 'Ben',
  age: 42,
  hobbies: ['fishing'],
}

let newId: UUID;

const updatedUser: UserRequest = {
  username: 'Clark',
  age: 42,
  hobbies: ['fishing', 'saving the world'],
}

describe("GET /users, when no users were previously created", () => {
  test ("returns array of users", async() => {
    const res = await supertest(server).get('/api/users')

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toStrictEqual([]);
  })
})

describe("POST /users", () => {
  test("returns a newly created user", async() => {
    const res = await supertest(server)
      .post('/api/users')
      .send(newUser)

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toMatchObject(newUser);
    
    newId = res.body.data.id;
    const isIdValid = newId.match(uiudRegexp);
    
    expect(isIdValid).toBeTruthy();
  })

  test("returns 400 if body does not contain required fields", async() => {
    const invalidUserObject = JSON.parse(JSON.stringify(newUser));
    delete invalidUserObject.age;
    const res = await supertest(server)
      .post('/api/users')
      .send(invalidUserObject)

    expect(res.statusCode).toBe(400);
  })
})

describe("GET /users", () => {
  test("returns newly created user", async() => {
    const res = await supertest(server).get('/api/users')

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    
    const user = res.body.data.pop();
    const isUserDataValid = isUserValid(user) && user.id;
    
    expect(isUserDataValid).toBeTruthy();
    expect(user.id).toBe(newId);
  })
})

describe("PUT /users/:id", () => {
  test("updates user", async() => {
    const res = await supertest(server)
      .put(`/api/users/${newId}`)
      .send(updatedUser)

    expect(res.statusCode).toBe(200);
    
    const userData = res.body.data;
    expect(userData).toStrictEqual({...updatedUser, id: newId});
  })

  test('returns 400 if id is invalid', async () => {
    const invalidId = 'invalid-id';
    const res = await supertest(server)
      .put(`/api/users/${invalidId}`)
      .send(updatedUser)

    expect(res.statusCode).toBe(400);
  })
})

describe("requests to invalid urls return error statusCode=404", () => {
  const wrongURL ='/wrong-url';
  test ("GET", async() => {
    const res = await supertest(server).get(wrongURL)

    expect(res.statusCode).toBe(404);
  })

  test("POST", async() => {
    const res = await supertest(server)
    .post(wrongURL)
    .send(newUser)

    expect(res.statusCode).toBe(404);
  })

  test("PUT", async() => {
    const res = await supertest(server)
    .post(wrongURL)
    .send(updatedUser)

    expect(res.statusCode).toBe(404);
  })

  test("DELETE", async() => {
    const res = await supertest(server)
      .post(wrongURL);

    expect(res.statusCode).toBe(404);
  })
})

describe("DELETE request", () => {
  test('returns code 204 on success', async () => {
    const res = await supertest(server).delete(`/api/users/${newId}`)

    expect(res.statusCode).toBe(204);
  })
})

describe("Arter deleting a user", () => {
  test('getting that user returns 404', async () => {
    const res = await supertest(server).get(`/api/users/${newId}`)

    expect(res.statusCode).toBe(404);
  })

  test('getting all users does not return that user in results', async () => {
    const res = await supertest(server).get('/api/users')
    const isUserInArray = Boolean(res.body.data.filter((user: User) => user.id === newId).length);
    expect(isUserInArray).toBeFalsy();
  })
})
