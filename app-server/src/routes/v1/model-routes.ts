import {Router} from 'express'
import { modelController } from '../../controllers';
import accessMiddleware from '../../middlewares/access-middleware';

const router = Router()

router.post('/',accessMiddleware('admin'), modelController.create)
router.get('/list')

export { router as modelRoutes }