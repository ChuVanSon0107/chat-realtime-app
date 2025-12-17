import express from 'express';
import { sendFriendRequest, declineFriendRequest, acceptFriendRequest, getAllFriendRequests } from '../controllers/friendRequest.controller.js';

const router = express.Router();

router.post('/', sendFriendRequest);
router.post('/:id/accept', acceptFriendRequest);
router.post('/:id/decline', declineFriendRequest);
router.get('/', getAllFriendRequests);

export default router;