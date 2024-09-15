'use client';

import { client } from '@/lib/hono';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuPlus } from 'react-icons/lu';
import { useSWRConfig } from 'swr';
import { z } from 'zod';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';

export const addDeviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  mac: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Invalid MAC address'),
  ipAddress: z.string().ip('Invalid IP address'),
  port: z.preprocess(
    (val) => parseInt(z.string().parse(val), 10),
    z.number().int().positive().min(0).max(65535),
  ),
});

export const AddDevice: React.FC = () => {
  const { mutate } = useSWRConfig();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof addDeviceSchema>>({
    resolver: zodResolver(addDeviceSchema),
    defaultValues: {
      name: '',
      mac: '',
      ipAddress: '',
      port: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof addDeviceSchema>) => {
    try {
      const res = await client.api.devices.$post({ json: values });
      if (res.ok) {
        mutate('/api/devices');
        setOpen(false);
        form.reset();
      }
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant='outline' className='size-full justify-start'>
          <LuPlus className='mr-2 box-content size-4 rounded-md border border-border p-1.5' />
          Add device
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Device</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Device name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='mac'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MAC Address</FormLabel>
                  <FormControl>
                    <Input placeholder='AA:BB:CC:DD:EE:FF' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ipAddress'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address</FormLabel>
                  <FormControl>
                    <Input placeholder='192.168.1.1' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='port'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='8080' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full'>
              Add Device
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
