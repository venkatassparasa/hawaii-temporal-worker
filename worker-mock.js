// Mock Temporal Worker for Render Deployment
// This simulates the worker functionality without the native bridge issues

require('dotenv').config();

class MockWorker {
  constructor(config) {
    this.config = config;
    this.namespace = config.namespace;
    this.taskQueue = config.taskQueue;
    this.isRunning = false;
  }

  async run() {
    console.log(`🔄 Mock Worker started for namespace: ${this.namespace}, taskQueue: ${this.taskQueue}`);
    console.log('📝 This is a mock worker that simulates Temporal functionality');
    console.log('🚀 Ready to process Hawaii Compliance workflows...');
    
    this.isRunning = true;
    
    // Keep the process alive
    return new Promise((resolve) => {
      // Simulate worker staying alive
      process.on('SIGINT', () => {
        console.log('🛑 Mock worker shutting down...');
        this.isRunning = false;
        resolve();
      });
      
      // Simulate periodic heartbeat
      setInterval(() => {
        if (this.isRunning) {
          console.log(`💓 Mock worker heartbeat - ${new Date().toISOString()}`);
        }
      }, 30000); // Every 30 seconds
    });
  }
}

async function runWorker() {
  console.log('🚀 Starting Hawaii Compliance Mock Temporal Worker...');
  console.log(`📡 Mock connecting to Temporal: ${process.env.TEMPORAL_ADDRESS}`);
  console.log(`🏷️  Namespace: ${process.env.TEMPORAL_NAMESPACE}`);
  console.log(`📋 Task Queue: ${process.env.TEMPORAL_TASK_QUEUE}`);

  try {
    const worker = new MockWorker({
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
      taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'tvr-compliance-queue',
    });

    console.log('✅ Mock worker started successfully, listening for tasks...');
    console.log('🔄 Ready to process Hawaii Compliance workflows...');
    
    await worker.run();
  } catch (error) {
    console.error('❌ Failed to start mock worker:', error);
    process.exit(1);
  }
}

runWorker().catch((error) => {
  console.error('❌ Mock worker failed:', error);
  process.exit(1);
});
