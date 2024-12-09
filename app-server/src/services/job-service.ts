import OpenAI from 'openai';
import { streams } from '../controllers/chat-controller';
import { ApiError } from '../exceptions/api-error-exception';
import { Job, jobModel } from '../models/job/job-model';
import aiService from './ai-service';
import messageService from './message-service';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL
});

type JobPersonalData = Pick<Job, 'id'>
type JobTimestampsData = Pick<Job, 'created_at' | 'updated_at'>
type JobRefData = Pick<Job, 'chat_id' | 'message_id' | 'user_id'>

export type JobMainData = Omit<Job, keyof JobPersonalData | keyof JobTimestampsData | keyof JobRefData>

export default {
  async createJob(data: Pick<JobMainData, 'name'> & Partial<JobRefData> & Pick<JobRefData, 'user_id'>) {
    const currentTime = Date.now();

    const job = await jobModel.create({
      ...data,
      status: 'CREATE',
      updated_at: currentTime,
      created_at: currentTime,
    })
    
    if (!job) {
      throw ApiError.InternalServerError('Ошибка при создании запроса')
    }
    if (data.chat_id) {
      streams.get(data.chat_id)?.emit('JOB_CREATE', job)
    }
    
    return job
  },
  
  async createModelGenerationJob(data: Partial<JobRefData> & Pick<JobRefData, 'user_id'>) {
    return await this.createJob({
      name: 'MODEL_GENERATION',
      ...data,
    })
  },
  async startModelGenerationJob(id: JobPersonalData['id'], data: {
    message_id: number,
    model_id: number,
    prompt: string
  }) {
    const tokens = {
      in: 0,
      out: 0,
    }
    
    const model = await aiService.getAiById(data.model_id)
    
    let job = await this.updateJobById(id, {
      status: 'PENDING'
    })
    streams.get(job.chat_id)?.emit('JOB_START', job)
    
    const messages = await messageService.getAllMessagesByChatId(job.user_id, {scope: 'openaiMessage'})
    
    let message = await messageService.getMessageById(data.message_id, {scope: 'withJob'})
    
    await message.setJob(job)
    streams.get(job.chat_id)?.emit('MESSAGE_UPDATE', message)
    const stream = await openai.chat.completions.create({
      model: model.name,
      messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      stream: true,
    });
    
    streams.get(job.chat_id)?.on('JOB_ABORT', job_abort)
    function job_abort(streamed_job: Job) {
      if (streamed_job.id === job.id) {
        stream.controller.abort()
      }
    }
    
    let result = ''
    let finish = false
    for await (const chunk of stream) {
      const chunkContent = chunk.choices[0]?.delta?.content || ''
      if (chunk.choices[0].finish_reason) finish = Boolean(chunk.choices[0].finish_reason)
      
      if (chunkContent) {
        result += chunkContent
        message = await messageService.updateMessageById(message.id, {
          content: result
        }, {scope: 'light'});
      }
      
      if (chunk.usage?.total_tokens) {
        tokens.in = chunk.usage?.prompt_tokens
        tokens.out = chunk.usage?.completion_tokens
      }
    }
    if (stream.controller.signal.aborted && !finish) {
      job = await this.updateJobById(job.id, {status: 'STOPPED'});
      streams.get(job.chat_id)?.emit('JOB_STOP', job)
    }
    job = await this.updateJobById(id, {
      status: 'DONE'
    })
    streams.get(job.chat_id)?.emit('JOB_DONE', job)
    streams.get(job.chat_id)?.off('JOB_ABORT', job_abort)
    
    return {
      tokens,
      message_id: message.id,
      job_id: job.id
    }
  },
  
  async getJobById(id: JobPersonalData['id'], options?: { scope?: Partial<'isPending'> }) {
    const job = await jobModel.scope(options?.scope).findByPk(id)
    
    if (!job) {
      throw ApiError.InternalServerError('Ошибка при поиске запроса')
    }
    
    return job
  },
  
  async getJobsByChatId(id: number, options?: { scope?: Partial<'isPending'> }) {
    const jobs = await jobModel.scope(options?.scope).findAll({
      where: {
        chat_id: id
      }
    })
    
    if (!jobs) {
      throw ApiError.InternalServerError('Ошибка при поиске запросов')
    }
    
    return jobs
  },
  
  async getJobsByUserId(id: number, options?: { scope?: Partial<'isPending'> }) {
    const jobs = await jobModel.scope(options?.scope).findAll({
      where: {
        user_id: id
      }
    })
    
    if (!jobs) {
      throw ApiError.InternalServerError('Ошибка при поиске запросов')
    }
    
    return jobs
  },
  
  async updateJobById(id: JobPersonalData['id'], data: Pick<JobMainData, 'status'>) {
    const currentTime = Date.now();
    const job = await this.getJobById(id)
    
    await job.update({
      ...data,
      updated_at: currentTime
    })
    
    streams.get(job.chat_id)?.emit('JOB_UPDATE', job)
    
    if (!job) {
      throw ApiError.InternalServerError('Ошибка при обновлении запроса')
    }
    
    return job
  },
}