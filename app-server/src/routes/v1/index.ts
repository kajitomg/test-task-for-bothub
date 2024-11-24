import {Router} from 'express'
import { auth_routes } from './auth-routes';

const router = Router()

router.use('/auth', auth_routes)

export { router as v1 }