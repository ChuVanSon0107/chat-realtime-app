import express from 'express';
import { getAllFriends } from '../controllers/friend.controller.js';

const router = express.Router();

router.get('/', getAllFriends);

export default router;