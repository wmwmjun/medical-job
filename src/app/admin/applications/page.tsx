'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Application, ApplicationStatus, Job } from '@/types';

const statusLabels: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  under_review: 'Under Review',
  interview_scheduled: 'Interview Scheduled',
  interview_completed: 'Interview Completed',
  passed: 'Passed',
  rejected: 'Rejected',
  contract_offered: 'Contract Offered',
  contract_completed: 'Contract Completed',
};

const statusColors: Record<ApplicationStatus, string> = {
  applied: 'bg-gray-100 text-gray-800',
  under_review: 'bg-blue-100 text-blue-800',
  interview_scheduled: 'bg-yellow-100 text-yellow-800',
  interview_completed: 'bg-purple-100 text-purple-800',
  passed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  contract_offered: 'bg-indigo-100 text-indigo-800',
  contract_completed: 'bg-emerald-100 text-emerald-800',
};

const allStatuses: ApplicationStatus[] = [
  'applied',
  'under_review',
  'interview_scheduled',
  'interview_completed',
  'passed',
  'rejected',
  'contract_offered',
  'contract_completed',
];

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Record<string, Job>>({});
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [updateData, setUpdateData] = useState({
    status: '' as ApplicationStatus | '',
    notes: '',
    interviewDate: '',
    interviewNotes: '',
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      const [appsRes, jobsRes] = await Promise.all([
        fetch(`/api/applications${statusFilter ? `?status=${statusFilter}` : ''}`),
        fetch('/api/jobs'),
      ]);

      const appsData = await appsRes.json();
      const jobsData = await jobsRes.json();

      if (appsData.success) {
        setApplications(appsData.data);
      }

      if (jobsData.success) {
        const jobsMap: Record<string, Job> = {};
        jobsData.data.forEach((job: Job) => {
          jobsMap[job.id] = job;
        });
        setJobs(jobsMap);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp || !updateData.status) return;
    setUpdating(true);

    try {
      const response = await fetch(`/api/applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updateData.status,
          notes: updateData.notes || undefined,
          interviewDate: updateData.interviewDate || undefined,
          interviewNotes: updateData.interviewNotes || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setApplications(
          applications.map((app) =>
            app.id === selectedApp.id ? data.data : app
          )
        );
        setSelectedApp(null);
        setUpdateData({ status: '', notes: '', interviewDate: '', interviewNotes: '' });
      }
    } catch (error) {
      console.error('Error updating application:', error);
    } finally {
      setUpdating(false);
    }
  };

  const openUpdateModal = (app: Application) => {
    setSelectedApp(app);
    setUpdateData({
      status: app.status,
      notes: app.notes || '',
      interviewDate: app.interviewDate ? app.interviewDate.split('T')[0] : '',
      interviewNotes: app.interviewNotes || '',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Manage Applications</h1>
        <p className="text-gray-600 mt-1">{applications.length} applications</p>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | '')}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        >
          <option value="">All Statuses</option>
          {allStatuses.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qualification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{app.applicant.name}</div>
                    <div className="text-sm text-gray-500">{app.applicant.email}</div>
                    <div className="text-sm text-gray-500">{app.applicant.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {jobs[app.jobId]?.title || app.jobId}
                    </div>
                    <div className="text-sm text-gray-500">
                      {jobs[app.jobId]?.hospitalName || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{app.applicant.qualification}</div>
                    <div className="text-sm text-gray-500">{app.applicant.experience} years exp.</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                      {statusLabels[app.status]}
                    </span>
                    {app.interviewDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Interview: {new Date(app.interviewDate).toLocaleDateString('en-IN')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(app.appliedAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openUpdateModal(app)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Update Application Status</h2>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{selectedApp.applicant.name}</p>
                <p className="text-sm text-gray-600">{jobs[selectedApp.jobId]?.title || selectedApp.jobId}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    value={updateData.status}
                    onChange={(e) => setUpdateData({ ...updateData, status: e.target.value as ApplicationStatus })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    {allStatuses.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                </div>

                {(updateData.status === 'interview_scheduled' ||
                  updateData.status === 'interview_completed') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interview Date
                    </label>
                    <input
                      type="datetime-local"
                      value={updateData.interviewDate}
                      onChange={(e) => setUpdateData({ ...updateData, interviewDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                )}

                {updateData.status === 'interview_completed' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interview Notes
                    </label>
                    <textarea
                      rows={3}
                      value={updateData.interviewNotes}
                      onChange={(e) => setUpdateData({ ...updateData, interviewNotes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Summary of the interview..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={updateData.notes}
                    onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updating || !updateData.status}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    {updating ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
