# 🚀 Deployment Guide - School Management API

## ⚠️ Troubleshooting 500 Errors

If you're seeing **500 errors** when deployed, it's usually due to:

1. **Database environment variables not configured**
2. **MySQL database not accessible from hosting service**
3. **Database credentials incorrect**

---

## 🔧 Deploying to Render.com

### Step 1: Prepare Your GitHub Repository

Make sure all code is committed and pushed:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin master
```

### Step 2: Connect to Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Click "New +" → "Web Service"
4. Select your GitHub repository
5. Choose "Node" as the environment

### Step 3: Configure Environment Variables

This is **CRITICAL** to fix the 500 errors!

1. In Render dashboard, go to your service
2. Click "Environment" tab
3. Add the following variables:

```
DB_HOST=your_mysql_host.com
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=school_management
NODE_ENV=production
PORT=5000
```

**Important:** 
- Use a public MySQL host (like AWS RDS, PlanetScale, or Clever Cloud)
- **Local MySQL (localhost) will NOT work** - Render can't access your local machine
- The database must be accessible from the internet

### Step 4: Configure Build Settings

1. **Build Command**: `npm install`
2. **Start Command**: `npm start`
3. **Node Version**: 18 (or higher)

### Step 5: Deploy

Click "Deploy" and wait for the build to complete.

---

## 📊 Using a Remote MySQL Database

Since you can't use localhost from a hosted server, you have options:

### Option 1: **PlanetScale** (Recommended - Free tier)

1. Go to [planetscale.com](https://planetscale.com)
2. Create account
3. Create a new database
4. Go to "Connect" → "Node.js"
5. Copy the connection string:
   ```
   mysql://[username]:[password]@[host]/[database]
   ```
6. Use in your `.env`:
   ```
   DB_HOST=aws.connect.psdb.cloud
   DB_USER=xxx
   DB_PASSWORD=xxx
   DB_NAME=school_management
   ```

### Option 2: **AWS RDS**

1. Create RDS MySQL instance
2. Get endpoint from AWS console
3. Add to environment variables on Render

### Option 3: **Keep Local Database**

If you want to keep using local MySQL:
1. Make sure MySQL is always running
2. Use a tunnel service like ngrok or expose MySQL to the internet (not recommended for production)

---

## 🧪 Testing After Deployment

### Check Logs

1. Go to your Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Look for database connection messages

You should see:
```
✅ MySQL Connected successfully
```

If you see:
```
❌ Database connection failed: ...
```

Then your environment variables are wrong.

### Test API Endpoints

Use Postman with your Render URL:

```
POST https://your-app.onrender.com/addSchool
GET https://your-app.onrender.com/listSchools?latitude=40.7128&longitude=-74.0060
```

---

## 🐛 Common Issues and Solutions

### Issue 1: 500 Error - Database Connection Failed

**Symptoms:**
```
❌ Database connection failed: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:**
- Environment variables not set on Render
- Database host is localhost (won't work)
- **Fix:** Use a remote MySQL service (PlanetScale, AWS RDS)

---

### Issue 2: 500 Error - Table Not Found

**Symptoms:**
```
ER_NO_REFERENCED_TABLE: Table 'school_management.schools' doesn't exist
```

**Solution:**
1. Create the database table on your remote MySQL:

```sql
CREATE DATABASE IF NOT EXISTS school_management;

USE school_management;

CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### Issue 3: 404 Error - Page Not Found

**Symptoms:**
```
Failed to load resource: the server responded with a status of 404
```

**Solution:**
- Make sure `public/` directory is deployed
- Check that `server.js` serves static files correctly
- Restart the service on Render

---

## ✅ Checklist Before Deploying

- [ ] All code committed to GitHub
- [ ] `.env` file is in `.gitignore` (secrets not exposed)
- [ ] `.env.example` exists with template variables
- [ ] Remote MySQL database created and accessible
- [ ] Environment variables set on Render
- [ ] Database tables created on remote server
- [ ] Build and start commands configured
- [ ] Node version set to 18+

---

## 📝 Environment Variables Template

**For Local Development** (`.env`):
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
NODE_ENV=development
```

**For Production** (Set on Render):
```
PORT=5000
DB_HOST=your-db.psdb.cloud
DB_USER=xxx
DB_PASSWORD=xxx
DB_NAME=school_management
NODE_ENV=production
```

---

## 🔗 Useful Resources

- [Render Documentation](https://render.com/docs)
- [PlanetScale MySQL](https://planetscale.com)
- [AWS RDS](https://aws.amazon.com/rds/)
- [Environment Variables Best Practices](https://12factor.net/config)

---

## 📞 Need Help?

1. Check Render logs for error messages
2. Verify environment variables are set
3. Test database connection locally first
4. Make sure database tables exist on remote server
5. Check that all dependencies are installed

---

**Good luck! 🚀**
