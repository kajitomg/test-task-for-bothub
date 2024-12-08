import {Router} from 'express'
import authMiddleware from '../../middlewares/auth-middleware';
import { authRoutes } from './auth-routes';
import { chatRoutes } from './chat-routes';
import { jobRoutes } from './job-routes';
import { messageRoutes } from './message-routes';
import { modelRoutes } from './model-routes';
import { roleRoutes } from './role-routes';
import { userRoutes } from './user-routes';

const router = Router()

router.use('/auth', authRoutes)
router.use('/user', authMiddleware,userRoutes)
router.use('/chat', authMiddleware, chatRoutes)
router.use('/message', authMiddleware, messageRoutes)
router.use('/job', authMiddleware, jobRoutes)
router.use('/model', authMiddleware, modelRoutes)
router.use('/role', authMiddleware, roleRoutes)

export { router as v1 }