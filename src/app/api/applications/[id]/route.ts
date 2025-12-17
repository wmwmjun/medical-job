import { NextRequest, NextResponse } from 'next/server';
import {
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
} from '@/lib/dataStore';
import { ApplicationStatus } from '@/types';

// GET /api/applications/[id] - Get a specific application
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const application = getApplicationById(id);

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          error: 'Application not found',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: application,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch application',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
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
        { status: 400 }
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
        { status: 400 }
      );
    }

    const updatedApplication = updateApplicationStatus(
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
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedApplication,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update application',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
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
    const deleted = deleteApplication(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Application not found',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete application',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
