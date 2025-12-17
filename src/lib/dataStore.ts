import { Job, Application, ApplicationStatus, JobCreateRequest, JobUpdateRequest, DashboardStats } from '@/types';
import { mockJobs } from '@/data/mockJobs';
import { mockApplications } from '@/data/mockApplications';

// In-memory data store (in production, this would be a database)
let jobs: Job[] = [...mockJobs];
let applications: Application[] = [...mockApplications];

// Job Operations
export function getAllJobs(activeOnly = false): Job[] {
  if (activeOnly) {
    return jobs.filter((job) => job.isActive);
  }
  return jobs;
}

export function getJobById(id: string): Job | undefined {
  return jobs.find((job) => job.id === id);
}

export function createJob(data: JobCreateRequest): Job {
  const now = new Date().toISOString();
  const newJob: Job = {
    ...data,
    id: `job-${Date.now()}`,
    postedDate: now.split('T')[0],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  jobs.push(newJob);
  return newJob;
}

export function updateJob(id: string, data: JobUpdateRequest): Job | null {
  const index = jobs.findIndex((job) => job.id === id);
  if (index === -1) return null;

  jobs[index] = {
    ...jobs[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return jobs[index];
}

export function deleteJob(id: string): boolean {
  const index = jobs.findIndex((job) => job.id === id);
  if (index === -1) return false;
  jobs.splice(index, 1);
  return true;
}

export function searchJobs(query: {
  specialization?: string;
  location?: string;
  jobType?: string;
  minSalary?: number;
  maxSalary?: number;
}): Job[] {
  return jobs.filter((job) => {
    if (!job.isActive) return false;
    if (query.specialization && job.specialization !== query.specialization) return false;
    if (query.location) {
      const locationMatch =
        job.location.city.toLowerCase().includes(query.location.toLowerCase()) ||
        job.location.state.toLowerCase().includes(query.location.toLowerCase());
      if (!locationMatch) return false;
    }
    if (query.jobType && job.jobType !== query.jobType) return false;
    if (query.minSalary && job.salary.max < query.minSalary) return false;
    if (query.maxSalary && job.salary.min > query.maxSalary) return false;
    return true;
  });
}

// Application Operations
export function getAllApplications(): Application[] {
  return applications;
}

export function getApplicationById(id: string): Application | undefined {
  return applications.find((app) => app.id === id);
}

export function getApplicationsByJobId(jobId: string): Application[] {
  return applications.filter((app) => app.jobId === jobId);
}

export function getApplicationsByStatus(status: ApplicationStatus): Application[] {
  return applications.filter((app) => app.status === status);
}

export function createApplication(
  jobId: string,
  applicantData: Application['applicant']
): Application | null {
  const job = getJobById(jobId);
  if (!job || !job.isActive) return null;

  const now = new Date().toISOString();
  const newApplication: Application = {
    id: `app-${Date.now()}`,
    jobId,
    applicant: {
      ...applicantData,
      id: `applicant-${Date.now()}`,
    },
    status: 'applied',
    appliedAt: now,
    lastUpdated: now,
  };
  applications.push(newApplication);
  return newApplication;
}

export function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  notes?: string,
  interviewDate?: string,
  interviewNotes?: string
): Application | null {
  const index = applications.findIndex((app) => app.id === id);
  if (index === -1) return null;

  applications[index] = {
    ...applications[index],
    status,
    lastUpdated: new Date().toISOString(),
    ...(notes && { notes }),
    ...(interviewDate && { interviewDate }),
    ...(interviewNotes && { interviewNotes }),
  };
  return applications[index];
}

export function deleteApplication(id: string): boolean {
  const index = applications.findIndex((app) => app.id === id);
  if (index === -1) return false;
  applications.splice(index, 1);
  return true;
}

// Dashboard Statistics
export function getDashboardStats(): DashboardStats {
  const statusCounts = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {} as Record<ApplicationStatus, number>
  );

  // Ensure all statuses have a count
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
  allStatuses.forEach((status) => {
    if (!statusCounts[status]) statusCounts[status] = 0;
  });

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5);

  return {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.isActive).length,
    totalApplications: applications.length,
    applicationsByStatus: statusCounts,
    recentApplications,
  };
}

// Partner API - Get jobs with pagination
export function getJobsForPartner(page = 1, limit = 10): {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} {
  const activeJobs = jobs.filter((j) => j.isActive);
  const total = activeJobs.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedJobs = activeJobs.slice(start, start + limit);

  return {
    jobs: paginatedJobs,
    total,
    page,
    limit,
    totalPages,
  };
}
