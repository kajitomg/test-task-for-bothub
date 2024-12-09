import {Router} from 'express'
import { modelController } from '../../controllers';
import accessMiddleware from '../../middlewares/access-middleware';

const router = Router()

/**
 * @openapi
 * /model:
 *   post:
 *     tags:
 *     - Model
 *     summary: Создание модели
 *     description: Создание модели
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - prompt
 *             - chat_id
 *             properties:
 *               name:
 *                 type: string
 *                 format: int256
 *                 example: gpt-3.5-turbo
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
 *                   $ref: '#/components/schemas/Model'
 */
router.post('/',accessMiddleware('admin'), modelController.create)
/**
 * @openapi
 * /model/list:
 *   get:
 *     tags:
 *     - Model
 *     summary: Список всех моделей
 *     description: Список всех моделей
 *     responses:
 *       '200':
 *         description: OK
 */
router.get('/list')

export { router as modelRoutes }