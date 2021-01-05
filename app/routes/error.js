import config from '~/config';
import express from 'express';

let router = express.Router();

router.get('/404', async (req, res) => {
  return res.status(404).json({
    message: 'Route not found',
  });
});

export default router;
