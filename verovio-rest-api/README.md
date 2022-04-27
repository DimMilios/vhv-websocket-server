## Testing
First, spin up a `Docker` container for `Postgres` with the appropriate environment variables.

When switching databases we need to apply the DB schema to the chosen database which
also means generating a new `Prisma` client instance.
This is achieved with:
```sh
node_modules/.bin/prisma db push
```
**Issue**: how do we swap database URL used by prisma?

## References
- Integration testing with prisma: [URL](https://blog.ludicroushq.com/a-better-way-to-run-integration-tests-with-prisma-and-postgresql)