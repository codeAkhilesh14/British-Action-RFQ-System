# Database Schema Documentation

## MongoDB Collections

---

## 1. Users Collection

**Collection Name**: `users`

```javascript
{
  _id: ObjectId,
  name: String,                    // User's full name
  email: String,                   // Unique email address
  password: String,                // Hashed password (bcryptjs)
  phone: String,                   // Contact phone number
  company: String,                 // Company name (optional)
  role: String,                    // "buyer" | "supplier" | "admin"
  isActive: Boolean,               // Account status (default: true)
  profileImage: String,            // Profile image URL (optional)
  createdAt: Date,                 // Account creation timestamp
  updatedAt: Date                  // Last update timestamp
}
```

**Indexes**:
```javascript
// Unique indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ phone: 1 })
db.users.createIndex({ role: 1 })
db.users.createIndex({ createdAt: -1 })
```

**Sample Document**:
```json
{
  "_id": "63f7d4b8c1234567890abcd1",
  "name": "John Buyer",
  "email": "buyer@example.com",
  "password": "$2a$10$abc123...",
  "phone": "+44 1234 567890",
  "company": "Acme Corp",
  "role": "buyer",
  "isActive": true,
  "profileImage": null,
  "createdAt": "2024-04-28T10:00:00.000Z",
  "updatedAt": "2024-04-28T10:00:00.000Z"
}
```

---

## 2. RFQs Collection

**Collection Name**: `rfqs`

```javascript
{
  _id: ObjectId,
  title: String,                          // RFQ title
  description: String,                    // Detailed description
  buyerId: ObjectId,                      // Reference to User (buyer)
  startTime: Date,                        // Auction start time
  endTime: Date,                          // Initial end time
  forcedEndTime: Date,                    // Absolute auction end time
  currentLowestBid: Number,               // Lowest bid amount (null if none)
  currentLowestBidderId: ObjectId,        // Reference to User (winning bidder)
  status: String,                         // "pending" | "active" | "ended" | "cancelled"
  bidsCount: Number,                      // Total number of bids (default: 0)
  autoExtendTime: Number,                 // Auto-extend duration in ms (default: 300000 = 5 mins)
  notes: String,                          // Additional notes for suppliers
  createdAt: Date,                        // Creation timestamp
  updatedAt: Date                         // Last update timestamp
}
```

**Indexes**:
```javascript
db.rfqs.createIndex({ buyerId: 1 })
db.rfqs.createIndex({ status: 1 })
db.rfqs.createIndex({ startTime: 1 })
db.rfqs.createIndex({ endTime: 1 })
db.rfqs.createIndex({ forcedEndTime: 1 })
db.rfqs.createIndex({ createdAt: -1 })
db.rfqs.createIndex({ "currentLowestBid": 1 })
```

**Sample Document**:
```json
{
  "_id": "63f7d4b8c1234567890abcd2",
  "title": "Office Furniture Supply",
  "description": "Looking for office furniture for 50 workstations...",
  "buyerId": "63f7d4b8c1234567890abcd1",
  "startTime": "2024-05-01T10:00:00.000Z",
  "endTime": "2024-05-01T14:00:00.000Z",
  "forcedEndTime": "2024-05-01T16:00:00.000Z",
  "currentLowestBid": 4800,
  "currentLowestBidderId": "63f7d4b8c1234567890abcd3",
  "status": "active",
  "bidsCount": 3,
  "autoExtendTime": 300000,
  "notes": "Please provide warranty info",
  "createdAt": "2024-04-28T10:00:00.000Z",
  "updatedAt": "2024-05-01T12:15:00.000Z"
}
```

---

## 3. Bids Collection

**Collection Name**: `bids`

```javascript
{
  _id: ObjectId,
  rfqId: ObjectId,                // Reference to RFQ
  bidderId: ObjectId,             // Reference to User (supplier)
  bidAmount: Number,              // Bid amount in pounds
  bidTime: Date,                  // When bid was placed (default: Date.now)
  message: String,                // Optional message from bidder
  isWinning: Boolean,             // Whether this is winning bid (default: false)
  status: String,                 // "active" | "outbid" | "won" | "cancelled"
  createdAt: Date,                // Creation timestamp
  updatedAt: Date                 // Last update timestamp
}
```

**Indexes**:
```javascript
db.bids.createIndex({ rfqId: 1 })
db.bids.createIndex({ bidderId: 1 })
db.bids.createIndex({ rfqId: 1, bidderId: 1 }, { unique: false })
db.bids.createIndex({ status: 1 })
db.bids.createIndex({ bidTime: 1 })
db.bids.createIndex({ isWinning: 1 })
db.bids.createIndex({ createdAt: -1 })
```

**Sample Document**:
```json
{
  "_id": "63f7d4b8c1234567890abcd4",
  "rfqId": "63f7d4b8c1234567890abcd2",
  "bidderId": "63f7d4b8c1234567890abcd3",
  "bidAmount": 4800,
  "bidTime": "2024-05-01T12:15:00.000Z",
  "message": "Fast delivery available",
  "isWinning": true,
  "status": "active",
  "createdAt": "2024-05-01T12:15:00.000Z",
  "updatedAt": "2024-05-01T12:15:00.000Z"
}
```

