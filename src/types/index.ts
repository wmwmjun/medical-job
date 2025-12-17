// Job Listing Types for Medical Job Platform

export type JobType = 'full-time' | 'part-time' | 'contract' | 'locum';

export type Specialization =
  | 'General Medicine'
  | 'Cardiology'
  | 'Neurology'
  | 'Orthopedics'
  | 'Pediatrics'
  | 'Gynecology'
  | 'Dermatology'
  | 'Psychiatry'
  | 'Oncology'
  | 'Radiology'
  | 'Anesthesiology'
  | 'Emergency Medicine'
  | 'Surgery'
  | 'Internal Medicine'
  | 'Other';

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'passed'
  | 'rejected'
  | 'contract_offered'
  | 'contract_completed';

export interface Job {
  id: string;
  title: string;
  hospitalName: string;
  location: {
    city: string;
    state: string;
    address?: string;
  };
  specialization: Specialization;
  jobType: JobType;
  experience: {
    min: number;
    max: number;
  };
  salary: {
    min: number;
    max: number;
    currency: string;
    period: 'monthly' | 'annual';
  };
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  deadline: string;
  isActive: boolean;
  contactEmail: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  experience: number;
  currentHospital?: string;
  resumeUrl?: string;
  coverLetter?: string;
}

export interface Application {
  id: string;
  jobId: string;
  applicant: Applicant;
  status: ApplicationStatus;
  appliedAt: string;
  lastUpdated: string;
  notes?: string;
  interviewDate?: string;
  interviewNotes?: string;
}

// API Response Types for Partner Integration
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface JobListingAPIResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
}

// Partner API Types
export interface PartnerCredentials {
  apiKey: string;
  partnerId: string;
  partnerName: string;
  isActive: boolean;
  createdAt: string;
}

export interface JobCreateRequest {
  title: string;
  hospitalName: string;
  location: Job['location'];
  specialization: Specialization;
  jobType: JobType;
  experience: Job['experience'];
  salary: Job['salary'];
  description: string;
  requirements: string[];
  benefits: string[];
  deadline: string;
  contactEmail: string;
  contactPhone?: string;
}

export interface JobUpdateRequest extends Partial<JobCreateRequest> {
  isActive?: boolean;
}

// Dashboard Stats
export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  applicationsByStatus: Record<ApplicationStatus, number>;
  recentApplications: Application[];
}
