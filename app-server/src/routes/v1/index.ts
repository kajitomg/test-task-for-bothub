import {Router} from 'express'
import { authRoutes } from './auth-routes';
import { chatRoutes } from './chat-routes';
import { messageRoutes } from './message-routes';
import { modelRoutes } from './model-routes';
import { userRoutes } from './user-routes';

const router = Router()

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/chat', chatRoutes)
router.use('/message', messageRoutes)
router.use('/ai', modelRoutes)

export { router as v1 }