'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { LuChevronLeft, LuLayoutGrid } from 'react-icons/lu';
import { Button, buttonVariants } from './ui/button';

type NavItemProps = {
  href: string;
  icon?: React.ReactNode;
  title?: string;
  isMenuOpen?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ href, icon, title, isMenuOpen }) => {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant: 'ghost',
          className: 'flex items-center justify-center px-2',
        }),
      )}
    >
      {icon}
      {isMenuOpen && <span className='ml-3'>{title}</span>}
    </Link>
  );
};

export const SideMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div
      className={cn(
        'duration-600 sticky left-0 top-0 flex h-svh w-16 flex-col items-center gap-3 border-r border-border transition-all ease-in-out',
        isMenuOpen ? 'w-48' : 'w-16',
      )}
    >
      <Button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        variant={'outline'}
        size={'icon'}
        className='absolute right-0 z-10 aspect-square translate-x-1/2 translate-y-1'
      >
        <LuChevronLeft
          className={cn(
            'transform transition-transform duration-500 ease-in-out',
            !isMenuOpen && 'rotate-180',
          )}
          size={18}
        />
      </Button>
      <nav className='mt-11 flex flex-col items-center gap-5'>
        <NavItem
          href='/'
          icon={<LuLayoutGrid size={24} />}
          title='Computers'
          isMenuOpen={isMenuOpen}
        />
      </nav>
    </div>
  );
};
