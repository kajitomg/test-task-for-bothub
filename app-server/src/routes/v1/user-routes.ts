import { Router } from 'express';
import { userController } from '../../controllers';
import accessMiddleware from '../../middlewares/access-middleware';

const router = Router()
/**
 * @openapi
 * /user/balance:
 *   get:
 *     tags:
 *     - User
 *     summary: Получение баланса главного кошелька
 *     description: Получение баланса главного кошелька
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   format: int64
 *                   example: 10000
 */
router.get('/balance', userController.getMyBalance)
/**
 * @openapi
 * /user/{id}/balance:
 *   get:
 *     tags:
 *     - User
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *        type: integer
 *     summary: Получение баланса главного кошелька
 *     description: Получение баланса главного кошелька по id пользователя
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   format: int64
 *                   example: 10000
 */
router.get('/:id/balance',accessMiddleware('admin'), userController.getBalanceById)
/**
 * @openapi
 * /user/{id}/balance/set:
 *   put:
 *     tags:
 *     - User
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *     summary: Установка баланса главного кошелька
 *     description: Установка баланса главного кошелька по id пользователя
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - balance
 *             properties:
 *               balance:
 *                 type: number
 *                 format: int64
 *                 example: 10000
 *       required: true
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   format: int64
 *                   example: 10000
 */
router.put('/:id/balance/set',accessMiddleware('admin'), userController.setBalanceById)
/**
 * @openapi
 * /user/{id}/role/set:
 *   put:
 *     tags:
 *     - User
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *     summary: Установка роли пользователю
 *     description: Установка роли пользователю по id пользователя
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - role_id
 *             properties:
 *               role_id:
 *                 type: number
 *                 format: int64
 *                 example: 1
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
 *                   $ref: '#/components/schemas/Role'
 */
router.put('/:id/role/set',accessMiddleware('admin'), userController.setRoleByRoleId)

export { router as userRoutes }