---

## Relationships

```
User (Buyer)
    │
    ├─→ RFQ
    │      │
    │      └─→ Bid ←─ User (Supplier)
    │
    └─→ (Multiple RFQs)

User (Supplier)
    │
    └─→ Bid (Multiple bids on different RFQs)
```

---

## Data Flow

### Creating an RFQ
```
1. Buyer logs in → User._id
2. Buyer creates RFQ → RFQ.buyerId = User._id
3. RFQ status = "pending"
4. Suppliers browse and place bids
```

### Placing a Bid
```
1. Supplier views RFQ
2. Places bid with amount < currentLowestBid
3. New bid created → Bid.status = "active"
4. RFQ.currentLowestBid updated
5. Previous winning bid → status = "outbid"
6. If bid near end time → RFQ.endTime extended
```

### Auction Ends
```
1. forcedEndTime reached
2. RFQ.status = "ended"
3. Bid with lowest amount → status = "won"
4. All other bids → status = "outbid"
```

---

## Queries Examples

### Get All RFQs by Status
```javascript
db.rfqs.find({ status: "active" })
```

### Get Buyer's RFQs
```javascript
db.rfqs.find({ buyerId: ObjectId("63f7d4b8c1234567890abcd1") })
```

### Get All Bids for an RFQ (Sorted by Time)
```javascript
db.bids.find({ rfqId: ObjectId("63f7d4b8c1234567890abcd2") })
  .sort({ bidTime: -1 })
```

### Get Supplier's Active Bids
```javascript
db.bids.find({ 
  bidderId: ObjectId("63f7d4b8c1234567890abcd3"),
  status: "active"
})
```

### Get Winning Bid for an RFQ
```javascript
db.bids.findOne({ 
  rfqId: ObjectId("63f7d4b8c1234567890abcd2"),
  status: "won"
})
```

### Get RFQs Ending Soon (Next 1 hour)
```javascript
const now = new Date();
const oneHourLater = new Date(now.getTime() + 3600000);

db.rfqs.find({
  endTime: { $gte: now, $lte: oneHourLater },
  status: "active"
})
```

### Get Supplier Performance Stats
```javascript
db.bids.aggregate([
  { $match: { bidderId: ObjectId("63f7d4b8c1234567890abcd3") } },
  {
    $group: {
      _id: "$bidderId",
      totalBids: { $sum: 1 },
      winCount: { $sum: { $cond: [{ $eq: ["$status", "won"] }, 1, 0] } },
      avgBidAmount: { $avg: "$bidAmount" }
    }
  }
])
```

---

## Backup Strategy

### Full Database Backup
```bash
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/british-auction-rfq"
```

### Incremental Backup
```bash
mongodump --uri "..." --out backup_$(date +%Y%m%d_%H%M%S)
```

### Restore Backup
```bash
mongorestore --uri "..." ./backup_folder
```

---

## Data Validation Rules

### Users
- Email must be unique
- Email must be valid format
- Password minimum 6 characters
- Phone must be present
- Role must be one of: buyer, supplier, admin

### RFQs
- Title required, max 200 chars
- Description required, max 5000 chars
- startTime < endTime < forcedEndTime
- All times must be in future
- buyerId must reference existing User

### Bids
- bidAmount must be positive number
- bidAmount < currentLowestBid (British auction rule)
- bidderId must reference existing User
- bidderId != RFQ.buyerId (can't bid on own RFQ)
- bidTime must be between RFQ startTime and forcedEndTime

---

## Performance Considerations

### Indexing Strategy
- Always index foreign keys (buyerId, bidderId, rfqId)
- Index on frequently queried fields (status, createdAt)
- Composite indexes for common queries
- TTL indexes for auto-deleting old records

### Query Optimization
```javascript
// Instead of fetching full documents:
db.rfqs.find({})

// Use projections to get only needed fields:
db.rfqs.find({}, { title: 1, buyerId: 1, status: 1 })
```

### Connection Pooling
- Use MongoDB connection pooling
- Default pool size: 100 connections
- Adjust based on traffic

---

## Archive Strategy

After 6 months, archive ended RFQs:
```javascript
db.rfqs_archive.insertMany(
  db.rfqs.find({ 
    status: "ended",
    updatedAt: { $lt: new Date(Date.now() - 180*24*60*60*1000) }
  }).toArray()
)

db.rfqs.deleteMany({
  status: "ended",
  updatedAt: { $lt: new Date(Date.now() - 180*24*60*60*1000) }
})
```

---

## Migration Notes

### Adding a New Field
```javascript
db.users.updateMany({}, { $set: { newField: defaultValue } })
```

### Renaming a Field
```javascript
db.users.updateMany({}, { $rename: { "oldName": "newName" } })
```

### Data Type Conversion
```javascript
db.rfqs.updateMany({}, [
  { $set: { createdAt: { $toDate: "$createdAt" } } }
])
```

---

**Database Schema v1.0**
