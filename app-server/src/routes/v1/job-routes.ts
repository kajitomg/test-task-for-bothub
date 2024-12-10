import {Router} from 'express'
import { jobController } from '../../controllers';

const router = Router()
/**
 * @openapi
 * /job/{id}:
 *   get:
 *     tags:
 *     - Job
 *     summary: Получение процесса
 *     description: Получение процесса по id процесса
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item:
 *                   $ref: '#/components/schemas/Job'
 */
router.get('/:id', jobController.authorizingAccess, jobController.getJobById)
/**
 * @openapi
 * /job/{id}/stop:
 *   post:
 *     tags:
 *     - Job
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *     summary: Остановка процесса
 *     description: Остановка процесса по id процесса
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item:
 *                   $ref: '#/components/schemas/Job'
 */
router.post('/:id/stop', jobController.authorizingAccess, jobController.stop)

export { router as jobRoutes }