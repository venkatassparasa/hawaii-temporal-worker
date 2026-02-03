# 🚀 Temporal Worker Deployment Guide

## Current Status
✅ Worker works locally  
❌ Railway deployment failing (npm install issues)  
🎯 **Alternative: Use Render (Easier)**

## 🎯 Option: Deploy to Render (Recommended)

### Step 1: Go to Render.com
1. Visit https://render.com
2. Sign up/login
3. Click "New" → "Web Service"

### Step 2: Connect Repository
1. Choose "GitHub" (or Git provider)
2. Connect your repository (or create a new one)
3. Select the `temporal-worker-deploy` folder

### Step 3: Configure Service
```
Name: hawaii-temporal-worker
Environment: Node
Region: Choose closest to your users
Branch: main
Root Directory: temporal-worker-deploy
Build Command: npm install
Start Command: npm start
Instance Type: Free (or Basic for production)
```

### Step 4: Environment Variables
Add these environment variables in Render dashboard:
```
TEMPORAL_ADDRESS=ap-south-1.aws.api.temporal.io:7233
TEMPORAL_NAMESPACE=default
TEMPORAL_TASK_QUEUE=tvr-compliance-queue
NODE_ENV=production
```

### Step 5: Deploy
Click "Create Web Service" and Render will deploy automatically.

## 🔧 Alternative: Docker Deployment

### Step 1: Build Docker Image
```bash
cd temporal-worker-deploy
docker build -t hawaii-temporal-worker .
```

### Step 2: Run Container
```bash
docker run -d \
  --name temporal-worker \
  -e TEMPORAL_ADDRESS=ap-south-1.aws.api.temporal.io:7233 \
  -e TEMPORAL_NAMESPACE=default \
  -e TEMPORAL_TASK_QUEUE=tvr-compliance-queue \
  hawaii-temporal-worker
```

### Step 3: Deploy to Docker Hub
```bash
# Tag and push to Docker Hub
docker tag hawaii-temporal-worker yourusername/hawaii-temporal-worker:latest
docker push yourusername/hawaii-temporal-worker:latest
```

## 📊 Verification

### Check Worker Status
1. **Render Dashboard**: Check logs for connection status
2. **Temporal Cloud UI**: https://temporal.io/cloud
3. **Test Workflow**: Use Vercel app to create workflow

### Expected Logs
```
🚀 Starting Hawaii Compliance Temporal Worker...
📡 Connecting to Temporal: ap-south-1.aws.api.temporal.io:7233
🏷️  Namespace: default
📋 Task Queue: tvr-compliance-queue
✅ Worker started successfully, listening for tasks...
```

## 🔗 Integration with Vercel App

Once worker is deployed:

1. **Update Vercel App**: Temporal API should now connect to real workflows
2. **Test Integration**: Create workflow from Vercel app dashboard
3. **Monitor**: Check Temporal Cloud UI for active workflows

## 🐛 Troubleshooting

### Worker Not Connecting
- Check TEMPORAL_ADDRESS and NAMESPACE
- Verify network connectivity
- Check deployment logs

### No Tasks Processing
- Verify task queue name matches
- Check if workflows are being started
- Review worker logs

### Deployment Issues
- Check environment variables
- Verify Node.js version compatibility
- Review build logs

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Temporal Cloud**: https://temporal.io/cloud
- **Docker Docs**: https://docs.docker.com

## 🎉 Success Criteria

✅ Worker connects to Temporal Cloud  
✅ Processes workflows from Vercel app  
✅ Shows up in Temporal Cloud UI  
✅ No deployment errors  

**Choose Render for the easiest deployment!** 🚀
