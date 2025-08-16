# 🚀 AlgoNest Production Deployment Guide

## 📋 Prerequisites
- ✅ EC2 instance ready (Ubuntu 20.04+ recommended)
- ✅ Netlify account ready
- ✅ MongoDB Atlas account (or use EC2 for MongoDB)
- ✅ Domain name (optional but recommended)

---

## 🎯 Deployment Architecture

```
Internet → Netlify (Frontend) → EC2 (Backend + Compiler) → MongoDB Atlas
```

---

## 🌐 1. Frontend Deployment (Netlify)

### Step 1: Build Frontend
```bash
cd frontend
npm run build
```

### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and login
2. Drag & drop the `frontend/dist` folder to deploy
3. Or connect your GitHub repository for auto-deploy

### Step 3: Environment Variables
Add these environment variables in Netlify:
```
VITE_SERVER=https://your-ec2-domain.com
VITE_COMPILER=https://your-ec2-domain.com:9000
```

---

## 🖥️ 2. Backend & Compiler Deployment (EC2)

### Step 1: Connect to EC2
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 2: Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install MongoDB (if not using Atlas)
sudo apt install -y mongodb

# Install build tools
sudo apt install -y build-essential python3 python3-pip openjdk-11-jdk
```

### Step 3: Deploy Backend
```bash
# Clone your repository
git clone https://github.com/yourusername/algonest.git
cd algonest/backend

# Install dependencies
npm install

# Create production .env
cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/algonest
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=production
EOF

# Start with PM2
pm2 start server.js --name "algonest-backend"
pm2 save
pm2 startup
```

### Step 4: Deploy Compiler
```bash
cd ../compiler

# Install dependencies
npm install

# Start with PM2
pm2 start index.js --name "algonest-compiler"
pm2 save
```

### Step 5: Configure Nginx (Reverse Proxy)
```bash
sudo apt install -y nginx

# Create Nginx config
sudo tee /etc/nginx/sites-available/algonest << EOF
server {
    listen 80;
    server_name your-ec2-domain.com;

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Compiler service
    location /compiler/ {
        proxy_pass http://localhost:9000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Frontend (if serving from EC2)
    location / {
        root /var/www/algonest-frontend;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/algonest /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🗄️ 3. Database Setup

### Option A: MongoDB Atlas (Recommended)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Update backend `.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/algonest
```

### Option B: MongoDB on EC2
```bash
# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database and user
mongosh
use algonest
db.createUser({
  user: "algonest_user",
  pwd: "your-secure-password",
  roles: ["readWrite"]
})
exit
```

---

## 🔒 4. Security & SSL

### Install Certbot (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-ec2-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Configure Firewall
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

---

## 🧪 5. Testing Deployment

### Test Backend
```bash
curl https://your-ec2-domain.com/api/problems
```

### Test Compiler
```bash
curl https://your-ec2-domain.com/compiler/health
```

### Test Frontend
Visit your Netlify URL and verify it connects to backend

---

## 📊 6. Monitoring & Maintenance

### PM2 Commands
```bash
pm2 status          # Check status
pm2 logs            # View logs
pm2 restart all     # Restart all services
pm2 monit           # Monitor resources
```

### Nginx Commands
```bash
sudo nginx -t       # Test config
sudo systemctl restart nginx
sudo systemctl status nginx
```

---

## 🚨 Troubleshooting

### Common Issues
1. **Port conflicts**: Check if ports 5000, 9000 are free
2. **Permission errors**: Ensure proper file permissions
3. **MongoDB connection**: Verify connection string and network access
4. **Nginx errors**: Check `/var/log/nginx/error.log`

### Logs Location
- Backend: `pm2 logs algonest-backend`
- Compiler: `pm2 logs algonest-compiler`
- Nginx: `/var/log/nginx/`
- System: `journalctl -u nginx`

---

## 🔄 7. Continuous Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml` for auto-deployment

### Manual Deployment
```bash
# Pull latest changes
git pull origin main

# Restart services
pm2 restart all

# Reload Nginx
sudo systemctl reload nginx
```

---

## 📞 Support
- Check PM2 logs: `pm2 logs`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Monitor resources: `htop`, `df -h`, `free -h`

**Happy Deploying! 🎉**
