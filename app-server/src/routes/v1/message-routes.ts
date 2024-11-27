import {Router} from 'express'

const router = Router()

router.post('/send')
router.get('/:id')
router.put('/:id')
router.delete('/:id')
router.get('/list')
router.get('/messages')

export { router as messageRoutes }