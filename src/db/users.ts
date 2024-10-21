import { UUID, randomUUID } from 'node:crypto';

export interface User {
  id: UUID;
  username: string;
  age: number;
  hobbies: string[];
}

export interface UserRequest {
  username: string;
  age: number;
  hobbies: string[];
}

const users: Record<UUID, User> = {};

const fetchAll = (): Promise<User[]> => {
  return new Promise((resolve) => {
    resolve(Object.values(users));
  });
};
const fetchById = (id: UUID): Promise<User | undefined> => {
  return new Promise((resolve) => {
    const user = users[id];
    resolve(user);
  });
};

const addUser = (user: UserRequest): Promise<User> => {
  return new Promise(async (resolve) => {
    const id = randomUUID();
    const newUser = { id, ...user };
    users[id] = newUser;

    resolve(newUser);
  });
};

const updateUser = (id: UUID, user: User): Promise<User> => {
  return new Promise(async (resolve) => {
    users[id] = user;
    resolve(users[id]);
  });
};

const deleteUser = (id: UUID): Promise<UUID> => {
  return new Promise(async (resolve) => {
    delete users[id];
    resolve(id);
  });
};

export { fetchAll, fetchById, addUser, updateUser, deleteUser };
