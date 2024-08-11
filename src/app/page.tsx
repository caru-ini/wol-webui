'use client';
import { AddDevice } from '@/components/add-device';
import { DeviceCard } from '@/components/device-card';
import { client } from '@/lib/hono';
import { Status } from '@prisma/client';
import { useEffect } from 'react';
import { BsDisplay } from 'react-icons/bs';
import useSWR from 'swr';

const fetcher = () =>
  client.api.devices
    .$get()
    .then((res) => res.json())
    .then((res) => res.devices);

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div className='container mt-8 flex flex-col gap-5'>
      <h1 className='text-4xl font-bold'>Computers</h1>
      <div className='grid grid-cols-1 gap-2 md:grid-cols-3'>
        {devices?.length &&
          devices.map((device) => (
            <DeviceCard
              key={device.name}
              icon={<BsDisplay />}
              title={device.name}
              status={device.status}
              description={device.status}
              onPower={() => onPower(device.id)}
            />
          ))}
        <AddDevice />
      </div>
    </div>
  );
}
