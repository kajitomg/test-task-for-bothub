import {Router} from 'express';
import { messageController } from '../../controllers';

const router = Router()

router.post('/send', messageController.send)

export { router as messageRoutes }