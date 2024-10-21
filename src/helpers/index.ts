import { User } from 'db/users';
import { IncomingMessage } from 'node:http';

export const parseBody = async (req: IncomingMessage) => {
  return new Promise((resolve) => {
    const body: Buffer[] = [];
    req.on('data', (chunk) => body.push(chunk));
    req.on('end', () => {
      const reqBody = Buffer.concat(body).toString();
      let requestData = {};
      try {
        requestData = JSON.parse(reqBody);
      } catch (error) {
        resolve(null);
      }
      resolve(requestData);
    });
  });
};

export const isUserValid = (user: User) => {
  const { username, age, hobbies } = user;
  const isObjectValid = Boolean(username && age && hobbies);
  const isTypesValid = Boolean(
    typeof age === 'number' &&
      typeof username === 'string' &&
      Array.isArray(hobbies) &&
      hobbies.every((item) => typeof item === 'string'),
  );

  return isObjectValid && isTypesValid;
};
