import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller.js';
import { upload } from '../middlewares/uploadImage.middleware.js';
import { checkConversationPermission } from '../middlewares/checkConversationPermission.middleware.js';

const router = express.Router();

router.post('/', upload.single('image'), checkConversationPermission, sendMessage);
router.get('/:conversationId', checkConversationPermission, getMessages);

export default router;