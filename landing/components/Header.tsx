'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { cn } from '@aiready/components';
import { FileCode, BookOpen } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const isDocs = pathname?.startsWith('/docs');
  const isBlog = pathname?.startsWith('/blog');

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-zinc-800/50 shadow-sm"
    >
      <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={cn(
              'flex items-center gap-2 flex-shrink-0 transition-all duration-300',
              !isBlog && !isDocs && 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'
            )}
          >
            <Image
              src="/logo-text-transparent.png"
              alt="AIReady Logo"
              width={210}
              height={48}
              className="h-8 sm:h-10 md:h-12 w-auto dark:hidden"
              priority
            />
            <Image
              src="/logo-text-dark.png"
              alt="AIReady Logo"
              width={210}
              height={48}
              className="h-8 sm:h-10 md:h-12 w-auto hidden dark:block"
              priority
            />
          </motion.div>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          <Link
            href="/docs"
            className={cn(
              'hidden sm:flex items-center gap-1.5 text-sm md:text-base font-medium transition-colors relative group',
              isDocs
                ? 'glow-blue'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:glow-blue'
            )}
          >
            <FileCode className="w-4 h-4" />
            <span>Docs</span>
            <span
              className={cn(
                'absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300',
                isDocs ? 'w-full' : 'w-0 group-hover:w-full'
              )}
            ></span>
          </Link>
          <Link
            href="/blog"
            className={cn(
              'hidden sm:flex items-center gap-1.5 text-sm md:text-base font-medium transition-colors relative group',
              isBlog
                ? 'glow-purple'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:glow-purple'
            )}
          >
            <BookOpen className="w-4 h-4" />
            <span>Blog</span>
            <span
              className={cn(
                'absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300',
                isBlog ? 'w-full' : 'w-0 group-hover:w-full'
              )}
            ></span>
          </Link>
          <Link
            href="https://www.npmjs.com/package/@aiready/cli"
            target="_blank"
            className="hidden lg:block text-sm md:text-base font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white relative group transition-colors hover:glow-blue"
          >
            <span>Unified CLI</span>
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="https://marketplace.visualstudio.com/items?itemName=pengcao.aiready"
            target="_blank"
            className="hidden md:block text-sm md:text-base font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white relative group transition-colors hover:glow-blue"
          >
            <span>VS Code</span>
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="#get-started"
              className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm sm:text-base font-bold rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  );
}
