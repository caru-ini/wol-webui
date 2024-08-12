import { cn } from '@/lib/utils';
import { Status } from '@prisma/client';
import { useState } from 'react';
import { GiPowerButton } from 'react-icons/gi';
import { LuLoader2 } from 'react-icons/lu';
import { z } from 'zod';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

export const deviceDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  mac: z.string(),
  ipAddress: z.string(),
  port: z.number(),
  status: z.nativeEnum(Status),
  createdAt: z.string(),
  updatedAt: z.string(),
});

type DeviceCardProps = {
  icon: JSX.Element;
  device: z.infer<typeof deviceDataSchema>;
  onPower?: () => void;
};

export const DeviceCard: React.FC<DeviceCardProps> = ({ icon, device, onPower }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const _onPower = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPower?.();
  };

  return (
    <>
      <div
        className='flex items-center rounded-md border border-border p-2'
        onClick={() => setIsModalOpen(true)}
      >
        <div className='size-fit rounded-sm border border-border p-2'>{icon}</div>
        <div className='ml-2 flex grow flex-col justify-center'>
          <h2>{device.name}</h2>
          <div className='flex items-center gap-x-1'>
            <Indicator status={device.status} />
            <p className='text-sm text-muted-foreground'>{device.status}</p>
          </div>
        </div>
        <Button
          className='ml-auto'
          variant='ghost'
          size='icon'
          disabled={device.status === Status.PENDING}
          onClick={_onPower}
        >
          {device.status !== Status.PENDING ? (
            <GiPowerButton size={20} color='#000' />
          ) : (
            <LuLoader2 size={20} className='animate-spin' />
          )}
        </Button>
      </div>
      {isModalOpen && <DeviceInfo device={device} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

const Indicator: React.FC<{ status: Status }> = ({ status }) => {
  const innerStatusStyles: Record<Status, string> = {
    ONLINE: 'bg-green-600',
    PENDING: 'bg-yellow-600',
    OFFLINE: 'bg-red-600',
  };

  const outerStatusStyles: Record<Status, string> = {
    ONLINE: 'bg-green-300',
    PENDING: 'bg-yellow-300',
    OFFLINE: 'bg-red-300',
  };
  return (
    <div>
      <div
        className={cn(
          `flex size-3 items-center justify-center rounded-full`,
          outerStatusStyles[status],
        )}
      >
        <div className={cn(`size-2 rounded-full`, innerStatusStyles[status])} />
      </div>
    </div>
  );
};

const DeviceInfo: React.FC<{ device: z.infer<typeof deviceDataSchema>; onClose: () => void }> = ({
  device,
  onClose,
}) => {
  return (
    <div
      className='fixed inset-0 z-20 flex items-center justify-center bg-black/50'
      onClick={onClose}
    >
      <Card className='space-y-3 rounded-lg bg-white' onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>{device.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>MAC: {device.mac}</p>
          <p>IP: {device.ipAddress}</p>
          <p>Port: {device.port}</p>
          <p>Status: {device.status}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
