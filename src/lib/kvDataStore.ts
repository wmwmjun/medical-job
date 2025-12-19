import { kv } from '@vercel/kv';
import { Job, Application, ApplicationStatus, JobCreateRequest, JobUpdateRequest, DashboardStats } from '@/types';
import { mockJobs } from '@/data/mockJobs';
import { mockApplications } from '@/data/mockApplications';

const JOBS_KEY = 'medical-jobs:jobs';
const APPLICATIONS_KEY = 'medical-jobs:applications';
const INITIALIZED_KEY = 'medical-jobs:initialized';

// Initialize data if not exists
async function ensureInitialized(): Promise<void> {
  const initialized = await kv.get(INITIALIZED_KEY);
  if (!initialized) {
    await kv.set(JOBS_KEY, mockJobs);
    await kv.set(APPLICATIONS_KEY, mockApplications);
    await kv.set(INITIALIZED_KEY, true);
  }
}

// Job Operations
export async function getAllJobs(activeOnly = false): Promise<Job[]> {
  await ensureInitialized();
  const jobs = await kv.get<Job[]>(JOBS_KEY) || [];
  if (activeOnly) {
    return jobs.filter((job) => job.isActive);
  }
  return jobs;
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const jobs = await getAllJobs();
  return jobs.find((job) => job.id === id);
}

export async function createJob(data: JobCreateRequest): Promise<Job> {
  await ensureInitialized();
  const jobs = await kv.get<Job[]>(JOBS_KEY) || [];

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
  await kv.set(JOBS_KEY, jobs);
  return newJob;
}

export async function updateJob(id: string, data: JobUpdateRequest): Promise<Job | null> {
  await ensureInitialized();
  const jobs = await kv.get<Job[]>(JOBS_KEY) || [];

  const index = jobs.findIndex((job) => job.id === id);
  if (index === -1) return null;

  jobs[index] = {
    ...jobs[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await kv.set(JOBS_KEY, jobs);
  return jobs[index];
}

export async function deleteJob(id: string): Promise<boolean> {
  await ensureInitialized();
  const jobs = await kv.get<Job[]>(JOBS_KEY) || [];

  const index = jobs.findIndex((job) => job.id === id);
  if (index === -1) return false;
  jobs.splice(index, 1);
  await kv.set(JOBS_KEY, jobs);
  return true;
}

export async function searchJobs(query: {
  specialization?: string;
  location?: string;
  jobType?: string;
  minSalary?: number;
  maxSalary?: number;
}): Promise<Job[]> {
  const jobs = await getAllJobs(true);

  return jobs.filter((job) => {
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
export async function getAllApplications(): Promise<Application[]> {
  await ensureInitialized();
  return await kv.get<Application[]>(APPLICATIONS_KEY) || [];
}

export async function getApplicationById(id: string): Promise<Application | undefined> {
  const applications = await getAllApplications();
  return applications.find((app) => app.id === id);
}

export async function getApplicationsByJobId(jobId: string): Promise<Application[]> {
  const applications = await getAllApplications();
  return applications.filter((app) => app.jobId === jobId);
}

export async function getApplicationsByStatus(status: ApplicationStatus): Promise<Application[]> {
  const applications = await getAllApplications();
  return applications.filter((app) => app.status === status);
}

export async function createApplication(
  jobId: string,
  applicantData: Application['applicant']
): Promise<Application | null> {
  const job = await getJobById(jobId);
  if (!job || !job.isActive) return null;

  const applications = await kv.get<Application[]>(APPLICATIONS_KEY) || [];

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
  await kv.set(APPLICATIONS_KEY, applications);
  return newApplication;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  notes?: string,
  interviewDate?: string,
  interviewNotes?: string
): Promise<Application | null> {
  await ensureInitialized();
  const applications = await kv.get<Application[]>(APPLICATIONS_KEY) || [];

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
  await kv.set(APPLICATIONS_KEY, applications);
  return applications[index];
}

export async function deleteApplication(id: string): Promise<boolean> {
  await ensureInitialized();
  const applications = await kv.get<Application[]>(APPLICATIONS_KEY) || [];

  const index = applications.findIndex((app) => app.id === id);
  if (index === -1) return false;
  applications.splice(index, 1);
  await kv.set(APPLICATIONS_KEY, applications);
  return true;
}

// Dashboard Statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  const jobs = await getAllJobs();
  const applications = await getAllApplications();

  const statusCounts = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {} as Record<ApplicationStatus, number>
  );

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
export async function getJobsForPartner(page = 1, limit = 10): Promise<{
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const jobs = await getAllJobs(true);
  const total = jobs.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedJobs = jobs.slice(start, start + limit);

  return {
    jobs: paginatedJobs,
    total,
    page,
    limit,
    totalPages,
  };
}

// Reset data (for testing)
export async function resetData(): Promise<void> {
  await kv.set(JOBS_KEY, mockJobs);
  await kv.set(APPLICATIONS_KEY, mockApplications);
  await kv.set(INITIALIZED_KEY, true);
}
