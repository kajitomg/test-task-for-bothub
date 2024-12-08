import {Router} from 'express'
import { jobController } from '../../controllers';

const router = Router()

router.get('/:id')
router.post('/:id/stop', jobController.stop)

export { router as jobRoutes }