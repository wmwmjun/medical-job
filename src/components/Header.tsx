'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent">
                MedJobs
              </span>
              <span className="text-xl font-light text-gray-600"> India</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === '/'
                  ? 'bg-cyan-50 text-cyan-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Browse Jobs
            </Link>
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isAdmin
                  ? 'bg-cyan-50 text-cyan-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Admin Panel
            </Link>
            <a
              href="/api/docs"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
            >
              API Docs
            </a>
            <Link
              href="/admin/jobs/new"
              className="ml-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white btn-primary"
            >
              Post a Job
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === '/' ? 'bg-cyan-50 text-cyan-700' : 'text-gray-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Jobs
              </Link>
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isAdmin ? 'bg-cyan-50 text-cyan-700' : 'text-gray-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
              <a
                href="/api/docs"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                API Docs
              </a>
              <Link
                href="/admin/jobs/new"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white btn-primary text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Post a Job
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
