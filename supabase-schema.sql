-- Supabase SQL Schema for Medical Job Platform
-- Run this in Supabase SQL Editor (SQL Editor tab in dashboard)

-- Jobs Table
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  location JSONB NOT NULL, -- {city, state, address}
  specialization TEXT NOT NULL,
  job_type TEXT NOT NULL,
  experience JSONB NOT NULL, -- {min, max}
  salary JSONB NOT NULL, -- {min, max, currency, period}
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL,
  benefits TEXT[] NOT NULL,
  posted_date DATE NOT NULL,
  deadline DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications Table
CREATE TABLE applications (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant JSONB NOT NULL, -- {id, name, email, phone, qualification, experience, ...}
  status TEXT NOT NULL DEFAULT 'applied',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  interview_date TIMESTAMPTZ,
  interview_notes TEXT
);

-- Indexes for better performance
CREATE INDEX idx_jobs_is_active ON jobs(is_active);
CREATE INDEX idx_jobs_specialization ON jobs(specialization);
CREATE INDEX idx_jobs_location ON jobs USING GIN(location);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Enable Row Level Security (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Allow public read access to jobs
CREATE POLICY "Public can read active jobs" ON jobs
  FOR SELECT USING (is_active = true);

-- Allow public to read all jobs (for admin)
CREATE POLICY "Allow all jobs read" ON jobs
  FOR SELECT USING (true);

-- Allow insert/update/delete for all (in production, restrict this!)
CREATE POLICY "Allow all jobs modifications" ON jobs
  FOR ALL USING (true);

CREATE POLICY "Allow all applications read" ON applications
  FOR SELECT USING (true);

CREATE POLICY "Allow all applications modifications" ON applications
  FOR ALL USING (true);

-- Insert mock data (10 jobs)
INSERT INTO jobs (id, title, hospital_name, location, specialization, job_type, experience, salary, description, requirements, benefits, posted_date, deadline, is_active, contact_email, contact_phone) VALUES
('job-001', 'Senior Cardiologist', 'Apollo Hospitals', '{"city": "Mumbai", "state": "Maharashtra", "address": "Navi Mumbai, Sector 23"}', 'Cardiology', 'full-time', '{"min": 5, "max": 10}', '{"min": 200000, "max": 350000, "currency": "INR", "period": "monthly"}', 'We are looking for an experienced Cardiologist to join our cardiology department. The ideal candidate will have extensive experience in interventional cardiology and cardiac imaging.', ARRAY['MBBS with MD/DM in Cardiology', 'Minimum 5 years of experience', 'Experience in interventional procedures', 'Valid medical license'], ARRAY['Competitive salary', 'Health insurance', 'Professional development allowance', 'Relocation assistance'], '2024-01-15', '2024-03-15', true, 'careers@apollohospitals.com', '+91-22-1234-5678'),

('job-002', 'Consultant Neurologist', 'Fortis Healthcare', '{"city": "Delhi", "state": "Delhi", "address": "Vasant Kunj, New Delhi"}', 'Neurology', 'full-time', '{"min": 3, "max": 8}', '{"min": 180000, "max": 280000, "currency": "INR", "period": "monthly"}', 'Fortis Healthcare is seeking a skilled Neurologist to provide comprehensive neurological care. Experience in stroke management and epilepsy treatment is preferred.', ARRAY['MBBS with DM in Neurology', 'Minimum 3 years of experience', 'Expertise in EEG and EMG interpretation', 'Strong diagnostic skills'], ARRAY['Attractive compensation', 'Medical coverage for family', 'Academic opportunities', 'Modern facilities'], '2024-01-10', '2024-02-28', true, 'recruitment@fortishealthcare.com', '+91-11-9876-5432'),

('job-003', 'Pediatric Surgeon', 'AIIMS', '{"city": "New Delhi", "state": "Delhi", "address": "Ansari Nagar, New Delhi"}', 'Pediatrics', 'full-time', '{"min": 7, "max": 15}', '{"min": 150000, "max": 250000, "currency": "INR", "period": "monthly"}', 'AIIMS is looking for a dedicated Pediatric Surgeon to join our prestigious institution. The role involves complex pediatric surgical procedures and academic responsibilities.', ARRAY['MBBS with MCh in Pediatric Surgery', 'Minimum 7 years of experience', 'Research publications preferred', 'Teaching experience'], ARRAY['Government benefits', 'Housing allowance', 'Research grants', 'Sabbatical leave'], '2024-01-12', '2024-03-30', true, 'recruitment@aiims.edu', '+91-11-2658-8500'),

('job-004', 'Orthopedic Specialist', 'Max Healthcare', '{"city": "Gurugram", "state": "Haryana", "address": "DLF Phase 2, Gurugram"}', 'Orthopedics', 'full-time', '{"min": 4, "max": 10}', '{"min": 220000, "max": 380000, "currency": "INR", "period": "monthly"}', 'Join Max Healthcare as an Orthopedic Specialist. We are looking for someone with expertise in joint replacement surgeries and sports medicine.', ARRAY['MBBS with MS in Orthopedics', 'Fellowship in Joint Replacement preferred', 'Minimum 4 years of experience', 'Proficiency in arthroscopic procedures'], ARRAY['Performance bonus', 'International conference sponsorship', 'Comprehensive insurance', 'Flexible scheduling'], '2024-01-08', '2024-02-25', true, 'hr@maxhealthcare.com', '+91-124-4567-890'),

('job-005', 'General Physician', 'Manipal Hospitals', '{"city": "Bangalore", "state": "Karnataka", "address": "HAL Airport Road, Bangalore"}', 'General Medicine', 'full-time', '{"min": 2, "max": 5}', '{"min": 100000, "max": 150000, "currency": "INR", "period": "monthly"}', 'Manipal Hospitals Bangalore is hiring General Physicians for outpatient and inpatient care. Ideal for doctors looking to build their career in a leading healthcare institution.', ARRAY['MBBS with MD in General Medicine', 'Minimum 2 years of experience', 'Good communication skills', 'Willingness to work in shifts'], ARRAY['Career growth opportunities', 'Training programs', 'Health benefits', 'Annual bonus'], '2024-01-18', '2024-03-01', true, 'careers@manipalhospitals.com', '+91-80-2502-4444'),

('job-006', 'Dermatologist', 'Kokilaben Hospital', '{"city": "Mumbai", "state": "Maharashtra", "address": "Andheri West, Mumbai"}', 'Dermatology', 'part-time', '{"min": 3, "max": 7}', '{"min": 80000, "max": 120000, "currency": "INR", "period": "monthly"}', 'Part-time Dermatologist position available at Kokilaben Hospital. Looking for someone experienced in cosmetic dermatology and skin disease management.', ARRAY['MBBS with MD in Dermatology', 'Minimum 3 years of experience', 'Experience in cosmetic procedures', 'Patient-friendly approach'], ARRAY['Flexible hours', 'State-of-art equipment', 'Professional autonomy', 'Competitive per-session rates'], '2024-01-20', '2024-02-20', true, 'jobs@kokilabenhospital.com', '+91-22-3066-6666'),

('job-007', 'Emergency Medicine Specialist', 'Medanta Hospital', '{"city": "Gurugram", "state": "Haryana", "address": "Sector 38, Gurugram"}', 'Emergency Medicine', 'full-time', '{"min": 3, "max": 8}', '{"min": 160000, "max": 240000, "currency": "INR", "period": "monthly"}', 'Medanta is expanding its Emergency Department and looking for skilled Emergency Medicine Specialists. Fast-paced environment requiring quick decision-making abilities.', ARRAY['MBBS with MD/DNB in Emergency Medicine', 'ACLS and ATLS certification', 'Minimum 3 years of ER experience', 'Ability to handle high-stress situations'], ARRAY['Shift allowances', 'Meal provisions', 'Transport facility', 'Insurance coverage'], '2024-01-14', '2024-03-10', true, 'emergency.careers@medanta.org', '+91-124-4141-414'),

('job-008', 'Psychiatrist', 'NIMHANS', '{"city": "Bangalore", "state": "Karnataka", "address": "Hosur Road, Bangalore"}', 'Psychiatry', 'full-time', '{"min": 5, "max": 12}', '{"min": 140000, "max": 220000, "currency": "INR", "period": "monthly"}', 'NIMHANS is seeking experienced Psychiatrists for clinical and research positions. Opportunity to work with diverse patient populations and contribute to mental health research.', ARRAY['MBBS with MD in Psychiatry', 'Minimum 5 years of clinical experience', 'Interest in research', 'Experience with community psychiatry preferred'], ARRAY['Research funding', 'Academic environment', 'Government benefits', 'International collaboration opportunities'], '2024-01-16', '2024-03-20', true, 'recruitment@nimhans.ac.in', '+91-80-2699-5000'),

('job-009', 'Oncologist', 'Tata Memorial Hospital', '{"city": "Mumbai", "state": "Maharashtra", "address": "Parel, Mumbai"}', 'Oncology', 'full-time', '{"min": 6, "max": 15}', '{"min": 250000, "max": 400000, "currency": "INR", "period": "monthly"}', 'Join India''s premier cancer hospital as an Oncologist. We are looking for specialists in medical oncology with experience in chemotherapy protocols and clinical trials.', ARRAY['MBBS with DM in Medical Oncology', 'Minimum 6 years of experience', 'Experience in clinical trials', 'Publications in peer-reviewed journals'], ARRAY['World-class infrastructure', 'Research opportunities', 'International exposure', 'Comprehensive benefits package'], '2024-01-11', '2024-04-01', true, 'careers@tmc.gov.in', '+91-22-2417-7000'),

('job-010', 'Locum General Surgeon', 'Christian Medical College', '{"city": "Vellore", "state": "Tamil Nadu", "address": "Ida Scudder Road, Vellore"}', 'Surgery', 'locum', '{"min": 2, "max": 5}', '{"min": 8000, "max": 12000, "currency": "INR", "period": "monthly"}', 'CMC Vellore is looking for Locum General Surgeons to cover various surgical units. Short-term engagement with possibility of extension based on performance.', ARRAY['MBBS with MS in General Surgery', 'Minimum 2 years post-MS experience', 'Flexible availability', 'Good team player'], ARRAY['Daily rate compensation', 'Accommodation provided', 'Meals included', 'Learning environment'], '2024-01-19', '2024-02-15', true, 'locum@cmcvellore.ac.in', '+91-416-228-1000');

-- Insert sample applications
INSERT INTO applications (id, job_id, applicant, status, applied_at, last_updated, notes) VALUES
('app-001', 'job-001', '{"id": "applicant-001", "name": "Dr. Rajesh Kumar", "email": "rajesh.kumar@email.com", "phone": "+91-9876543210", "qualification": "MBBS, MD, DM Cardiology", "experience": 7, "currentHospital": "City Hospital Mumbai"}', 'under_review', '2024-01-20 10:30:00+05:30', '2024-01-22 14:00:00+05:30', 'Strong candidate with good experience'),

('app-002', 'job-001', '{"id": "applicant-002", "name": "Dr. Priya Sharma", "email": "priya.sharma@email.com", "phone": "+91-9876543211", "qualification": "MBBS, MD, DM Cardiology", "experience": 5, "currentHospital": "Government Hospital Delhi"}', 'interview_scheduled', '2024-01-18 09:00:00+05:30', '2024-01-25 11:00:00+05:30', 'Interview scheduled for next week'),

('app-003', 'job-002', '{"id": "applicant-003", "name": "Dr. Amit Patel", "email": "amit.patel@email.com", "phone": "+91-9876543212", "qualification": "MBBS, DM Neurology", "experience": 4, "currentHospital": "Private Clinic Ahmedabad"}', 'applied', '2024-01-22 15:45:00+05:30', '2024-01-22 15:45:00+05:30', NULL),

('app-004', 'job-005', '{"id": "applicant-004", "name": "Dr. Sneha Reddy", "email": "sneha.reddy@email.com", "phone": "+91-9876543213", "qualification": "MBBS, MD General Medicine", "experience": 3, "currentHospital": "District Hospital Hyderabad"}', 'passed', '2024-01-15 11:20:00+05:30', '2024-01-28 16:30:00+05:30', 'Excellent interview performance'),

('app-005', 'job-007', '{"id": "applicant-005", "name": "Dr. Mohammed Ali", "email": "mohammed.ali@email.com", "phone": "+91-9876543214", "qualification": "MBBS, MD Emergency Medicine", "experience": 4, "currentHospital": "Trauma Center Chennai"}', 'contract_offered', '2024-01-10 08:00:00+05:30', '2024-01-30 10:00:00+05:30', 'Offer letter sent');
