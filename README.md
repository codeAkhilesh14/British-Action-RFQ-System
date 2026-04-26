# 🏛️ British Auction RFQ System

A complete MERN stack web application for managing Request for Quotations (RFQ) using British auction bidding mechanism.

## 📋 Features

### Core Features
- **User Authentication**: Signup/Login with JWT stored in HTTP-only cookies
- **Role-Based Access**: Buyer, Supplier, and Admin roles
- **RFQ Management**: Buyers can create and manage RFQs
- **British Auction Bidding**: Suppliers place decreasing bids
- **Real-time Auction**: Auto-extend when bids are placed near end time
- **Responsive UI**: Mobile-friendly design with Tailwind CSS
- **State Management**: Redux Toolkit for state management

### Authentication
- Secure password hashing with bcryptjs
- JWT token validation
- Role-based route protection
- HTTP-only cookies for security

### RFQ System
- Create RFQs with detailed specifications
- Set custom auction timelines
- Auto-extend auctions on new bids
- Forced end time enforcement
- Bid history tracking

### Bidding System
- British auction logic (each bid must be lower)
- Real-time bid updates
- Bid status tracking (active, outbid, won)
- Message support with bids

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Middleware**: CORS, Cookie-Parser

### Frontend
- **UI Library**: React 18
- **Routing**: React Router v6
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: react-icons
- **Loading**: react-spinners
- **Build Tool**: Vite

## 📁 Project Structure

```
British Auction RFQ System/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── rfq.controller.js
│   │   └── bid.controller.js
│   ├── models/
│   │   ├── User.js
│   │   ├── RFQ.js
│   │   └── Bid.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── rfq.routes.js
│   │   └── bid.routes.js
│   ├── middlewares/
│   │   ├── isAuth.js
│   │   ├── role.middleware.js
│   │   └── error.middleware.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── asyncHandler.js
│   ├── .env
│   ├── index.js
│   └── package.json
└── client/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CreateRFQ.jsx
    │   │   └── RFQDetails.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Loader.jsx
    │   ├── redux/
    │   │   ├── store.js
    │   │   └── userSlice.js
    │   ├── hooks/
    │   │   └── useGetCurrentUser.js
    │   ├── api/
    │   │   └── axiosInstance.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/british-auction-rfq
   JWT_SECRET=your_jwt_secret_key_change_in_production
   NODE_ENV=development
   ```

3. **Start MongoDB**
   ```bash
   # For local MongoDB
   mongod
   ```

4. **Start the Server**
   ```bash
   npm run dev
   # or for production
   npm start
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the client directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - User logout

### User Routes
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)

### RFQ Routes
- `POST /api/rfq/create` - Create RFQ (buyer only)
- `GET /api/rfq/all` - Get all RFQs
- `GET /api/rfq/:id` - Get RFQ details
- `PUT /api/rfq/:id` - Update RFQ (buyer only)
- `DELETE /api/rfq/:id` - Delete RFQ (buyer only)
- `GET /api/rfq/my-rfqs` - Get user's RFQs (buyer only)

### Bid Routes
- `POST /api/bid/place` - Place a bid (supplier only)
- `GET /api/bid/:rfqId` - Get bids for an RFQ
- `GET /api/bid/my-bids/all` - Get user's bids (supplier only)
- `GET /api/bid/winning/:rfqId` - Get winning bid for RFQ
- `DELETE /api/bid/:bidId` - Delete a bid (supplier only)

## 👥 User Roles

### Buyer
- Create and manage RFQs
- View all bids on their RFQs
- Set auction timeline
- View dashboard with their RFQs

### Supplier
- Browse available RFQs
- Place bids (must be lower than current lowest)
- View bid history
- Track bid status (active, outbid, won)

### Admin
- Manage users
- Moderate RFQs
- View system statistics

## 🎯 British Auction Logic

1. **Descending Price**: Each new bid must be lower than the previous bid
2. **Auto Extension**: If a bid is placed within 5 minutes of end time, the auction is extended
3. **Forced End Time**: Auction ends at forced end time regardless of bids
4. **Winning Condition**: The supplier with the lowest final bid wins

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: JWT stored securely in HTTP-only cookies
- **Password Hashing**: bcryptjs with salt rounds
- **Role-Based Access Control**: Protected routes based on user roles
- **CORS**: Configured for secure cross-origin requests
- **Input Validation**: Server-side validation for all inputs

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Spinner animations during data fetching
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success/error feedback
- **Dark Mode Ready**: Tailwind CSS for easy theming
- **Accessibility**: Semantic HTML and ARIA labels

## 📦 Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "dotenv": "^16.3.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.1.0",
  "cookie-parser": "^1.4.6",
  "cors": "^2.8.5"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.18.0",
  "axios": "^1.6.0",
  "react-redux": "^8.1.3",
  "@reduxjs/toolkit": "^1.9.7",
  "react-icons": "^4.13.0",
  "react-spinners": "^0.13.8",
  "tailwindcss": "^3.4.0"
}
```

## 🧪 Testing the Application

### Demo Accounts
- **Buyer**: buyer@example.com / password
- **Supplier**: supplier@example.com / password

### Test Workflow
1. Sign up as a buyer
2. Create an RFQ with title, description, and timeline
3. Sign up as a supplier (different account)
4. Browse available RFQs
5. Place a bid (must be lower than previous)
6. View bid history and status

## 🚨 Error Handling

- Global error middleware catches all errors
- Proper HTTP status codes returned
- User-friendly error messages
- Token expiration handling
- Duplicate email validation
- Input validation on all endpoints

## 📝 Notes

- Ensure MongoDB is running before starting the backend
- Update JWT_SECRET in production
- Configure CORS_ORIGIN for production deployment
- Use environment variables for sensitive data
- Test thoroughly before deploying to production

## 🔄 Deployment

### Backend (Heroku, AWS, etc.)
1. Set environment variables in hosting platform
2. Deploy `server` folder
3. Ensure MongoDB is accessible

### Frontend (Vercel, Netlify, etc.)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Set `VITE_API_BASE_URL` to production backend URL

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Verify MongoDB connection
3. Ensure environment variables are set correctly
4. Check network tab in browser dev tools

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using MERN Stack**
