require('dotenv').config();
import {Router} from 'express'
import { chatController } from '../../controllers';
import sseMiddleware from '../../middlewares/sse-middleware';

const router = Router()

/**
 * @openapi
 * /chat:
 *   post:
 *     tags:
 *     - Chat
 *     summary: Создание чата
 *     description: Создание чата
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - name
 *             - model_id
 *             properties:
 *               name:
 *                 type: string
 *                 format: int256
 *                 example: chat
 *               model_id:
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
 *                   $ref: '#/components/schemas/Chat'
 */
router.post('/', chatController.createChat)
/**
 * @openapi
 * /chat/{id}:
 *   get:
 *     tags:
 *     - Chat
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *     summary: Получение чата
 *     description: Получение чата по id
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item:
 *                   $ref: '#/components/schemas/Chat'
 */
router.get('/:id(\\\\d+)', chatController.authorizingAccess, chatController.getChatById)
/**
 * @openapi
 * /chat/{id}:
 *   put:
 *     tags:
 *     - Chat
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *     summary: Обновление чата
 *     description: Обновление чата по id
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 format: int256
 *                 example: chat
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
 *                   $ref: '#/components/schemas/Chat'
 */
router.put('/:id', chatController.authorizingAccess, chatController.updateChatById)
/**
 * @openapi
 * /chat/{id}:
 *   delete:
 *     tags:
 *     - Chat
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *     summary: Удаление чата
 *     description: Удаление чата по id чата
 *     responses:
 *       '200':
 *         description: OK
 */
router.delete('/:id', chatController.authorizingAccess, chatController.deleteChatById)
/**
 * @openapi
 * /chat/list:
 *   get:
 *     tags:
 *     - Chat
 *     summary: Получение списка чатов
 *     description: Получение списка чатов пользователя
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 */
router.get('/list', chatController.listMyChats)
/**
 * @openapi
 * /chat/{id}/messages:
 *   get:
 *     tags:
 *     - Chat
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *     summary: Получение списка сообщений чата
 *     description: Получение списка сообщений чата по id чата
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
router.get('/:id/messages', chatController.authorizingAccess, chatController.messagesById)
/**
 * @openapi
 * /chat/{id}/stream:
 *   get:
 *     tags:
 *     - Chat
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *     summary: Стрим соединение с сервером
 *     description: Стрим соединение с сервером, для получения данных в режиме реального времени по id чата
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   format: int64
 *                   example: 1
 *                 event:
 *                   type: string
 *                   format: int64
 *                   example: 'MESSAGE_CREATE'
 *                 data:
 *                   type: object
 *                   example: {}
 */
router.get('/:id/stream', chatController.authorizingAccess,  sseMiddleware, chatController.startStreamById)
/**
 * @openapi
 * /chat/{id}/stop:
 *   post:
 *     tags:
 *     - Chat
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *     summary: Остановка генерации
 *     description: Остановка генерации всех запросов в чате к openai по id чата
 *     responses:
 *       '200':
 *         description: OK
 */
router.post('/:id/stop', chatController.authorizingAccess, chatController.stopGenerationsById)

export { router as chatRoutes }