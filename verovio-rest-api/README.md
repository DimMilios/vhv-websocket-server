## Testing
First, spin up a `Docker` container for `Postgres` with the appropriate environment variables.

When using `Postgres` we have to manually apply the database schema and 
then seed the database running on the container:

```sh
$ docker exec -it test-server /bin/bash
$ npx prisma db push
$ npx prisma db seed
```

## References
- Integration testing with prisma: [URL](https://blog.ludicroushq.com/a-better-way-to-run-integration-tests-with-prisma-and-postgresql)