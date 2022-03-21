import express from 'express'
export const router = express.Router()

router.get('/', (req, res) => {
  res.send('<h1>Home Page</h1>');
})