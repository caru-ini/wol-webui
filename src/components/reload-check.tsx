'use client';
import { client } from '@/lib/hono';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { LuRefreshCcw } from 'react-icons/lu';
import { Button } from './ui/button';

export const ReloadCheck = () => {
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const onClick = async () => {
    setIsWaitingForResponse(true);
    await client.api.devices.stopCheck.$post();
    await client.api.devices.startCheck.$post();
    setIsWaitingForResponse(false);
  };
  return (
    <Button onClick={onClick} disabled={isWaitingForResponse} variant={'ghost'} size={'icon'}>
      <LuRefreshCcw size={18} className={cn(isWaitingForResponse && 'animate-spin')} />
    </Button>
  );
};
