import { IncomingMessage, ServerResponse } from 'node:http';
import * as Users from '../db/users';
import { UUID } from 'node:crypto';
import { isUserValid, parseBody } from '../helpers/index';

const getUsers = async (_req: IncomingMessage, res: ServerResponse) => {
  try {
    const users = await Users.fetchAll();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data: users }));
  } catch (e) {
    throw new Error('Server error');
  }
};

const getUser = async (_req: IncomingMessage, res: ServerResponse, id: UUID) => {
  try {
    const user = await Users.fetchById(id);
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User does not exist' }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data: user }));
    }
  } catch (e) {
    throw new Error('Server error');
  }
};

const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const parsedBody = ((await parseBody(req)) as Users.User) || null;
    if (!parsedBody) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({ message: 'Failed to create. Could not parse body' }),
      );
    }
    if (isUserValid(parsedBody)) {
      const { username, age, hobbies } = parsedBody;

      const user = {
        username,
        age,
        hobbies,
      };
      const newUser = await Users.addUser(user);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ data: newUser }));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          message: 'Failed to create. Body does not contain required fields',
        }),
      );
    }
  } catch (e) {
    throw new Error('Server error');
  }
};

const updateUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  id: UUID,
) => {
  try {
    const user = (await Users.fetchById(id)) as Users.User;
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User does not exist' }));
    } else {
      const parsedBody = ((await parseBody(req)) as Users.User) || null;
      if (!parsedBody) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(
          JSON.stringify({ message: 'Failed to update. Could not parse body' }),
        );
      }
      if (isUserValid(parsedBody)) {
        const { username, age, hobbies } = parsedBody;

        const updUser = {
          id: id,
          username: username || user.username,
          age: age || user.age,
          hobbies: hobbies || user.hobbies,
        };
        const updatedUser = await Users.updateUser(id, updUser);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ data: updatedUser }));
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(
          JSON.stringify({
            message: 'Failed to update. Body does not contain required fields',
          }),
        );
      }
    }
  } catch (e) {
    throw new Error('Server error');
  }
};

const removeUser = async (
  _: IncomingMessage,
  res: ServerResponse,
  id: UUID,
) => {
  try {
    const user = await Users.fetchById(id);
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User does not exist' }));
    } else {
      await Users.deleteUser(id);
      res.writeHead(204, { 'Content-Type': 'application/json' });
      res.end();
    }
  } catch (e) {
    throw new Error('Server error');
  }
};
export { getUsers, getUser, createUser, updateUser, removeUser };
