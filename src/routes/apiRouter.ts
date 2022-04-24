import express from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import MafiaScumRouter from './mafiascum/'
import UserRouter from './user'

const router = express.Router();
export default router;

router.use(cors({
	credentials: true,
	origin: '*'
}))
router.use(cookieParser());
router.get('/ping', (_req, res) => res.send('Pinged.'));
router.use('/ms', MafiaScumRouter);
router.use('/user', UserRouter);

router.all('*', (_req, res) => {
	return res.status(404).json({ error: 'API Route Unknown' })
})
