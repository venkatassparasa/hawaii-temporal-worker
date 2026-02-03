// Simple Mock Temporal Worker for Render Deployment
// This will work without any native dependencies

require('dotenv').config();

console.log('🚀 Starting Hawaii Compliance Mock Temporal Worker...');
console.log(`📡 Mock connecting to Temporal: ${process.env.TEMPORAL_ADDRESS}`);
console.log(`🏷️  Namespace: ${process.env.TEMPORAL_NAMESPACE}`);
console.log(`📋 Task Queue: ${process.env.TEMPORAL_TASK_QUEUE}`);

// Simulate worker startup
setTimeout(() => {
  console.log('✅ Mock worker started successfully');
  console.log('🔄 Ready to process Hawaii Compliance workflows...');
  console.log('💓 Mock worker heartbeat - ' + new Date().toISOString());
}, 1000);

// Health check endpoint
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'Hawaii Compliance Mock Temporal Worker',
      timestamp: Date.now(),
      workerRunning: true,
      taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'tvr-compliance-queue',
      namespace: process.env.TEMPORAL_NAMESPACE || 'default'
    }));
  } else if (req.url === '/api/info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      service: 'Hawaii Compliance Mock Temporal Worker',
      version: '1.0.0',
      description: 'Mock Temporal Worker for Hawaii Compliance Dashboard',
      workflows: ['TVRRegistrationWorkflow', 'ComplaintInvestigationWorkflow', 'ViolationAppealWorkflow', 'AnnualInspectionWorkflow'],
      activities: ['performInitialReview', 'verifyZoning', 'processNCUC', 'scheduleInspection', 'finalizeRegistration']
    }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🌐 Mock worker HTTP server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Mock worker shutting down gracefully...');
  server.close(() => {
    console.log('✅ Mock worker stopped');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Mock worker shutting down gracefully...');
  server.close(() => {
    console.log('✅ Mock worker stopped');
    process.exit(0);
  });
});

// Keep the process alive
setInterval(() => {
  console.log('💓 Mock worker heartbeat - ' + new Date().toISOString());
}, 30000); // Every 30 seconds
