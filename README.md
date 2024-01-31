# collegeXchange - Backend
This is the backend for collegeXchange. It is built using Fastify and MySql(planetscale).

## Things to do
- [x] tests need to be written asap.
- [x] search for listings isn't implemented, need to implement it. the plan was to tokenize the search string, remove filler words, get all listings that have at least one match. then on server, rank them based on the number of matches. search db like elastic search is probably overkill for this project.
- [x] make a better todo list and error tracking system.
- [x] add a logger
- [x] validation and serialization schemas arent there for all routes, need to add them asap.
- [x] tidy-up the routes, and improve the code quality.
- [x] improve documentation.
- [x] add a better, standardized error handling system.
- [x] remove the console logs.
- [x] dockerize the app, maybe ci/cd pipeline :D? too ambitious?
- [x] after all the above are done, add notification support and chat feature via websockets.


### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## text me if u want access to the db, ill share the creds w/you.

### `npm start`

For production mode

### `npm run test`
They don't exist yet, need to write them asap. also thinking about unit testing with jest.\
If you want to contribute, please write the tests.\
Run the test cases.