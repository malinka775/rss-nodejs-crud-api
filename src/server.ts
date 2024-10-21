import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { UUID } from "node:crypto";
import { getUsers, getUser, createUser, updateUser, removeUser } from "./controllers/usersController";

const userUrlRegexp = '^\/api\/users\/.*'
const usersUrlRegexp = '^\/api\/users\/?$';
const uiudRegexp = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';



const server = createServer(async (req:IncomingMessage, res:ServerResponse) => {
  if (!req.url) {console.log('no url')}
  else{
    let url = req.url;
    if (url[url.length-1] === '/') {
      url.slice(0, -1)
    }

    switch(req.method) {
      case 'GET': {
        if (url.match(usersUrlRegexp)) {
          await getUsers(req, res)
        } else if (url.split('/').length === 4){
          console.log(url.split('/'));
          const id = url.split('/').pop();
          if (id?.match(uiudRegexp)) {
            await getUser(req, res, id as UUID);
          } else {
            res.writeHead(400, {'Content-Type': 'application/json'})
            res.end(JSON.stringify({message: 'User id should be of type UUID'}))
          }
        } else {
          res.writeHead(404, {'Content-Type': 'application/json'})
          res.end(JSON.stringify({message: 'Not found'}))
        }
        break;
      };
      case 'POST': {
        if(url.match(usersUrlRegexp)) {
          await createUser(req, res);
        } else {
          res.writeHead(404, {'Content-Type': 'application/json'})
          res.end(JSON.stringify({message: 'Bad request'}))
        }
        break;
      };
      case 'PUT': {
        console.log('PUT')
        console.log(url)
        if(url.match(userUrlRegexp)) {
          console.log(url.split('/'));
          const id = url.split('/').pop();
          if (id?.match(uiudRegexp)) {
            await updateUser(req, res, id as UUID);
          } else {
            res.writeHead(400, {'Content-Type': 'application/json'})
            res.end(JSON.stringify({message: 'User id should be of type UUID'}))
          }
        } else {
          res.writeHead(404, {'Content-Type': 'application/json'})
          res.end(JSON.stringify({message: 'Bad request'}))
        }
        break;
      };
      case 'DELETE': {
        console.log('DELETE')
        console.log(url)
        if(url.match(userUrlRegexp)) {
          console.log(url.split('/'));
          const id = url.split('/').pop();
          if (id?.match(uiudRegexp)) {
            await removeUser(req, res, id as UUID);
          } else {
            res.writeHead(400, {'Content-Type': 'application/json'})
            res.end(JSON.stringify({message: 'User id should be of type UUID'}))
          }
        } else {
          res.writeHead(404, {'Content-Type': 'application/json'})
          res.end(JSON.stringify({message: 'Bad request'}))
        }
        break;
      }
    }
  }
  // switch (req.url) {

  // }
  // res.end(req.url);
  // res.writeHead(200, { 'Content-Type': 'application/json' });
  // res.end(JSON.stringify({
  //   data: 'Hello World!',
  // }));
});

export { server };
