import {Router} from 'express'
import { roleController } from '../../controllers';
import accessMiddleware from '../../middlewares/access-middleware';

const router = Router()

router.post('/',accessMiddleware('admin'), roleController.create)

export { router as roleRoutes }