import MediaController from '~/controllers/media';
import authMiddleware from '~/middlewares/auth';
import { upload } from '~/services/storage';
import express from 'express';

let router = express.Router();

router.get('/media(/page/:page)?', authMiddleware, MediaController.getAll);
router.post('/media', authMiddleware, upload.array('media', 4), MediaController.create);
router.get('/media/:mediaUUID', MediaController.get);
router.get('/media/:mediaUUID/file', MediaController.getFile);
router.get('/media/:mediaUUID/download', MediaController.downloadFile);
router.put('/media/:mediaUUID', authMiddleware, MediaController.update);
router.delete('/media/:mediaUUID', authMiddleware, MediaController.delete);

router.get('/imageSizes', MediaController.getAllImageSizes);

export default router;
