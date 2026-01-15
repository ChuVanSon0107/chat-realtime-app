import express from 'express';
import { createGroupConversation, createPersonalConversation, getConversations } from '../controllers/conversation.controller.js';
import { upload } from '../middlewares/uploadImage.middleware.js';

const router = express.Router();

router.post('/group', upload.single('groupPic'), createGroupConversation);
router.post('/personal', createPersonalConversation);
router.get('/', getConversations);

export default router;