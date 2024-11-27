import {Router} from 'express'

const router = Router()

router.post('/')
router.get('/list')

export { router as modelRoutes }