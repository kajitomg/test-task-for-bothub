import { Router } from 'express';
import { userController } from '../../controllers';
import accessMiddleware from '../../middlewares/access-middleware';

const router = Router()

router.get('/balance', userController.getMyBalance)
router.get('/:id/balance',accessMiddleware('admin'), userController.getBalance)
router.put('/:id/balance/set',accessMiddleware('admin'), userController.setBalance)
router.put('/:id/role/set',accessMiddleware('admin'), userController.setRole)

export { router as userRoutes }