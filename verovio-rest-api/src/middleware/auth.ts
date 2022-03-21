import express from 'express';

export const requireAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.isAuthenticated()) {
    res.redirect('/auth/login');
    return;
  }

  return next();
};

export const requireAuthWithPath = (path: string) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.isAuthenticated() && req.path.includes(path)) {
    res.redirect('/auth/login');
    return;
  }

  return next();
};
