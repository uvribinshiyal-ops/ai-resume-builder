'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bot, Sparkles, LogOut, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  // Don't show the full navbar on auth pages to minimize distraction
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    return (
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">AI Resume</span>
        </Link>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">AI Resume Maker</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/builder" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
            <Sparkles className="h-4 w-4" /> Builder
          </Link>
          <div className="h-5 w-px bg-slate-300 dark:bg-slate-700" />
          
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5 text-slate-400" />
          ) : user ? (
             <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {user.email}
                </span>
                <button 
                  onClick={handleSignOut}
                  className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
             </div>
          ) : (
             <div className="flex items-center gap-6">
               <Link href="/login" className="text-sm font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                 Log in
               </Link>
               <Link 
                 href="/signup" 
                 className="text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
               >
                 Sign up
               </Link>
             </div>
          )}
        </div>

        {/* Mobile Nav (Minimal) */}
        <div className="flex md:hidden items-center gap-4">
          {!loading && user ? (
            <button 
              onClick={handleSignOut}
              className="text-sm font-medium text-slate-900 dark:text-white flex items-center"
            >
              Sign out
            </button>
          ) : (
            <Link href="/login" className="text-sm font-medium text-slate-900 dark:text-white">
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
