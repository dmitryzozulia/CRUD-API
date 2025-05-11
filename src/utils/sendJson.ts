import { ServerResponse } from 'http';

export const sendJson = (
  res: ServerResponse,
  statusCode: number,
  message: string | object,
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message }));
};
