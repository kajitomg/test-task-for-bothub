import {Router} from 'express'

const router = Router()

router.post('/signin')
router.post('/signup')
router.get('/refresh')

export { router as auth_routes }