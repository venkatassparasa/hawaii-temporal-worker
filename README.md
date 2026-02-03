# 🚀 Hawaii Compliance Temporal Worker

Temporal worker for processing Hawaii Compliance Dashboard workflows on Temporal Cloud.

## 📋 Prerequisites

- Node.js 18+
- Temporal Cloud account
- Railway/Render/Docker account for deployment

## 🔧 Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Temporal Cloud credentials
```

3. Run the worker:
```bash
npm run dev
```

## 🚀 Deployment Options

### Option 1: Railway (Recommended)

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login to Railway**:
```bash
railway login
```

3. **Initialize project**:
```bash
cd temporal-worker-deploy
railway init
```

4. **Set environment variables** in Railway dashboard:
```
TEMPORAL_ADDRESS=ap-south-1.aws.api.temporal.io:7233
TEMPORAL_NAMESPACE=quickstart-hawaii-compliance.c5kwa
TEMPORAL_TASK_QUEUE=tvr-compliance-queue
NODE_ENV=production
```

5. **Deploy**:
```bash
railway up
```

### Option 2: Render

1. **Create new Web Service** on Render
2. **Connect GitHub repository**
3. **Set environment variables**
4. **Deploy**

### Option 3: Docker

1. **Build Docker image**:
```bash
docker build -t hawaii-temporal-worker .
```

2. **Run container**:
```bash
docker run -d \
  --name temporal-worker \
  -e TEMPORAL_ADDRESS=ap-south-1.aws.api.temporal.io:7233 \
  -e TEMPORAL_NAMESPACE=quickstart-hawaii-compliance.c5kwa \
  -e TEMPORAL_TASK_QUEUE=tvr-compliance-queue \
  hawaii-temporal-worker
```

## 🔗 Integration with Vercel App

Once deployed, update your Vercel app to use the deployed worker:

1. **Worker URL**: Get the deployed worker URL from Railway/Render
2. **Test Connection**: Verify worker is connected to Temporal Cloud
3. **Monitor**: Check Temporal Cloud UI for active workers

## 📊 Monitoring

- **Temporal Cloud UI**: https://temporal.io/cloud
- **Logs**: Railway/Render dashboard logs
- **Health**: Worker logs show connection status

## 🛠️ Troubleshooting

### Worker Not Connecting
1. Check TEMPORAL_ADDRESS and NAMESPACE
2. Verify network connectivity
3. Check environment variables

### No Tasks Processing
1. Verify task queue name matches
2. Check if workflows are being started
3. Review worker logs

### Connection Timeouts
1. Check firewall settings
2. Verify Temporal Cloud namespace
3. Review network configuration

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|-----------|
| `TEMPORAL_ADDRESS` | Temporal Cloud address | ✅ |
| `TEMPORAL_NAMESPACE` | Your namespace | ✅ |
| `TEMPORAL_TASK_QUEUE` | Task queue name | ✅ |
| `NODE_ENV` | Environment | ❌ |
| `LOG_LEVEL` | Logging level | ❌ |

## 🔄 Workflow Types

This worker supports:
- `TVRRegistrationWorkflow`
- `ComplaintInvestigationWorkflow`
- `ViolationAppealWorkflow`
- `AnnualInspectionWorkflow`

## 📞 Support

- **Temporal Docs**: https://docs.temporal.io
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
