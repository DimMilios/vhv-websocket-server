import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import passport from 'passport';
import formidable from 'formidable';
import { URL } from 'url';
import { hashPassword } from '../util/passwordUtil';
import prisma from '../config/db-client';
import { dashboardDocuments } from '../util/format';

function getLogin(req: Request, res: Response) {
  res.render('login');
}

function postLogin(req: Request, res: Response, next: NextFunction) {
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
        errors: [{ msg: info.message }],
      });
    }

    req.login(user, error => {
      if (error) return next(error);
      res.cookie(
        'user',
        JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          imageProfileURL: user.imageProfileURL,
        })
      );

      let session = req.session as any;
      if (session?.joinURL) {
        return res.redirect(session.joinURL);
      } else {
        return res.redirect('/dashboard');
      }
    });
  })(req, res, next);
}

function logout(req: Request, res: Response) {
  req.logout();
  res.redirect('/auth/login');
}

function getSignUp(_req: Request, res: Response) {
  return res.render('signUp');
}

async function postSignUp(req: Request, res: Response, next: NextFunction) {
  const form = formidable({
    keepExtensions: true,
    uploadDir: `${__dirname}/../../public/profile-icons`,
  });

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
      console.log('errors not empty', errors.array());
      return;
    }

    let email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    let name = Array.isArray(fields.fullName)
      ? fields.fullName[0]
      : fields.fullName;
    let password = Array.isArray(fields.password)
      ? fields.password[0]
      : fields.password;

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
      console.log('use exists', errors.array());
      return;
    }

    let iconFile = Array.isArray(files.profileIcon)
      ? files.profileIcon[0]
      : files.profileIcon;
    const imageURL = new URL(
      `${req.get('origin')}/profile-icons/${iconFile.newFilename}`
    );
    console.log({ imageURL });

    let userData = {
      email,
      name,
      imageProfileURL: iconFile.mimetype?.startsWith('image')
        ? imageURL.toString()
        : null,
      password: await hashPassword(password),
    };

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
}

async function findUsersForDocument(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const docId = Number(req.query.docId);

  try {
    const users = await prisma.user.findMany({
      where: {
        documents: {
          some: { id: docId },
        },
      },
      select: { id: true, name: true, email: true, imageProfileURL: true },
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function inviteUserByEmail(req: any, res: Response, next: NextFunction) {
  const email = req.params.email;
  const documentId = Number(req.body.documentId);
  // Check that a user with that email is registered.
  // Check if user with that email already has access to the document.
  try {
    const invitation = await prisma.pendingInvitations.create({
      data: {
        email,
        documentId,
      },
      include: {
        document: true,
      },
    });

    const inviteURL = new URL(
      req.protocol + '://' + req.get('host') + req.baseUrl + '/join'
    );
    // inviteURL.pathname = '/join';
    inviteURL.searchParams.append('email', email);
    inviteURL.searchParams.append('docId', invitation.documentId.toString());
    inviteURL.searchParams.append('docTitle', invitation.document.title);

    res.status(201).json({
      inviteURL: inviteURL.toString(),
      createdAt: invitation.createdAt,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function joinInvitation(req: Request, res: Response, next: NextFunction) {
  let { email, docId } = req.query;

  console.log(req.query);

  try {
    email = email?.toString();
    if (email) {
      const [, , invited] = await prisma.$transaction([
        prisma.pendingInvitations.findFirst({
          where: { email, documentId: Number(docId), accepted: false },
        }),
        prisma.pendingInvitations.updateMany({
          where: { email, documentId: Number(docId) },
          data: {
            accepted: true,
          },
        }),
        prisma.user.update({
          data: {
            documents: { connect: { id: Number(docId) } },
          },
          where: { email: email?.toString() },
          include: { documents: { include: { users: true } } },
        }),
      ]);

      if (invited) {
        res.render('dashboard', dashboardDocuments(invited.documents, email));
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export default {
  getLogin,
  postLogin,
  logout,
  getSignUp,
  postSignUp,
  findUsersForDocument,
  inviteUserByEmail,
  joinInvitation,
};
