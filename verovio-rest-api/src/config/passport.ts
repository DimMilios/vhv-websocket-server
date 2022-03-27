import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import bcrypt from 'bcrypt';
import prisma from './db-client';


passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'current-password' },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findFirst({
          where: { email },
          select: { id: true, email: true, password: true, name: true, imageProfileURL: true },
        });
        if (!user)
          return done(null, false, { message: 'Incorrect credentials' });

        let passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches)
          return done(null, false, { message: 'Incorrect credentials' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  let userId = (user as { id: number }).id;
  done(null, userId);
});

passport.deserializeUser(async (userId: number, done: any) => {
  try {
    if (typeof userId == 'number') {
      const dbUser = await prisma.user.findFirst({
        where: { id: userId },
        select: { id: true, email: true, name: true, imageProfileURL: true,
          documents: { 
            select: {
              id: true, createdAt: true, updatedAt: true, title: true, y_doc_state: true,
              users: true
            }
          }
        },
      });
      done(null, dbUser);
    }
  } catch (err) {
    done(err);
  }
});
