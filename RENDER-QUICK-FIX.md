# 🚨 QUICK FIX: 500 Errors on Render

Your app is deployed but getting **500 errors** because **database environment variables aren't set on Render**.

---

## 🔍 Check Your Current Status

Go to your deployed app and open this URL:
```
https://school-management-api-7oo0.onrender.com/api/diagnosis
```

This will show you exactly what's wrong!

---

## ✅ Step-by-Step Fix (10 minutes)

### **Step 1: Set Up Remote MySQL Database**

You need a **cloud MySQL database** (NOT localhost). Choose ONE:

#### **🏆 EASIEST: PlanetScale (Recommended)**

1. Go to [https://planetscale.com](https://planetscale.com)
2. Sign up (free account)
3. Create a new database
4. Click "Connect" button
5. Select "Node.js" driver
6. Copy the connection string that looks like:
   ```
   mysql://user:password@host/dbname
   ```

#### **Alternative: Clever Cloud**

1. Go to [https://www.clever-cloud.com](https://www.clever-cloud.com)
2. Create account
3. Create MySQL add-on
4. Get connection details

---

### **Step 2: Set Environment Variables on Render**

**⚠️ THIS IS THE MOST IMPORTANT STEP**

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click on your service: **school-management-api-7oo0**
3. Click the **"Environment"** tab (top menu)
4. Click **"Add Environment Variable"**
5. Add these ONE BY ONE:

```
Name: DB_HOST
Value: (from your PlanetScale connection string, the hostname part)
```

```
Name: DB_USER
Value: (from your PlanetScale connection string, the username part)
```

```
Name: DB_PASSWORD
Value: (from your PlanetScale connection string, the password part)
```

```
Name: DB_NAME
Value: (from your PlanetScale connection string, the database name)
```

```
Name: NODE_ENV
Value: production
```

Example from PlanetScale connection string:
```
mysql://user123:pass456@aws.connect.psdb.cloud/school_management

DB_HOST: aws.connect.psdb.cloud
DB_USER: user123
DB_PASSWORD: pass456
DB_NAME: school_management
```

6. Click **Save Changes**

---

### **Step 3: Create Database Tables**

Connect to your remote MySQL (PlanetScale provides a tool):

Run this SQL:
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

**For PlanetScale**: Use their web console to run this SQL.

---

### **Step 4: Test Your Setup**

After saving environment variables, Render will auto-redeploy (takes 1-2 minutes).

Then visit:
```
https://school-management-api-7oo0.onrender.com/api/diagnosis
```

You should see:
```json
{
  "status": "OK",
  "message": "All systems operational",
  "checks": {
    "database": { "status": "OK" },
    "schema": { "status": "OK" }
  }
}
```

---

## 🧪 Test the API

Once diagnosis shows OK:

1. Visit: `https://school-management-api-7oo0.onrender.com`
2. Fill in the form:
   - School Name: "Test School"
   - Address: "123 Main St"
   - Latitude: 40.7128
   - Longitude: -74.0060
3. Click "Add School"
4. Should see: ✅ "School added successfully"

---

## 🐛 Troubleshooting

### **Still Seeing 500 Error?**

1. Check `/api/diagnosis` - it will tell you exactly what's wrong
2. Make sure environment variables are **saved** on Render
3. Wait 2-3 minutes for Render to redeploy
4. Try **Force Deploy** in Render dashboard

### **Diagnosis Shows Missing Variables?**

- You haven't set them on Render yet
- Or you set them but Render hasn't redeployed
- Click **Redeploy** on Render dashboard

### **Diagnosis Shows Database Connection Failed?**

- Database credentials are wrong
- Database host is not accessible from Render
- Try a different database service (PlanetScale usually works better)

### **Diagnosis Shows Schema Error?**

- You forgot to create the `schools` table
- Run the SQL script on your remote database

---

## 🔗 Useful Links

- **PlanetScale**: https://planetscale.com (free MySQL hosting)
- **Render Docs**: https://render.com/docs
- **Your Diagnosis**: https://school-management-api-7oo0.onrender.com/api/diagnosis
- **Your App**: https://school-management-api-7oo0.onrender.com

---

## 📋 Checklist

- [ ] Created remote MySQL database (PlanetScale/Clever Cloud)
- [ ] Set DB_HOST on Render
- [ ] Set DB_USER on Render
- [ ] Set DB_PASSWORD on Render
- [ ] Set DB_NAME on Render
- [ ] Saved changes (Render auto-redeploys)
- [ ] Waited 2 minutes for redeploy
- [ ] Created `schools` table on remote database
- [ ] Checked `/api/diagnosis` - shows OK
- [ ] Tested adding a school via UI

---

**💡 Still stuck? Check `/api/diagnosis` - it will guide you to the next step!**
