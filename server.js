const fs = require('fs');
const url = require('url');

const jsonServer = require('json-server');


const PORT = 5001;

const JSON_DATABASE = 'db.json';

const KEY_FILE_NAME = "api-keys.json";
var USER_KEYS;


// Server init.
const server = jsonServer.create();
const router = jsonServer.router(JSON_DATABASE);
const middlewares = jsonServer.defaults();

// Application init.
loadAPIKeys();

server.use(middlewares);

server.use((req, res, next) => {
  if (authenticate(req)) {
    next();
  } else {
    res.sendStatus(401);
  }
});

server.use(router);

server.listen(PORT, () => {
  console.log('JSON Server running on port', PORT)
});


function loadAPIKeys() {
  var content = fs.readFileSync(KEY_FILE_NAME);
  USER_KEYS = JSON.parse(content);
}


function authenticate(request) {
  console.log('\tREQUEST: ', request.originalUrl);
  // argument true -> extract query string
  params = url.parse(request.originalUrl, true);
  if (matchAPIKey(params.query.api_key)) {
    return true;
  } else {
    return false;
  }
}


function matchAPIKey(key) {
  for (i in USER_KEYS.users) {
    if (USER_KEYS.users[i].key == key) {
      return true;
    }
  }

  return false;
}
