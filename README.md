## Need to be installed

- `node.js`
- `npm` (Downloaded with `node.js`)

## Project dependencies

- Dependency installation for the API
  ```sh
  $ npm install
  ```
- Start the server in development mode
  ```sh
  $ npm run dev
  ```
- Compile and run the server in production mode
  ```sh
  $ npm run build
  $ npm start
  ```

## Database setup

- Apply prisma schema to the database
  ```sh
  $ npx prisma db push
  ```
- Generate prisma client
  ```sh
  $ npx prisma generate
  ```
- Put some test data to the database
  ```sh
  $ npx prisma db seed
  ```

## Environment variables

- `DATABASE_URL`: MySQL connection string
  - E.g.: `DATABASE_URL=mysql://user:password@localhost:3306/database_name`
- `PORT`: The port where the server will be accepting connections (default `3001`).
- `SESSION_SECRET`: Secret string used for HTTP sessions.

**Note**: These variables can be also passed by specifying a `.env` file located at project root.
