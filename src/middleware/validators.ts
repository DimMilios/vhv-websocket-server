import { body, param } from 'express-validator';
import prisma from '../config/db-client';

export const userCreateRules = [
  body('email', 'Email must not be empty.')
    .trim()
    .isEmail()
    .withMessage('Email address is invalid.'),
  body('password', 'Password must not be empty.')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Password should be at least 3 characters long.'),
  body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password.');
    }
    return true;
  }),
  body('fullName', 'Invalid full name.')
    .optional({ nullable: true })
    .isString()
    .trim()
    .escape(),
];

export const loginRules = [
  body('email', 'Email must not be empty.')
    .trim()
    .isEmail()
    .withMessage('Email address is invalid.'),
  body('current-password', 'Password must not be empty.')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Password should be at least 3 characters long.'),
];

export const documentCreateRules = [
  body('document-title').custom(async (value, { req }) => {
    if (value.length === 0) {
      return Promise.reject('Title must not be empty.');
    }

    let userId = req.user.id;
    let existingDoc = await prisma.document.findFirst({
        where: {
          title: value,
          users: { some: { id: userId } }
      },
    });

    // console.log('existingDoc', existingDoc);
    if (existingDoc) {
      return Promise.reject(`A document with title: "${value}" already exists`);
    }
  }),
];

export const commentCreateRules = [
  body('content', 'Comment content must not be empty.')
    .notEmpty()
    .isString()
    .trim()
    .escape()
    .unescape(),
  body('documentId')
    .isNumeric().toInt(),
  body('parentCommentId')
    .optional({ nullable: true })
    .isNumeric()
    .toInt(),
  body('clientId')
    .isNumeric()
    .toInt(),
  body('multiSelectElements')
    .optional({ nullable: true })
    .isString()
];

export const commentDeleteRules = [
  body('userId').isAlphanumeric().toInt(),
  body('documentId').isAlphanumeric().toInt(),
  body('clientId').isAlphanumeric().toInt(),
  param('commentId').isAlphanumeric().toInt(),
]