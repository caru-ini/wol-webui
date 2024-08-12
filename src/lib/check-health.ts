import { toIP } from '@network-utils/arp-lookup';
import { Device } from '@prisma/client';
import ping from 'ping';

export const checkDeviceHealth = async (mac: string) => {
  console.log(`[HEALTH CHECK] Checking device with MAC address ${mac}`);
  const ipAddress = await toIP(mac);
  if (!ipAddress) return false;
  return await ping.promise.probe(ipAddress).then((res) => res.alive);
};

export const updateDeviceStatus = async (device: Device) => {
  const isOnline = await checkDeviceHealth(device.mac);
  if (isOnline) {
    await prisma?.device.update({
      where: { id: device.id, NOT: { status: 'PENDING' } },
      data: { status: 'ONLINE' },
    });
  } else {
    await prisma?.device.update({
      where: { id: device.id, NOT: { status: 'PENDING' } },
      data: { status: 'OFFLINE' },
    });
  }
};
