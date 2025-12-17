'use client';

import { useState, useEffect } from 'react';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import { Job } from '@/types';

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialization: '',
    location: '',
    jobType: '',
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.specialization) params.set('specialization', filters.specialization);
      if (filters.location) params.set('location', filters.location);
      if (filters.jobType) params.set('jobType', filters.jobType);

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream
              <span className="block text-cyan-400">Medical Career</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Connect with top hospitals and healthcare facilities across India.
              Discover opportunities that match your expertise and aspirations.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">500+ Active Jobs</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-medium">100+ Hospitals</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-sm font-medium">Pan India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="relative h-16 overflow-hidden">
          <svg className="absolute bottom-0 w-full h-16" viewBox="0 0 1440 54" preserveAspectRatio="none">
            <path fill="#f8fafc" d="M0 22L48 27C96 32 192 42 288 44C384 46 480 40 576 37C672 34 768 34 864 38C960 42 1056 50 1152 49C1248 48 1344 38 1392 33L1440 28V54H1392C1344 54 1248 54 1152 54C1056 54 960 54 864 54C768 54 672 54 576 54C480 54 384 54 288 54C192 54 96 54 48 54H0V22Z"/>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Latest Opportunities
            </h2>
            <p className="text-gray-600">
              Browse through our curated list of medical positions
            </p>
          </div>
          {!loading && (
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-4 py-2 bg-cyan-50 text-cyan-700 rounded-full text-sm font-semibold">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2 animate-pulse"></span>
                {jobs.length} jobs available
              </span>
            </div>
          )}
        </div>

        <JobFilters filters={filters} onFilterChange={setFilters} />

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-cyan-200 rounded-full animate-spin border-t-cyan-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-gray-500 font-medium">Finding the best jobs for you...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn&apos;t find any jobs matching your criteria. Try adjusting your filters or check back later.
            </p>
            <button
              onClick={() => setFilters({ specialization: '', location: '', jobType: '' })}
              className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {jobs.map((job, index) => (
              <div key={job.id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <section className="mt-16 py-12 bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-2xl text-white">
          <div className="px-8">
            <h3 className="text-2xl font-bold text-center mb-10">Trusted by Healthcare Professionals</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-cyan-200 text-sm">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">100+</div>
                <div className="text-cyan-200 text-sm">Partner Hospitals</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-cyan-200 text-sm">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10k+</div>
                <div className="text-cyan-200 text-sm">Doctors Placed</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
