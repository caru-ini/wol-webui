import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { client } from '@/lib/hono';
import { cn } from '@/lib/utils';
import { Status } from '@prisma/client';
import React from 'react';
import { GiPowerButton } from 'react-icons/gi';
import { LuLoader2, LuTrash } from 'react-icons/lu';
import { useSWRConfig } from 'swr';
import { z } from 'zod';

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
  const _onPower = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPower?.();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='flex items-center rounded-md border border-border p-2'>
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
      </DialogTrigger>
      <DeviceInfo device={device} />
    </Dialog>
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

const DeviceInfo: React.FC<{ device: z.infer<typeof deviceDataSchema> }> = ({ device }) => {
  const { mutate } = useSWRConfig();
  const onRemove = () => {
    client.api.devices[':id'].$delete({ param: { id: device.id } });
    mutate('/api/devices');
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{device.name}</DialogTitle>
        <DialogDescription>Device Information</DialogDescription>
      </DialogHeader>
      <div className='py-4'>
        <p>MAC: {device.mac}</p>
        <p>IP: {device.ipAddress}</p>
        <p>Port: {device.port}</p>
        <p className='flex items-center gap-x-2'>
          Status: <Indicator status={device.status} /> {device.status}
        </p>
      </div>
      <DialogFooter>
        <Button variant='destructive' onClick={onRemove} className='w-full gap-x-2'>
          <LuTrash size={16} />
          Remove
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
