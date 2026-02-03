const { Worker } = require('@temporalio/worker');
const activities = require('./activities');
require('dotenv').config();

async function runWorker() {
  console.log('🚀 Starting Hawaii Compliance Temporal Worker...');
  console.log(`📡 Connecting to Temporal: ${process.env.TEMPORAL_ADDRESS}`);
  console.log(`🏷️  Namespace: ${process.env.TEMPORAL_NAMESPACE}`);
  console.log(`📋 Task Queue: ${process.env.TEMPORAL_TASK_QUEUE}`);

  try {
    const worker = await Worker.create({
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
      taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'tvr-compliance-queue',
      workflowsPath: require.resolve('./workflows'),
      activities,
      connection: {
        address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
      },
    });

    console.log('✅ Worker started successfully, listening for tasks...');
    console.log('🔄 Ready to process Hawaii Compliance workflows...');
    
    await worker.run();
  } catch (error) {
    console.error('❌ Failed to start worker:', error);
    process.exit(1);
  }
}

runWorker().catch((error) => {
  console.error('❌ Worker failed:', error);
  process.exit(1);
});
