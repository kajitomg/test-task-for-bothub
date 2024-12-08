require('dotenv').config();
import {Router} from 'express'
import { chatController } from '../../controllers';
import sseMiddleware from '../../middlewares/sse-middleware';

const router = Router()

router.post('/', chatController.create)
router.get('/:id')
router.put('/:id')
router.delete('/:id')
router.get('/list')
router.get('/:id/messages')
router.get('/:id/stream',  sseMiddleware, chatController.stream)
router.post('/:id/stop', chatController.stop)

export { router as chatRoutes }