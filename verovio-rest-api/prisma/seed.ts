import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const documentData: Prisma.DocumentCreateInput[] = [
  { title: 'demo song 1' },
  { title: 'Second demo song' },
];

const commentData: Prisma.CommentCreateInput[] = [
  { content: 'My first comment' },
  { content: 'My second comment' },
  { content: 'This is a demo comment', parentComment: { connect: { id: 1 } } },
];

const saltRounds = 12;
const hashPassword = (password: string, saltRounds: number) => {
  let salt = bcrypt.genSaltSync(saltRounds);
  let hash = bcrypt.hashSync(password, salt);
  return hash;
}

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'dim@prisma.io',
    password: hashPassword('123', saltRounds),
    name: 'Dimitris DenSouLew',
    documents: {
      connect: [{ id: 1 }, { id: 2 }]
    }
  },
  {
    email: 'nick@prisma.io',
    password: hashPassword('123', saltRounds),
    name: 'Nikos Pappas',
    documents: {
      connect: [{ id: 1 }, { id: 2 }]
    }
  },
  {
    email: 'maria@prisma.io',
    password: hashPassword('123', saltRounds),
    name: 'Maria Pappa',
    documents: {
      connect: { id: 1 }
    }
  },
];

async function main() {
  console.log('Start seeding...')
  
  for (const d of documentData) {
    const document = await prisma.document.create({
      data: d
    })
    console.log(`Created document with id: ${document.id}`)
  }

  for (const u of userData) {
    const user = await prisma.user.create({
      data: u
    })
    console.log(`Created user with id: ${user.id}`)
  }

  for (const c of commentData) {
    const comment = await prisma.comment.create({ data: c })
    console.log(`Created comment with id: ${comment.id}`)

    let a = await prisma.commentsOnDocumentsByUsers.create({
      data: {
        commentId: comment.id,
        documentId: 1,
        userId: Math.floor(Math.random() * 3) + 1
      }
    })
  }
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
