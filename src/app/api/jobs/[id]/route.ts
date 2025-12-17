import { NextRequest, NextResponse } from 'next/server';
import { getJobById, updateJob, deleteJob } from '@/lib/dataStore';
import { JobUpdateRequest } from '@/types';

// GET /api/jobs/[id] - Get a specific job
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = getJobById(id);

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job not found',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: job,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch job',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// PUT /api/jobs/[id] - Update a job (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: JobUpdateRequest = await request.json();

    const updatedJob = updateJob(id, body);

    if (!updatedJob) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job not found',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedJob,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update job',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Delete a job (Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteJob(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job not found',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete job',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
