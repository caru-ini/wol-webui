import { Hono } from 'hono';
import { devices } from './devices';

export const app = new Hono().basePath('/api');

export const routes = app
  .get('/', (c) => {
    return c.json({ message: 'Hello, World!' });
  })
  .route('/devices', devices);
