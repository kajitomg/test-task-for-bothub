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
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGVfaWQiOjQsImlhdCI6MTczMzc1NzEwMywiZXhwIjoxNzM2MzQ5MTAzfQ.ER_YgFxEh8DaSt_EDvgI7FB9jGP_4pQ9jz3dbEsM9Io'
 *                 refreshToken:
 *                   type: string
 *                   format: int64
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGVfaWQiOjQsImlhdCI6MTczMzc1NzEwMywiZXhwIjoxNzM2MzQ5MTAzfQ.ER_YgFxEh8DaSt_EDvgI7FB9jGP_4pQ9jz3dbEsM9Io'
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
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGVfaWQiOjQsImlhdCI6MTczMzc1NzEwMywiZXhwIjoxNzM2MzQ5MTAzfQ.ER_YgFxEh8DaSt_EDvgI7FB9jGP_4pQ9jz3dbEsM9Io'
 *                 refreshToken:
 *                   type: string
 *                   format: int64
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGVfaWQiOjQsImlhdCI6MTczMzc1NzEwMywiZXhwIjoxNzM2MzQ5MTAzfQ.ER_YgFxEh8DaSt_EDvgI7FB9jGP_4pQ9jz3dbEsM9Io'
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
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGVfaWQiOjQsImlhdCI6MTczMzc1NzEwMywiZXhwIjoxNzM2MzQ5MTAzfQ.ER_YgFxEh8DaSt_EDvgI7FB9jGP_4pQ9jz3dbEsM9Io'
 *                 refreshToken:
 *                   type: string
 *                   format: int64
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGVfaWQiOjQsImlhdCI6MTczMzc1NzEwMywiZXhwIjoxNzM2MzQ5MTAzfQ.ER_YgFxEh8DaSt_EDvgI7FB9jGP_4pQ9jz3dbEsM9Io'
 */
router.get('/refresh', authController.refreshAuth)

export { router as authRoutes }