'use client';
import { AddDevice } from '@/components/add-device';
import { DeviceCard, deviceDataSchema } from '@/components/device-card';
import { ReloadCheck } from '@/components/reload-check';
import { client } from '@/lib/hono';
import { Status } from '@prisma/client';
import { useEffect } from 'react';
import { BsDisplay } from 'react-icons/bs';
import useSWR from 'swr';
import { z } from 'zod';

const fetcher = () =>
  client.api.devices
    .$get()
    .then((res) => res.json())
    .then((res) => res.devices)
    .then((data) => z.array(deviceDataSchema).parse(data));

export default function Home() {
  const {
    data: devices,
    error,
    isLoading,
    mutate,
  } = useSWR('/api/devices', fetcher, {
    refreshInterval(latestData) {
      const hasPendingDevices = latestData?.some((device) => device.status === Status.PENDING);
      return hasPendingDevices ? 5000 : 10000;
    },
  });

  useEffect(() => {
    const startCheck = async () => {
      client.api.devices.startCheck
        .$post()
        .then((res) => res.json())
        .then(console.log);
    };
    startCheck();
  }, []);

  const onPower = (id: string) => {
    client.api.devices[':id'].wake.$post({ param: { id } }).then(() => {
      mutate();
    });
  };

  const onRemove = (id: string) => {
    client.api.devices[':id'].$delete({ param: { id } }).then(() => {
      mutate();
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div className='container mt-8 flex flex-col gap-5'>
      <div className='flex'>
        <h1 className='text-4xl font-bold'>Computers</h1>
        <ReloadCheck />
      </div>
      <div className='grid grid-cols-1 gap-2 md:grid-cols-3'>
        {devices &&
          devices.map((device) => (
            <DeviceCard
              key={device.name}
              icon={<BsDisplay />}
              device={device}
              onPower={() => onPower(device.id)}
            />
          ))}
        <AddDevice />
      </div>
    </div>
  );
}
