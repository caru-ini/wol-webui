import { Device } from '@prisma/client';
import { wake } from 'wol';

export const sendWolCommand = async (device: Device) => {
  console.log(`Sending WOL command to ${device.name}`);
  return await wake(device.mac, { address: device.ipAddress, port: device.port });
};
