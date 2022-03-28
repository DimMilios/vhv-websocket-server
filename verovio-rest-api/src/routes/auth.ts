import express from 'express';
import { validationResult } from 'express-validator';
import passport from 'passport';
import prisma from '../config/db-client';
import { loginRules, userCreateRules } from '../middleware/validators';
import { hashPassword } from '../util/passwordUtil';
import formidable from 'formidable';
import { URL } from 'url';

export const router = express.Router();

router.get('/login', (_req, res) => {
  res.render('login');
});

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
          .cookie(
            'user',
            JSON.stringify({
              id: user.id,
              email: user.email,
              name: user.name,
              imageProfileURL: user.imageProfileURL,
            })
          );

        let session = req.session as any;

        session?.joinURL ? res.redirect(session.joinURL) : res.redirect('/dashboard');
      })
    })(req, res, next);
  },
);

router.post('/logout', function(req, res) {
  req.logout();
  res.redirect('/auth/login');
});

router.get('/signUp', (_req, res) => res.render('signUp'));

router.post('/signUp', ...userCreateRules, (req, res, next) => {
  const form = formidable({ keepExtensions: true, uploadDir: `${__dirname}/../../public/profile-icons` });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    const errors = validationResult(fields);
  
    if (!errors.isEmpty()) {
      res.render('signUp', {
        user: fields,
        errors: errors.array(),
      });
      console.log('errors not empty',  errors.array())
      return;
    }

    let email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    let name = Array.isArray(fields.fullName) ? fields.fullName[0] : fields.fullName;
    let password = Array.isArray(fields.password) ? fields.password[0] : fields.password;
  
    // Check if email already exists in the DB
    const userExists = await prisma.user.findFirst({
      where: { email },
    });
    if (userExists) {
      res.render('signUp', {
        user: fields,
        errors: errors
          .array()
          .map(err => err.msg)
          .concat({ msg: 'This email is already in use' }),
      });
      console.log('use exists', errors.array())
      return;
    }

    let iconFile = Array.isArray(files.profileIcon) ? files.profileIcon[0] : files.profileIcon;
    const imageURL = new URL(`${req.get('origin')}/profile-icons/${iconFile.newFilename}`);
    console.log({ imageURL })

    let userData = {
      email,
      name,
      imageProfileURL: iconFile.mimetype?.startsWith('image') ? imageURL.toString() : null,
      password: await hashPassword(password),
    }
  
    try {
      // Save the user to DB
      const user = await prisma.user.create({ data: userData });
      console.log(`Created user with id: ${user.id}`);
    } catch (err) {
      console.log(err);
      next(err);
      return;
    }
  
    console.log({ fields, files });
    res.redirect('/auth/login');
    return;
  });
  return;
});
