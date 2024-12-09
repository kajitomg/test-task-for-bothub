import {Router} from 'express'
import { roleController } from '../../controllers';
import accessMiddleware from '../../middlewares/access-middleware';

const router = Router()
/**
 * @openapi
 * /role:
 *   post:
 *     tags:
 *     - Role
 *     summary: Создание роли
 *     description: Создание роли доступа пользователей
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - name
 *             properties:
 *               name:
 *                 type: string
 *                 format: int256
 *                 example: user
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                   - ALL
 *                 nullable: true
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
router.post('/',accessMiddleware('admin'), roleController.create)

export { router as roleRoutes }