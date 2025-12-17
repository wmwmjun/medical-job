import { NextResponse } from 'next/server';

export async function GET() {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MedJobs India API Documentation</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 1000px; margin: 0 auto; padding: 40px 20px; }
    h1 { font-size: 2.5rem; margin-bottom: 10px; color: #1a1a1a; }
    h2 { font-size: 1.8rem; margin-top: 40px; margin-bottom: 20px; color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
    h3 { font-size: 1.3rem; margin-top: 30px; margin-bottom: 15px; color: #1a1a1a; }
    p { margin-bottom: 15px; }
    .subtitle { color: #666; font-size: 1.1rem; margin-bottom: 30px; }
    .card { background: white; border-radius: 8px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .endpoint { background: #f0f9ff; border-left: 4px solid #2563eb; padding: 15px; margin: 15px 0; border-radius: 0 8px 8px 0; }
    .method { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.9rem; margin-right: 10px; }
    .get { background: #dcfce7; color: #166534; }
    .post { background: #dbeafe; color: #1e40af; }
    .put { background: #fef3c7; color: #92400e; }
    .delete { background: #fee2e2; color: #991b1b; }
    .url { font-family: monospace; color: #1a1a1a; font-size: 1rem; }
    code { background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-family: monospace; font-size: 0.9rem; }
    pre { background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 15px 0; }
    pre code { background: transparent; padding: 0; color: #e2e8f0; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f8fafc; font-weight: 600; }
    .required { color: #dc2626; font-weight: bold; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .badge-info { background: #dbeafe; color: #1e40af; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    ul { margin: 15px 0; padding-left: 25px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>MedJobs India API</h1>
    <p class="subtitle">RESTful API for Medical Job Listings - Partner Integration Guide</p>

    <div class="card">
      <h2 style="margin-top: 0;">Overview</h2>
      <p>The MedJobs India API allows partner companies to access medical job listings in real-time. This API is designed for business partnerships where partners can integrate our job listings into their platforms.</p>

      <h3>Base URL</h3>
      <code>https://your-domain.com/api</code>

      <h3>Authentication</h3>
      <p>All Partner API requests require an API key to be included in the request header:</p>
      <pre><code>X-API-Key: your-api-key-here</code></pre>
      <p><span class="badge badge-info">Demo Key</span> For testing, use: <code>demo-api-key</code></p>
    </div>

    <h2>Partner API Endpoints</h2>

    <div class="card">
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="url">/api/partners/jobs</span>
      </div>
      <p>Retrieve all active job listings with pagination support.</p>

      <h3>Query Parameters</h3>
      <table>
        <tr>
          <th>Parameter</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
        <tr>
          <td><code>page</code></td>
          <td>integer</td>
          <td>No</td>
          <td>Page number (default: 1)</td>
        </tr>
        <tr>
          <td><code>limit</code></td>
          <td>integer</td>
          <td>No</td>
          <td>Items per page (default: 10, max: 100)</td>
        </tr>
      </table>

      <h3>Example Request</h3>
      <pre><code>curl -X GET "https://your-domain.com/api/partners/jobs?page=1&limit=10" \\
  -H "X-API-Key: demo-api-key"</code></pre>

      <h3>Example Response</h3>
      <pre><code>{
  "success": true,
  "data": [
    {
      "id": "job-001",
      "title": "Senior Cardiologist",
      "hospitalName": "Apollo Hospitals",
      "location": {
        "city": "Mumbai",
        "state": "Maharashtra"
      },
      "specialization": "Cardiology",
      "jobType": "full-time",
      "experience": { "min": 8, "max": 15 },
      "salary": {
        "min": 200000,
        "max": 400000,
        "currency": "INR",
        "period": "monthly"
      },
      "description": "...",
      "requirements": ["..."],
      "benefits": ["..."],
      "deadline": "2025-01-31",
      "contactEmail": "careers@apollohospitals.com"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 10,
    "totalPages": 1
  },
  "timestamp": "2024-12-17T10:00:00.000Z"
}</code></pre>
    </div>

    <h2>Public API Endpoints</h2>

    <div class="card">
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="url">/api/jobs</span>
      </div>
      <p>Retrieve all active job listings with optional filters.</p>

      <h3>Query Parameters</h3>
      <table>
        <tr>
          <th>Parameter</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
        <tr>
          <td><code>specialization</code></td>
          <td>string</td>
          <td>Filter by specialization (e.g., Cardiology)</td>
        </tr>
        <tr>
          <td><code>location</code></td>
          <td>string</td>
          <td>Filter by city or state</td>
        </tr>
        <tr>
          <td><code>jobType</code></td>
          <td>string</td>
          <td>Filter by job type (full-time, part-time, contract, locum)</td>
        </tr>
      </table>
    </div>

    <div class="card">
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="url">/api/jobs/{id}</span>
      </div>
      <p>Retrieve details of a specific job by ID.</p>
    </div>

    <div class="card">
      <div class="endpoint">
        <span class="method post">POST</span>
        <span class="url">/api/applications</span>
      </div>
      <p>Submit a job application.</p>

      <h3>Request Body</h3>
      <pre><code>{
  "jobId": "job-001",
  "applicant": {
    "name": "Dr. John Doe",
    "email": "john.doe@email.com",
    "phone": "+91-98765-43210",
    "qualification": "MD Cardiology, MBBS",
    "experience": 10,
    "currentHospital": "City Hospital",
    "coverLetter": "Optional cover letter..."
  }
}</code></pre>
    </div>

    <h2>Admin API Endpoints</h2>
    <p><span class="badge badge-warning">Note</span> These endpoints are for internal admin use.</p>

    <div class="card">
      <div class="endpoint">
        <span class="method post">POST</span>
        <span class="url">/api/jobs</span>
      </div>
      <p>Create a new job listing.</p>
    </div>

    <div class="card">
      <div class="endpoint">
        <span class="method put">PUT</span>
        <span class="url">/api/jobs/{id}</span>
      </div>
      <p>Update an existing job listing.</p>
    </div>

    <div class="card">
      <div class="endpoint">
        <span class="method delete">DELETE</span>
        <span class="url">/api/jobs/{id}</span>
      </div>
      <p>Delete a job listing.</p>
    </div>

    <div class="card">
      <div class="endpoint">
        <span class="method put">PUT</span>
        <span class="url">/api/applications/{id}</span>
      </div>
      <p>Update application status.</p>

      <h3>Valid Statuses</h3>
      <ul>
        <li><code>applied</code> - Initial application received</li>
        <li><code>under_review</code> - Application being reviewed</li>
        <li><code>interview_scheduled</code> - Interview has been scheduled</li>
        <li><code>interview_completed</code> - Interview completed</li>
        <li><code>passed</code> - Candidate passed evaluation</li>
        <li><code>rejected</code> - Application rejected</li>
        <li><code>contract_offered</code> - Contract has been offered</li>
        <li><code>contract_completed</code> - Contract signed and completed</li>
      </ul>
    </div>

    <h2>Error Responses</h2>
    <div class="card">
      <p>All error responses follow this format:</p>
      <pre><code>{
  "success": false,
  "error": "Error message description",
  "timestamp": "2024-12-17T10:00:00.000Z"
}</code></pre>

      <h3>HTTP Status Codes</h3>
      <table>
        <tr>
          <th>Code</th>
          <th>Description</th>
        </tr>
        <tr>
          <td>200</td>
          <td>Success</td>
        </tr>
        <tr>
          <td>201</td>
          <td>Created successfully</td>
        </tr>
        <tr>
          <td>400</td>
          <td>Bad request - Invalid parameters</td>
        </tr>
        <tr>
          <td>401</td>
          <td>Unauthorized - Invalid or missing API key</td>
        </tr>
        <tr>
          <td>404</td>
          <td>Resource not found</td>
        </tr>
        <tr>
          <td>500</td>
          <td>Internal server error</td>
        </tr>
      </table>
    </div>

    <h2>Rate Limiting</h2>
    <div class="card">
      <p>Partner API requests are limited to:</p>
      <ul>
        <li>1000 requests per hour per API key</li>
        <li>Maximum 100 items per request</li>
      </ul>
      <p>Contact our team to increase limits for high-volume partners.</p>
    </div>

    <h2>Contact</h2>
    <div class="card">
      <p>For API access, partnership inquiries, or technical support:</p>
      <p>Email: <a href="mailto:api@medjobs.in">api@medjobs.in</a></p>
    </div>

  </div>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
