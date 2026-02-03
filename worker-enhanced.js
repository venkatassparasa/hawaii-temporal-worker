// Enhanced Mock Temporal Worker with Local Workflow Storage
// This simulates Temporal Cloud functionality with local storage

require('dotenv').config();

console.log('🚀 Starting Hawaii Compliance Enhanced Mock Temporal Worker...');
console.log(`📡 Mock connecting to Temporal: ${process.env.TEMPORAL_ADDRESS}`);
console.log(`🏷️  Namespace: ${process.env.TEMPORAL_NAMESPACE}`);
console.log(`📋 Task Queue: ${process.env.TEMPORAL_TASK_QUEUE}`);

// Local workflow storage (simulates Temporal Cloud)
let workflows = new Map();
let workflowCounter = 1000;

// Mock workflow execution
function executeWorkflow(workflowType, inputData) {
  const workflowId = `workflow-${workflowCounter++}`;
  const now = new Date().toISOString();
  
  const workflow = {
    workflowId,
    workflowType,
    status: 'RUNNING',
    startTime: now,
    input: inputData,
    result: null,
    error: null,
    history: [
      {
        timestamp: now,
        event: 'WORKFLOW_STARTED',
        details: `Started ${workflowType}`
      }
    ]
  };
  
  workflows.set(workflowId, workflow);
  
  // Simulate workflow completion after delay
  setTimeout(() => {
    const completedWorkflow = workflows.get(workflowId);
    if (completedWorkflow) {
      completedWorkflow.status = 'COMPLETED';
      completedWorkflow.endTime = new Date().toISOString();
      completedWorkflow.result = generateMockResult(workflowType, inputData);
      completedWorkflow.history.push({
        timestamp: completedWorkflow.endTime,
        event: 'WORKFLOW_COMPLETED',
        details: `${workflowType} completed successfully`
      });
    }
  }, 5000 + Math.random() * 10000); // 5-15 seconds
  
  return workflow;
}

function generateMockResult(workflowType, inputData) {
  switch (workflowType) {
    case 'TVRRegistrationWorkflow':
      return {
        status: 'approved',
        registrationId: `TVR-${Date.now()}`,
        approvedAt: new Date().toISOString()
      };
    case 'ComplaintInvestigationWorkflow':
      return {
        status: 'violated',
        violationId: `VIOLATION-${Date.now()}`,
        completedAt: new Date().toISOString()
      };
    case 'ViolationAppealWorkflow':
      return {
        status: 'overturned',
        decision: 'Appeal granted based on new evidence',
        decidedAt: new Date().toISOString()
      };
    case 'AnnualInspectionWorkflow':
      return {
        status: 'compliant',
        report: 'Annual inspection completed',
        inspectedAt: new Date().toISOString()
      };
    default:
      return { status: 'completed', timestamp: new Date().toISOString() };
  }
}

// HTTP Server
const http = require('http');

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const url = new URL(req.url, `http://localhost:${process.env.PORT || 8080}`);
  
  if (url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'Hawaii Compliance Enhanced Mock Temporal Worker',
      timestamp: Date.now(),
      workerRunning: true,
      taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'tvr-compliance-queue',
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
      workflowsStored: workflows.size
    }));
  } else if (url.pathname === '/api/info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      service: 'Hawaii Compliance Enhanced Mock Temporal Worker',
      version: '1.0.0',
      description: 'Enhanced Mock Temporal Worker with Local Storage',
      workflows: ['TVRRegistrationWorkflow', 'ComplaintInvestigationWorkflow', 'ViolationAppealWorkflow', 'AnnualInspectionWorkflow'],
      activities: ['performInitialReview', 'verifyZoning', 'processNCUC', 'scheduleInspection', 'finalizeRegistration'],
      features: ['Local workflow storage', 'Mock execution', 'History tracking', 'Status updates']
    }));
  } else if (url.pathname === '/api/workflows') {
    if (req.method === 'GET') {
      // Return list of workflows
      const workflowList = Array.from(workflows.values()).map(w => ({
        workflowId: w.workflowId,
        workflowType: w.workflowType,
        status: w.status,
        startTime: w.startTime,
        endTime: w.endTime,
        input: w.input
      }));
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        workflows: workflowList,
        total: workflowList.length
      }));
    } else if (req.method === 'POST') {
      // Start a new workflow
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const { workflowType, input } = JSON.parse(body);
          const workflow = executeWorkflow(workflowType, input);
          
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            workflowId: workflow.workflowId,
            status: workflow.status,
            message: 'Workflow started successfully'
          }));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: error.message
          }));
        }
      });
    }
  } else if (url.pathname.startsWith('/api/workflows/') && req.method === 'GET') {
    // Get specific workflow details
    const workflowId = url.pathname.split('/')[3];
    const workflow = workflows.get(workflowId);
    
    if (workflow) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(workflow));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Workflow not found' }));
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🌐 Enhanced mock worker HTTP server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Workflows: http://localhost:${PORT}/api/workflows`);
});

// Add some sample workflows for testing
setTimeout(() => {
  console.log('🔄 Adding sample workflows for testing...');
  
  executeWorkflow('TVRRegistrationWorkflow', {
    applicationId: 'APP-001',
    propertyId: 'PROP-001',
    applicantName: 'John Doe',
    requiresNCUC: false
  });
  
  executeWorkflow('ComplaintInvestigationWorkflow', {
    complaintId: 'COMP-001',
    priority: 2
  });
  
  executeWorkflow('ViolationAppealWorkflow', {
    appealId: 'APPEAL-001'
  });
  
  console.log(`✅ Added ${workflows.size} sample workflows`);
}, 2000);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Enhanced mock worker shutting down gracefully...');
  server.close(() => {
    console.log('✅ Enhanced mock worker stopped');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Enhanced mock worker shutting down gracefully...');
  server.close(() => {
    console.log('✅ Enhanced mock worker stopped');
    process.exit(0);
  });
});

// Keep the process alive
setInterval(() => {
  console.log('💓 Enhanced mock worker heartbeat - ' + new Date().toISOString());
  console.log(`📊 Active workflows: ${workflows.size}`);
}, 30000); // Every 30 seconds
