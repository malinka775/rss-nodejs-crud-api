import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { UUID } from 'node:crypto';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  removeUser,
} from './controllers/usersController';

const validUrlBase = '^/api/users/?';
const userUrlRegexp = '^\/api\/users\/.*'
const usersUrlRegexp = '^\/api\/users\/?$';
export const uiudRegexp = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';

const server = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    try {

      if (!req.url) {
        throw new Error('Invalid URL');
      } else {
        if (!req.url.match(validUrlBase)) {
          throw new Error('Invalid URL')
        }
        const url = req.url;
        if (url[url.length - 1] === '/') {
          url.slice(0, -1);
        }
        
        switch (req.method) {
          case 'GET': {
            if (url.match(usersUrlRegexp)) {
              await getUsers(req, res);
            } else if (url.split('/').length === 4) {
              const id = url.split('/').pop();
              if (id?.match(uiudRegexp)) {
                await getUser(req, res, id as UUID);
              } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({ message: 'User id should be of type UUID' }),
                );
              }
            } else {
              throw new Error('Invalid URL')
            }
            break;
          }
          case 'POST': {
            if (url.match(usersUrlRegexp)) {
              await createUser(req, res);
            } else {
              throw new Error('Invalid URL')
            }
            break;
          }
          case 'PUT': {
            if (url.match(userUrlRegexp)) {
              const id = url.split('/').pop();
              if (id?.match(uiudRegexp)) {
                await updateUser(req, res, id as UUID);
              } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({ message: 'User id should be of type UUID' }),
                );
              }
            } else {
              throw new Error('Invalid URL')
            }
            break;
          }
          case 'DELETE': {
            if (url.match(userUrlRegexp)) {
              const id = url.split('/').pop();
              if (id?.match(uiudRegexp)) {
                await removeUser(req, res, id as UUID);
              } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({ message: 'User id should be of type UUID' }),
                );
              }
            } else {
              throw new Error('Invalid URL')
            }
            break;
          }
        }
      }
    } catch(e: any){
      if(e.message === 'Invalid URL') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpoint is not valid' }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal server error' }));
      }
    }
  },
);

export { server };
