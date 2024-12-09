import {Router} from 'express'
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import authMiddleware from '../../middlewares/auth-middleware';
import { authRoutes } from './auth-routes';
import { chatRoutes } from './chat-routes';
import { jobRoutes } from './job-routes';
import { messageRoutes } from './message-routes';
import { modelRoutes } from './model-routes';
import { roleRoutes } from './role-routes';
import { userRoutes } from './user-routes';

const router = Router()
/**
 * @openapi
 * '/employees':
 *  get:
 *     tags:
 *     - Employee
 *     summary: Get all employee
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: number
 *                  name:
 *                    type: string
 *       400:
 *         description: Bad request
 */
router.use('/auth', authRoutes)
router.use('/user', authMiddleware,userRoutes)
router.use('/chat', authMiddleware, chatRoutes)
router.use('/message', authMiddleware, messageRoutes)
router.use('/job', authMiddleware, jobRoutes)
router.use('/model', authMiddleware, modelRoutes)
router.use('/role', authMiddleware, roleRoutes)

router.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { router as v1 }