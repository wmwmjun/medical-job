import { NextRequest, NextResponse } from 'next/server';
import {
  getAllApplications,
  getApplicationsByJobId,
  getApplicationsByStatus,
  createApplication,
} from '@/lib/dataStore';
import { ApplicationStatus } from '@/types';

// GET /api/applications - Get all applications with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status') as ApplicationStatus | null;

    let applications;

    if (jobId) {
      applications = getApplicationsByJobId(jobId);
    } else if (status) {
      applications = getApplicationsByStatus(status);
    } else {
      applications = getAllApplications();
    }

    return NextResponse.json({
      success: true,
      data: applications,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch applications',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST /api/applications - Submit a new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, applicant } = body;

    if (!jobId || !applicant) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing jobId or applicant data',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate required applicant fields
    const requiredFields = ['name', 'email', 'phone', 'qualification', 'experience'];
    for (const field of requiredFields) {
      if (!applicant[field]) {
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

    const application = createApplication(jobId, applicant);

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job not found or not active',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: application,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create application',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
