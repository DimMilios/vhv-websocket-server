import express from 'express';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import passport from 'passport';
import prisma from '../config/db-client';
import { loginRules, userCreateRules } from '../middleware/validators';
import { hashPassword } from '../util/passwordUtil';

export const router = express.Router();

router.get('/login', (_req, res) => res.render('login'));

router.post(
  '/login',
  ...loginRules,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('login', {
        credentials: req.body,
        errors: errors.array(),
      });
      console.log(req.body);
      return;
    }

    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.render('login', {
          credentials: req.body,
          errors: [{ msg: info.message }]
        });
      }
      
      req.login(user, (error) => {
        if (error) return next(error);
        res
          .cookie('user', JSON.stringify({ id: user.id, email: user.email, name: user.name }))
          .redirect('/dashboard');
      })
    })(req, res, next);
  },
);

router.get('/signUp', (_req, res) => res.render('signUp'));

router.post('/signUp', ...userCreateRules, asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('signUp', {
      user: req.body,
      errors: errors.array(),
    });
    console.log(req.body);
    return;
  }

  // Check if email already exists in the DB
  const userExists = await prisma.user.findFirst({
    where: { email: req.body.email },
  });
  if (userExists) {
    return res.render('signUp', {
      user: req.body,
      errors: errors
        .array()
        .map(err => err.msg)
        .concat({ msg: 'This email is already in use' }),
    });
  }

  // Save the user to DB
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.fullName,
      password: await hashPassword(req.body.password),
    }
  });
  console.log(`Created user with id: ${user.id}`);

  res.redirect('/auth/login');
}));
