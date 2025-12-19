import { NextRequest, NextResponse } from 'next/server';
import {
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
} from '@/lib/kvDataStore';
import { ApplicationStatus } from '@/types';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// OPTIONS /api/applications/[id] - Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET /api/applications/[id] - Get a specific application
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const application = await getApplicationById(id);

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          error: 'Application not found',
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
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch application',
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT /api/applications/[id] - Update application status (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes, interviewDate, interviewNotes } = body;

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Status is required',
          timestamp: new Date().toISOString(),
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate status
    const validStatuses: ApplicationStatus[] = [
      'applied',
      'under_review',
      'interview_scheduled',
      'interview_completed',
      'passed',
      'rejected',
      'contract_offered',
      'contract_completed',
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`,
          timestamp: new Date().toISOString(),
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const updatedApplication = await updateApplicationStatus(
      id,
      status,
      notes,
      interviewDate,
      interviewNotes
    );

    if (!updatedApplication) {
      return NextResponse.json(
        {
          success: false,
          error: 'Application not found',
          timestamp: new Date().toISOString(),
        },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedApplication,
        timestamp: new Date().toISOString(),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update application',
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/applications/[id] - Delete an application (Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteApplication(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Application not found',
          timestamp: new Date().toISOString(),
        },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Application deleted successfully',
        timestamp: new Date().toISOString(),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete application',
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
