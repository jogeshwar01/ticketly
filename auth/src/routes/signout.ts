import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  req.session = null;  // in docs of cookie-session

  res.send({});
});

export { router as signoutRouter };
