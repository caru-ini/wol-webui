import { cn } from '@/lib/utils';
import { Status } from '@prisma/client';
import { GiPowerButton } from 'react-icons/gi';
import { LuLoader2 } from 'react-icons/lu';
import { Button } from './ui/button';

type DeviceCardProps = {
  icon: JSX.Element;
  title: string;
  status: Status;
  description?: string;
  onPower?: () => void;
};

export const DeviceCard: React.FC<DeviceCardProps> = ({
  icon,
  title,
  status,
  description,
  onPower,
}) => {
  return (
    <div className='flex items-center rounded-md border border-border p-2'>
      <div className='size-fit rounded-sm border border-border p-2'>{icon}</div>
      <div className='ml-2 flex grow flex-col justify-center'>
        <h2>{title}</h2>
        <div className='flex items-center gap-x-1'>
          <Indicator status={status} />
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>
      </div>
      <Button
        className='ml-auto'
        variant='ghost'
        size='icon'
        disabled={status === Status.PENDING}
        onClick={onPower}
      >
        {status !== Status.PENDING ? (
          <GiPowerButton size={20} color='#000' />
        ) : (
          <LuLoader2 size={20} className='animate-spin' />
        )}
      </Button>
    </div>
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
