'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="ml-2 text-xl font-bold text-gray-900">MedJobs India</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium ${
                pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Browse Jobs
            </Link>
            <Link
              href="/admin"
              className={`text-sm font-medium ${
                isAdmin ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Admin Panel
            </Link>
            <a
              href="/api/docs"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              API Docs
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
