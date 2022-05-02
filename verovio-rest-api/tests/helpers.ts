import prisma from '../src/config/db-client';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

const documentData: Prisma.DocumentCreateInput[] = [
  { title: 'demo song 1' },
  { title: 'Second demo song' },
];

const commentData: Prisma.CommentCreateInput[] = [
  { content: 'My first comment' },
  { content: 'My second comment' },
  { content: 'This is a demo comment', parentComment: { connect: { id: 1 } } },
];

const saltRounds = 5;
const hashPassword = (password: string, saltRounds: number) => {
  let salt = bcrypt.genSaltSync(saltRounds);
  let hash = bcrypt.hashSync(password, salt);
  return hash;
};

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'dim@prisma.io',
    password: hashPassword('123', saltRounds),
    name: 'Dimitris',
    imageProfileURL: 'http://localhost:3001/profile-icons/man.png',
    documents: {
      connect: [{ id: 1 }, { id: 2 }],
    },
  },
  {
    email: 'anton@prisma.io',
    password: hashPassword('123', saltRounds),
    name: 'Antonis',
    imageProfileURL: 'http://localhost:3001/profile-icons/man3.png',
    documents: {
      connect: [{ id: 1 }, { id: 2 }],
    },
  },
  {
    email: 'george@prisma.io',
    password: hashPassword('123', saltRounds),
    name: 'George',
    imageProfileURL: 'http://localhost:3001/profile-icons/man2.png',
    documents: {
      connect: { id: 1 },
    },
  },
];

export interface SeedInclusions {
  entity: 'User' | 'Document' | 'Comment';
  clean: boolean;
}

/**
 * Initialize database with values
 * 
 * **IMPORTANT**: entities with dependencies should come *AFTER* their dependents sequentially
 * 
 * @param seedEntities defines the types of prisma entities to be seeded
 */
export async function seedValues(seedEntities: SeedInclusions[]) {
  for (const s of seedEntities) {
    switch (s.entity) {
    case 'Document':
      for (const d of documentData) {
        const doc = await prisma.document.create({
          data: d,
        });
        console.log(`✨ Created document with id: ${doc.id} successfully created`);
      }
      break;
    case 'User':
      for (const u of userData) {
        const user = await prisma.user.create({
          data: u,
        });
        console.log(`✨ Created user with id: ${user.id} successfully created`);
      }
      break;
    case 'Comment':
      for (const c of commentData) {
        const comment = await prisma.comment.create({
          data: c,
        });
        console.log(`✨ Created comment with id: ${comment.id} successfully created`);
      }
      break;
    }
  }
}

export async function resetAll() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      try {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }
}