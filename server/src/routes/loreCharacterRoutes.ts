import express from 'express';
import {
    getCharacters,
    getCharacterById,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    uploadImage
} from '../controllers/loreCharacterController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../config/upload';

const router = express.Router();

router.route('/')
    .get(getCharacters)
    .post(protect, adminOnly, createCharacter);

router.route('/:id')
    .get(getCharacterById)
    .put(protect, adminOnly, updateCharacter)
    .delete(protect, adminOnly, deleteCharacter);

router.route('/:id/image')
    .post(protect, adminOnly, upload.single('image'), uploadImage);

export default router;
