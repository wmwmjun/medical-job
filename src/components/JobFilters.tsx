'use client';

import { Specialization, JobType } from '@/types';

interface FilterState {
  specialization: string;
  location: string;
  jobType: string;
}

interface JobFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const specializations: Specialization[] = [
  'General Medicine',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Gynecology',
  'Dermatology',
  'Psychiatry',
  'Oncology',
  'Radiology',
  'Anesthesiology',
  'Emergency Medicine',
  'Surgery',
  'Internal Medicine',
  'Other',
];

const jobTypes: JobType[] = ['full-time', 'part-time', 'contract', 'locum'];

const locations = [
  'Mumbai',
  'New Delhi',
  'Bangalore',
  'Chennai',
  'Hyderabad',
  'Kolkata',
  'Pune',
  'Gurgaon',
  'Ahmedabad',
  'Jaipur',
];

export default function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
  const handleChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({ specialization: '', location: '', jobType: '' });
  };

  const hasActiveFilters = filters.specialization || filters.location || filters.jobType;
  const activeFilterCount = [filters.specialization, filters.location, filters.jobType].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Filter Jobs</h2>
            <p className="text-sm text-gray-500">Find the perfect opportunity</p>
          </div>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear filters
            <span className="ml-1 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
              {activeFilterCount}
            </span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Specialization
          </label>
          <div className="relative">
            <select
              value={filters.specialization}
              onChange={(e) => handleChange('specialization', e.target.value)}
              className={`w-full px-4 py-3 pr-10 border-2 rounded-xl appearance-none cursor-pointer text-gray-900 bg-white transition-all duration-200 ${
                filters.specialization
                  ? 'border-cyan-500 bg-cyan-50/30'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <select
              value={filters.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className={`w-full px-4 py-3 pr-10 border-2 rounded-xl appearance-none cursor-pointer text-gray-900 bg-white transition-all duration-200 ${
                filters.location
                  ? 'border-cyan-500 bg-cyan-50/30'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Type
          </label>
          <div className="relative">
            <select
              value={filters.jobType}
              onChange={(e) => handleChange('jobType', e.target.value)}
              className={`w-full px-4 py-3 pr-10 border-2 rounded-xl appearance-none cursor-pointer text-gray-900 bg-white transition-all duration-200 ${
                filters.jobType
                  ? 'border-cyan-500 bg-cyan-50/30'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <option value="">All Types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500 mr-2">Active:</span>
          {filters.specialization && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium">
              {filters.specialization}
              <button
                onClick={() => handleChange('specialization', '')}
                className="ml-1 hover:text-cyan-600"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filters.location && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium">
              {filters.location}
              <button
                onClick={() => handleChange('location', '')}
                className="ml-1 hover:text-cyan-600"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filters.jobType && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium">
              {filters.jobType.charAt(0).toUpperCase() + filters.jobType.slice(1).replace('-', ' ')}
              <button
                onClick={() => handleChange('jobType', '')}
                className="ml-1 hover:text-cyan-600"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
