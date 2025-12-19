import { NextRequest, NextResponse } from 'next/server';
import {
  getAllApplications,
  getApplicationsByJobId,
  getApplicationsByStatus,
  createApplication,
} from '@/lib/kvDataStore';
import { ApplicationStatus } from '@/types';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// OPTIONS /api/applications - Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET /api/applications - Get all applications with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status') as ApplicationStatus | null;

    let applications;

    if (jobId) {
      applications = await getApplicationsByJobId(jobId);
    } else if (status) {
      applications = await getApplicationsByStatus(status);
    } else {
      applications = await getAllApplications();
    }

    return NextResponse.json(
      {
        success: true,
        data: applications,
        timestamp: new Date().toISOString(),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch applications',
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: corsHeaders }
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
        { status: 400, headers: corsHeaders }
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
          { status: 400, headers: corsHeaders }
        );
      }
    }

    const application = await createApplication(jobId, applicant);

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job not found or not active',
          timestamp: new Date().toISOString(),
        },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: application,
        timestamp: new Date().toISOString(),
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create application',
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
