import { Response } from 'express';

function sendSSE<
  E extends Array<string> = Array<string>,
  D extends object | string | number = string,
> (
  res: Response,
  data: { data?: D , event?: E[number], id?: number}
) {
  if (data.id) {
    res.write(`id: ${data.id}\n`);
  }
  if (data.event) {
    res.write(`event: ${data.event}\n`);
  }
  res.write(`data: ${JSON.stringify(data.data || {})}\n\n`);
  
}

export default sendSSE;