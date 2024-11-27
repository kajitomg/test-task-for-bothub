import {Router} from 'express'

const router = Router()

router.get('/:id/balance')
router.put('/:id/balance/set')

export { router as userRoutes }