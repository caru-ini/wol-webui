import { checkDeviceHealth } from '@/lib/check-health';
import prisma from '@/lib/prisma';
import { sendWolCommand } from '@/lib/send-wol-command';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { setInterval } from 'timers';
import { z } from 'zod';

export const deviceSchema = z.object({
  name: z.string().min(1),
  mac: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/),
  ipAddress: z
    .string()
    .regex(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/),
  port: z.number().int().min(0).max(65535),
});

let isChecking = false;

export const devices = new Hono()
  .get('/', async (c) => {
    const devices = await prisma?.device.findMany();
    return c.json({ devices });
  })
  .post('/', zValidator('json', deviceSchema), async (c) => {
    const { ipAddress, mac, name, port } = c.req.valid('json');
    const device = await prisma?.device.create({ data: { name, mac, ipAddress, port } });
    return c.json({ device });
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id');
    const device = await prisma?.device.findUnique({ where: { id } });
    if (!device) return c.json({ message: 'Device not found' }, 404);
    return c.json({ device });
  })
  .put('/:id', (c) => {
    const id = c.req.param('id');
    return c.json({ message: `Updating ${id}` });
  })
  .delete('/:id', (c) => {
    const id = c.req.param('id');
    return c.json({ message: `Deleting ${id}` });
  })
  .post('/:id/wake', async (c) => {
    const id = c.req.param('id');
    const device = await prisma?.device.findUnique({ where: { id } });
    if (!device) return c.json({ message: 'Device not found' }, 404);
    if (device.status === 'ONLINE') return c.json({ message: 'Device is already online' });
    if (device.status === 'PENDING') return c.json({ message: 'Device is already waking' });
    await sendWolCommand(device);
    setTimeout(async () => {
      await prisma?.device.update({
        where: { id, AND: { status: 'PENDING' }, NOT: { status: 'ONLINE' } },
        data: { status: 'OFFLINE' },
      });
    }, 60000);
    await prisma?.device.update({ where: { id }, data: { status: 'PENDING' } });
    return c.json({ message: `Waking ${id}` });
  })
  .post('/startCheck', async (c) => {
    if (isChecking) return c.json({ message: 'Already checking device health' });
    isChecking = true;
    const devices = await prisma?.device.findMany();
    devices.forEach((device) => {
      console.log('Starting health check for', device.ipAddress);
      setInterval(async () => {
        console.log('Checking device health', device.ipAddress);
        const isOnline = await checkDeviceHealth(device.ipAddress);
        if (isOnline) {
          await prisma?.device.update({
            where: { id: device.id, NOT: { status: 'PENDING' } },
            data: { status: 'ONLINE' },
          });
        } else {
          await prisma?.device.update({
            where: { id: device.id, NOT: { status: 'PENDING', AND: { status: 'OFFLINE' } } },
            data: { status: 'OFFLINE' },
          });
        }
      }, 60000);
    });
    return c.json({ message: 'Started checking device health' });
  });
