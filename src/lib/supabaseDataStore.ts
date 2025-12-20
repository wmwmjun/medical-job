import { supabase } from './supabase';
import { Job, Application, ApplicationStatus, JobCreateRequest, JobUpdateRequest, DashboardStats } from '@/types';

// Helper to convert DB row to Job type
function dbRowToJob(row: Record<string, unknown>): Job {
  return {
    id: row.id as string,
    title: row.title as string,
    hospitalName: row.hospital_name as string,
    location: row.location as Job['location'],
    specialization: row.specialization as Job['specialization'],
    jobType: row.job_type as Job['jobType'],
    experience: row.experience as Job['experience'],
    salary: row.salary as Job['salary'],
    description: row.description as string,
    requirements: row.requirements as string[],
    benefits: row.benefits as string[],
    postedDate: row.posted_date as string,
    deadline: row.deadline as string,
    isActive: row.is_active as boolean,
    contactEmail: row.contact_email as string,
    contactPhone: row.contact_phone as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// Helper to convert DB row to Application type
function dbRowToApplication(row: Record<string, unknown>): Application {
  return {
    id: row.id as string,
    jobId: row.job_id as string,
    applicant: row.applicant as Application['applicant'],
    status: row.status as ApplicationStatus,
    appliedAt: row.applied_at as string,
    lastUpdated: row.last_updated as string,
    notes: row.notes as string | undefined,
    interviewDate: row.interview_date as string | undefined,
    interviewNotes: row.interview_notes as string | undefined,
  };
}

// Job Operations
export async function getAllJobs(activeOnly = false): Promise<Job[]> {
  let query = supabase.from('jobs').select('*');

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  return (data || []).map(dbRowToJob);
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return undefined;
  }

  return dbRowToJob(data);
}

export async function createJob(jobData: JobCreateRequest): Promise<Job> {
  const now = new Date().toISOString();
  const id = `job-${Date.now()}`;

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      id,
      title: jobData.title,
      hospital_name: jobData.hospitalName,
      location: jobData.location,
      specialization: jobData.specialization,
      job_type: jobData.jobType,
      experience: jobData.experience,
      salary: jobData.salary,
      description: jobData.description,
      requirements: jobData.requirements,
      benefits: jobData.benefits,
      posted_date: now.split('T')[0],
      deadline: jobData.deadline,
      is_active: true,
      contact_email: jobData.contactEmail,
      contact_phone: jobData.contactPhone,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating job:', error);
    throw error;
  }

  return dbRowToJob(data);
}

export async function updateJob(id: string, jobData: JobUpdateRequest): Promise<Job | null> {
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (jobData.title !== undefined) updateData.title = jobData.title;
  if (jobData.hospitalName !== undefined) updateData.hospital_name = jobData.hospitalName;
  if (jobData.location !== undefined) updateData.location = jobData.location;
  if (jobData.specialization !== undefined) updateData.specialization = jobData.specialization;
  if (jobData.jobType !== undefined) updateData.job_type = jobData.jobType;
  if (jobData.experience !== undefined) updateData.experience = jobData.experience;
  if (jobData.salary !== undefined) updateData.salary = jobData.salary;
  if (jobData.description !== undefined) updateData.description = jobData.description;
  if (jobData.requirements !== undefined) updateData.requirements = jobData.requirements;
  if (jobData.benefits !== undefined) updateData.benefits = jobData.benefits;
  if (jobData.deadline !== undefined) updateData.deadline = jobData.deadline;
  if (jobData.contactEmail !== undefined) updateData.contact_email = jobData.contactEmail;
  if (jobData.contactPhone !== undefined) updateData.contact_phone = jobData.contactPhone;
  if (jobData.isActive !== undefined) updateData.is_active = jobData.isActive;

  const { data, error } = await supabase
    .from('jobs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return null;
  }

  return dbRowToJob(data);
}

export async function deleteJob(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);

  return !error;
}

export async function searchJobs(query: {
  specialization?: string;
  location?: string;
  jobType?: string;
  minSalary?: number;
  maxSalary?: number;
}): Promise<Job[]> {
  let dbQuery = supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true);

  if (query.specialization) {
    dbQuery = dbQuery.eq('specialization', query.specialization);
  }

  if (query.jobType) {
    dbQuery = dbQuery.eq('job_type', query.jobType);
  }

  const { data, error } = await dbQuery.order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching jobs:', error);
    return [];
  }

  let jobs = (data || []).map(dbRowToJob);

  // Filter by location (needs client-side filtering for JSONB)
  if (query.location) {
    const locationLower = query.location.toLowerCase();
    jobs = jobs.filter(job =>
      job.location.city.toLowerCase().includes(locationLower) ||
      job.location.state.toLowerCase().includes(locationLower)
    );
  }

  // Filter by salary range
  if (query.minSalary) {
    jobs = jobs.filter(job => job.salary.max >= query.minSalary!);
  }
  if (query.maxSalary) {
    jobs = jobs.filter(job => job.salary.min <= query.maxSalary!);
  }

  return jobs;
}

// Application Operations
export async function getAllApplications(): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('applied_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }

  return (data || []).map(dbRowToApplication);
}

export async function getApplicationById(id: string): Promise<Application | undefined> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return undefined;
  }

  return dbRowToApplication(data);
}

export async function getApplicationsByJobId(jobId: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('job_id', jobId)
    .order('applied_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }

  return (data || []).map(dbRowToApplication);
}

export async function getApplicationsByStatus(status: ApplicationStatus): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('status', status)
    .order('applied_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }

  return (data || []).map(dbRowToApplication);
}

export async function createApplication(
  jobId: string,
  applicantData: Application['applicant']
): Promise<Application | null> {
  // Check if job exists and is active
  const job = await getJobById(jobId);
  if (!job || !job.isActive) {
    return null;
  }

  const now = new Date().toISOString();
  const id = `app-${Date.now()}`;

  const { data, error } = await supabase
    .from('applications')
    .insert({
      id,
      job_id: jobId,
      applicant: {
        ...applicantData,
        id: `applicant-${Date.now()}`,
      },
      status: 'applied',
      applied_at: now,
      last_updated: now,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating application:', error);
    return null;
  }

  return dbRowToApplication(data);
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  notes?: string,
  interviewDate?: string,
  interviewNotes?: string
): Promise<Application | null> {
  const updateData: Record<string, unknown> = {
    status,
    last_updated: new Date().toISOString(),
  };

  if (notes !== undefined) updateData.notes = notes;
  if (interviewDate !== undefined) updateData.interview_date = interviewDate;
  if (interviewNotes !== undefined) updateData.interview_notes = interviewNotes;

  const { data, error } = await supabase
    .from('applications')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return null;
  }

  return dbRowToApplication(data);
}

export async function deleteApplication(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id);

  return !error;
}

// Dashboard Statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  const [jobs, applications] = await Promise.all([
    getAllJobs(),
    getAllApplications(),
  ]);

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

  const recentApplications = applications.slice(0, 5);

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
  const start = (page - 1) * limit;

  // Get total count
  const { count } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const total = count || 0;

  // Get paginated data
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(start, start + limit - 1);

  if (error) {
    console.error('Error fetching jobs for partner:', error);
    return { jobs: [], total: 0, page, limit, totalPages: 0 };
  }

  const jobs = (data || []).map(dbRowToJob);

  return {
    jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
