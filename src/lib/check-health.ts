import prisma from '@/lib/prisma';
import { toIP } from '@network-utils/arp-lookup';
import { Device } from '@prisma/client';
import ping from 'ping';

export const checkDeviceHealth = async (mac: string) => {
  console.log(`[HEALTH CHECK] Checking device with MAC address ${mac}`);
  const ipAddress = await toIP(mac);
  console.log(`[HEALTH CHECK] Device with MAC address ${mac} has IP address ${ipAddress}`);
  if (!ipAddress) return false;
  return await ping.promise.probe(ipAddress).then((res) => res.alive);
};

export const updateDeviceStatus = async (device: Device) => {
  const isOnline = await checkDeviceHealth(device.mac);
  console.log(`[HEALTH CHECK] Device ${device.id} is ${isOnline ? 'online' : 'offline'}`);
  if (isOnline) {
    await prisma?.device.updateMany({
      where: { id: device.id, NOT: { status: 'ONLINE' } },
      data: { status: 'ONLINE' },
    });
  } else {
    await prisma?.device.updateMany({
      where: { id: device.id, status: 'ONLINE' },
      data: { status: 'OFFLINE' },
    });
  }
};
