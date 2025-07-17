# Render Deployment Guide

This guide will help you deploy the Quranic Schools Backend to Render.

## Prerequisites

1. A Render account
2. A MongoDB database (MongoDB Atlas recommended)
3. Your code pushed to a Git repository

## Step 1: Create a New Web Service

1. Log in to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your Git repository
4. Select the repository containing this backend code

## Step 2: Configure the Web Service

### Basic Settings
- **Name**: `quranic-schools-backend` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose the closest to your users
- **Branch**: `master` (or your main branch)

### Build & Deploy Settings
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Environment Variables
Add the following environment variables in the Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
CORS_ORIGIN=https://your-frontend-domain.com,http://localhost:3000
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### Important Notes:
- **PORT**: Render automatically sets the PORT environment variable. The app will use this.
- **MONGODB_URI**: Use your MongoDB Atlas connection string
- **JWT_SECRET**: Generate a strong random string for JWT signing
- **CORS_ORIGIN**: Add your frontend domain(s) separated by commas

## Step 3: Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Monitor the build logs for any errors

## Step 4: Verify Deployment

Once deployed, test these endpoints:

- **Health Check**: `https://your-app-name.onrender.com/health`
- **API Info**: `https://your-app-name.onrender.com/`
- **Test Route**: `https://your-app-name.onrender.com/test`

## Step 5: Set Up Admin Account

After deployment, you can create an admin account using the seed script:

```bash
# Run this locally with the production database URI
MONGODB_URI=your_production_mongodb_uri npm run seed
```

Or use the API endpoint:
```
POST https://your-app-name.onrender.com/api/auth/admin/register
{
  "email": "admin@example.com",
  "password": "securepassword123",
  "name": "Admin User"
}
```

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation succeeds locally

2. **Server Won't Start**
   - Verify environment variables are set correctly
   - Check MongoDB connection string
   - Ensure PORT is not hardcoded

3. **503 Errors**
   - Check Render logs for startup errors
   - Verify the start command is `npm start` (not `npm run dev`)
   - Ensure the server binds to `0.0.0.0` and the correct port

4. **Database Connection Issues**
   - Verify MongoDB Atlas network access allows Render's IPs
   - Check connection string format
   - Ensure database user has correct permissions

### Checking Logs:

1. Go to your Render dashboard
2. Select your web service
3. Click on "Logs" tab
4. Look for error messages during startup

### Environment Variable Debugging:

Add this temporary route to debug environment variables:

```typescript
app.get('/debug-env', (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
  });
});
```

## Performance Optimization

1. **Enable Auto-Deploy**: Turn on auto-deploy for your main branch
2. **Health Checks**: The `/health` endpoint is used by Render for health checks
3. **Logging**: Monitor logs regularly for performance issues
4. **Database**: Consider using MongoDB Atlas M10+ for production workloads

## Security Considerations

1. **Environment Variables**: Never commit secrets to your repository
2. **CORS**: Restrict CORS origins to your frontend domains only
3. **Rate Limiting**: Adjust rate limits based on your traffic
4. **JWT Secrets**: Use strong, unique secrets for JWT signing

## Monitoring

- Set up alerts in Render for failed deployments
- Monitor MongoDB Atlas metrics
- Check application logs regularly
- Set up uptime monitoring for your API endpoints 