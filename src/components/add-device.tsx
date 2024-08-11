'use client';
import { client } from '@/lib/hono';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuPlus, LuX } from 'react-icons/lu';
import { z } from 'zod';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';

export const addDeviceSchema = z.object({
  name: z.string(),
  mac: z.string(),
  ipAddress: z.string(),
  port: z.preprocess(
    (val) => parseInt(z.string().parse(val), 10),
    z.number().positive().min(0).max(65535),
  ),
});

export const AddDevice = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const form = useForm<z.infer<typeof addDeviceSchema>>({
    resolver: zodResolver(addDeviceSchema),
  });

  const onSubmit = (values: z.infer<typeof addDeviceSchema>) => {
    client.api.devices.$post({ json: values });
  };
  return (
    <>
      <div
        className='flex items-center gap-2 rounded-md border border-border p-3'
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className='size-fit rounded-sm border border-border p-2'>
          <LuPlus />
        </div>
        <p>Add device</p>
      </div>
      {isMenuOpen && (
        <div className='fixed inset-0 bg-black/50' onClick={() => setIsMenuOpen(false)}>
          <Card
            className='absolute left-1/2 top-1/2 w-[500px] -translate-x-1/2 -translate-y-1/2'
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                Add Device
                <Button
                  variant='ghost'
                  onClick={() => setIsMenuOpen(false)}
                  size={'icon'}
                  className='p-1'
                >
                  <LuX size={24} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-7'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder='Name' {...field} />
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
                        <FormLabel>mac Address</FormLabel>
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
                          <Input placeholder='IP Address' {...field} />
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
                          <Input min={0} max={65535} type='number' placeholder='Port' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className='justify-end'>
              <Button onClick={form.handleSubmit(onSubmit)}>Add</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};
