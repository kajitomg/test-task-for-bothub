import {Router} from 'express'
import { authController } from '../../controllers';

const router = Router()

router.post('/signin', authController.signin)
router.post('/signup', authController.signup)
router.get('/refresh', authController.refreshAuth)

export { router as authRoutes }