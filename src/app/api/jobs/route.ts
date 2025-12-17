import { NextRequest, NextResponse } from 'next/server';
import { getAllJobs, searchJobs, createJob } from '@/lib/dataStore';
import { JobCreateRequest } from '@/types';

// GET /api/jobs - Get all jobs or search jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');
    const location = searchParams.get('location');
    const jobType = searchParams.get('jobType');
    const minSalary = searchParams.get('minSalary');
    const maxSalary = searchParams.get('maxSalary');

    const hasFilters = specialization || location || jobType || minSalary || maxSalary;

    let jobs;
    if (hasFilters) {
      jobs = searchJobs({
        specialization: specialization || undefined,
        location: location || undefined,
        jobType: jobType || undefined,
        minSalary: minSalary ? parseInt(minSalary) : undefined,
        maxSalary: maxSalary ? parseInt(maxSalary) : undefined,
      });
    } else {
      jobs = getAllJobs(true); // Only active jobs for public API
    }

    return NextResponse.json({
      success: true,
      data: jobs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch jobs',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job (Admin)
export async function POST(request: NextRequest) {
  try {
    const body: JobCreateRequest = await request.json();

    // Validate required fields
    const requiredFields = [
      'title',
      'hospitalName',
      'location',
      'specialization',
      'jobType',
      'experience',
      'salary',
      'description',
      'requirements',
      'benefits',
      'deadline',
      'contactEmail',
    ];

    for (const field of requiredFields) {
      if (!body[field as keyof JobCreateRequest]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }
    }

    const newJob = createJob(body);

    return NextResponse.json(
      {
        success: true,
        data: newJob,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create job',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
