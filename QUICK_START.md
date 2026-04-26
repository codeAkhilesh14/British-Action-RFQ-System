# Quick Start Guide

## 🚀 Fast Setup (5 Minutes)

### Prerequisites
- Node.js installed
- MongoDB running (local or cloud)

### Step 1: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 2: Configure Backend Environment
Edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/british-auction-rfq
JWT_SECRET=your_super_secret_key_12345
NODE_ENV=development
```

### Step 3: Start Backend
```bash
npm run dev
```
✅ Backend running on http://localhost:5000

### Step 4: Install Frontend Dependencies
In a new terminal:
```bash
cd client
npm install
```

### Step 5: Configure Frontend Environment
Edit `client/.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 6: Start Frontend
```bash
npm run dev
```
✅ Frontend running on http://localhost:5173

---

## 📱 Test the Application

1. **Open Browser**: http://localhost:5173
2. **Create Buyer Account**:
   - Name: John Buyer
   - Email: buyer@example.com
   - Password: password123
   - Role: Buyer

3. **Create RFQ**:
   - Go to Dashboard → Create RFQ
   - Fill in details and create

4. **Create Supplier Account** (New browser/incognito):
   - Name: Jane Supplier
   - Email: supplier@example.com
   - Password: password123
   - Role: Supplier

5. **Place Bids**:
   - Go to Dashboard
   - Find the RFQ
   - Click and place a bid
   - Place multiple bids (each lower than previous)

---

## 🆘 Troubleshooting

### Backend Won't Start
```bash
# Check if MongoDB is running
# For local MongoDB:
mongod

# Check if port 5000 is already in use
# Kill the process or use different port
```

### Frontend Can't Connect to Backend
```bash
# Ensure backend is running
# Check VITE_API_BASE_URL in client/.env
# Clear browser cache
```

### MongoDB Connection Error
```bash
# Update MONGO_URI in .env
# For MongoDB Atlas:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/british-auction-rfq
```

---

## 📂 File Locations

- **Backend Entry**: `server/index.js`
- **Frontend Entry**: `client/src/main.jsx`
- **Backend Config**: `server/.env`
- **Frontend Config**: `client/.env`

---

## 🔑 Important Notes

- Always use HTTPS in production
- Change JWT_SECRET before deploying
- Keep .env files out of version control
- Test on multiple devices/browsers
- Use real MongoDB for production

---

**Happy Auctioning! 🎯**
