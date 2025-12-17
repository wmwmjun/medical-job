import { NextRequest, NextResponse } from 'next/server';
import { getJobsForPartner } from '@/lib/dataStore';

// Simulated API key validation (in production, this would check against a database)
const VALID_API_KEYS = ['partner-api-key-001', 'partner-api-key-002', 'demo-api-key'];

function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('X-API-Key');
  return apiKey !== null && VALID_API_KEYS.includes(apiKey);
}

// GET /api/partners/jobs - Partner API endpoint for fetching jobs
export async function GET(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid or missing API key. Include X-API-Key header.',
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // Max 100 per request

    const result = getJobsForPartner(page, limit);

    return NextResponse.json({
      success: true,
      data: result.jobs,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Partner API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
