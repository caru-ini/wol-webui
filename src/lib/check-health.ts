import ping from 'ping';

export const checkDeviceHealth = async (ipAddress: string) => {
  return await ping.promise.probe(ipAddress).then((res) => res.alive);
};
