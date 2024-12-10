import {Router} from 'express';
import { messageController } from '../../controllers';

const router = Router()

/**
 * @openapi
 * /message/send:
 *   post:
 *     tags:
 *     - Message
 *     summary: Отправка сообщения
 *     description: Отправка сообщения в чат
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - prompt
 *             - chat_id
 *             properties:
 *               prompt:
 *                 type: string
 *                 format: int256
 *                 example: prompt text
 *               chat_id:
 *                 type: integer
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
 *                   $ref: '#/components/schemas/Message'
 */
router.post('/send', messageController.authorizingAccess, messageController.sendMessageInChat)

export { router as messageRoutes }