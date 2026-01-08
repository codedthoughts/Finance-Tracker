import express from 'express';
import {getAllBuckets, addBucket, updateBucket, deleteBucket} from '../controllers/bucket.controllers.js';

const router = express.Router();

router.get('/all', getAllBuckets);
router.post('/add', addBucket);
router.put('/update/:id', updateBucket);
router.delete('/delete/:id', deleteBucket);

export default router;