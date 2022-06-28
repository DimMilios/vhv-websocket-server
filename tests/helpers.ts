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

export async function seedValues(seedEntities: SeedInclusions[]) {
  let cleanUpQueries = [];
  for (const s of seedEntities) {
    let p;
    switch (s.entity) {
      case 'User':
        p = prisma.user.deleteMany();
        break;
      case 'Document':
        p = prisma.document.deleteMany();
        break;
      case 'Comment':
        p = prisma.comment.deleteMany();
        break;
    }
    cleanUpQueries.push(p);

    if (s.clean) {
      cleanUpQueries.push(
        prisma.$executeRawUnsafe(
          `UPDATE sqlite_sequence SET seq=0 WHERE name="${s.entity}"`
        )
      );
    }
  }

  await prisma.$transaction(cleanUpQueries);

  for (const d of documentData) {
    const document = await prisma.document.create({
      data: d,
    });
  }

  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
  }
}