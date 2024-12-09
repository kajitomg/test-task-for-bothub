import {Router} from 'express'
import { authController } from '../../controllers';

const router = Router()

/**
 * @openapi
 * /auth/signin:
 *   post:
 *     tags:
 *     - Auth
 *     summary: Аутентификация
 *     description: Аутентификация пользователя
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - username
 *             - password
 *             properties:
 *               username:
 *                 type: string
 *                 format: int256
 *                 example: User
 *               password:
 *                 type: string
 *                 format: int64
 *                 example: password123
 *       required: true
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                   format: int64
 *                   example: 'd1690a07-3780-4068-810f-9b5bbf2931b2:deviceid:1724331617186-7911323144381093275:8BJhqLq5AQU:1724332055675'
 *                 refreshToken:
 *                   type: string
 *                   format: int64
 *                   example: 'd1690a07-3780-4068-810f-9b5bbf2931b2:deviceid:1724331617186-7911323144381093275:8BJhqLq5AQU:1724332055675'
 */
router.post('/signin', authController.signin)
/**
 * @openapi
 * /auth/signup:
 *   post:
 *     tags:
 *     - Auth
 *     summary: Регистрация
 *     description: Регистрация пользователя
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - username
 *             - password
 *             properties:
 *               username:
 *                 type: string
 *                 format: int256
 *                 example: User
 *               password:
 *                 type: string
 *                 format: int64
 *                 example: password123
 *       required: true
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                   format: int64
 *                   example: 'd1690a07-3780-4068-810f-9b5bbf2931b2:deviceid:1724331617186-7911323144381093275:8BJhqLq5AQU:1724332055675'
 *                 refreshToken:
 *                   type: string
 *                   format: int64
 *                   example: 'd1690a07-3780-4068-810f-9b5bbf2931b2:deviceid:1724331617186-7911323144381093275:8BJhqLq5AQU:1724332055675'
 */
router.post('/signup', authController.signup)
/**
 * @openapi
 * /auth/refresh:
 *   get:
 *     tags:
 *     - Auth
 *     summary: Восстановление аутентификации
 *     description: Восстановление аутентификации посредством токена доступа
 *     security:
 *     - refreshToken: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                   format: int64
 *                   example: 'd1690a07-3780-4068-810f-9b5bbf2931b2:deviceid:1724331617186-7911323144381093275:8BJhqLq5AQU:1724332055675'
 *                 refreshToken:
 *                   type: string
 *                   format: int64
 *                   example: 'd1690a07-3780-4068-810f-9b5bbf2931b2:deviceid:1724331617186-7911323144381093275:8BJhqLq5AQU:1724332055675'
 */
router.get('/refresh', authController.refreshAuth)

export { router as authRoutes }