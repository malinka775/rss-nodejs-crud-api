import { UUID, randomUUID } from "node:crypto";

export interface User {
  id: UUID,
  username: string,
  age: number,
  hobbies: string[],
}

export interface UserRequest {
  username: string,
  age: number,
  hobbies: string[],
}

const users: Record<UUID, User> = {
  '12345678-1234-1234-1234-123456789012': {
    id: '12345678-1234-1234-1234-123456789012',
    username: 'Alina',
    age: 33,
    hobbies: ['swimming'],
  },
  '21345678-2134-2134-1234-123456789876': {
    id: '21345678-2134-2134-1234-123456789876',
    username: 'Bulat',
    age: 33,
    hobbies: ['programming'],
  }
}

const fetchAll = () => {
  return new Promise((resolve, _) => {
    resolve(Object.values(users));
})}
const fetchById = (id: UUID) => {
  return new Promise((resolve, _) => {
    const user = users[id];
    resolve(user);
})}

const addUser = (user: UserRequest): Promise<User> => {
  return new Promise(async (resolve, _) => {
    const id = randomUUID()
    const newUser = {id, ...user};
    users[id] = newUser;
    
    resolve(newUser);
  })
}

const updateUser = (id: UUID, user: User) => {
  return new Promise(async(resolve) => {
    users[id] = user;
    resolve(users[id]);
  })
}

const deleteUser = (id: UUID) => {
  return new Promise(async(resolve) => {
    delete users[id];
    resolve(id);
  })
}


export { fetchAll, fetchById, addUser, updateUser, deleteUser }
