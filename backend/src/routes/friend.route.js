import express from 'express';
import { acceptFriendRequest, declineFriendRequest, getAllFriendRequests, getAllFriends, sendFriendRequest } from '../controllers/friend.controller.js';

const router = express.Router();

router.post('/request', sendFriendRequest);
router.post('/request/:requestId/accept', acceptFriendRequest);
router.post('/request/:requestId/decline', declineFriendRequest);
router.get('/', getAllFriends);
router.get('/request', getAllFriendRequests);

export default router;