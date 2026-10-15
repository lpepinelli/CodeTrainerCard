import express from 'express'
import { getCard, getCardSource } from '../controller/cardController';

const router = express.Router()

router.get('/card/:username', getCard)
router.get('/card/:username/data', getCardSource)

export default router
