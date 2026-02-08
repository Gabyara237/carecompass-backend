# CareCompass – Backend

![Node.js](https://img.shields.io/badge/node.js-20.x-green)
![Express](https://img.shields.io/badge/express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/mongodb-7.x-green)
![JWT](https://img.shields.io/badge/auth-JWT-blue)
![Mongoose](https://img.shields.io/badge/mongoose-8.x-red)

**CareCompass Backend** is the server-side API for CareCompass, a healthcare access platform that helps immigrant communities find affordable, multilingual community health clinics. The API provides geospatial search, clinic data management, user authentication, and a review system.

## Description

This Node.js + Express REST API uses MongoDB with geospatial indexing to enable location-based clinic searches. It includes JWT authentication, CRUD operations for clinics and reviews, geocoding integration, and distance calculations using the Haversine formula.

## Project Links

- **Backend Repository:**  
  [View the CareCompass Backend repository on GitHub](https://github.com/Gabyara237/carecompass-backend/) 

- **Frontend Repository:**  
  [View the CareCompass Frontend repository on GitHub](https://github.com/Gabyara237/carecompass-frontend/) 


## Core Features

- **Geospatial Search** – Find clinics by coordinates with $near queries and 2dsphere indexing
- **Distance Calculation** – Haversine formula for accurate distance in kilometers
- **Advanced Filtering** – Filter by language, specialty, insurance acceptance, and radius
- **Geocoding Integration** – Convert zip codes/cities to coordinates using Nominatim API
- **Review System** – CRUD operations with ownership validation and average rating calculation
- **JWT Authentication** – Secure user registration, login, and protected routes
- **Clinic Management** – Full CRUD for clinics with validation and virtual fields
- **Seed Data** – 17 verified community health clinics across the Bay Area

## Technologies Used

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB with geospatial support
- **JWT** – JSON Web Tokens for authentication
- **bcrypt** – Password hashing
- **dotenv** – Environment variable management
- **Nominatim API** – Geocoding service (OSM)
- **CORS** – Cross-origin resource sharing

## Team

This project was collaboratively developed by:

- **Gabriela Araujo** – Full Stack Development  
  [GitHub Profile](https://github.com/Gabyara237)

- **John Gutierrez** – Full Stack Development  
  [GitHub Profile](https://github.com/canilo1) 


## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/sign-up` | Register new user | No |
| POST | `/auth/sign-in` | Login user, returns JWT | No |

### Clinics
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/clinics` | Get all clinics (paginated) | No |
| GET | `/clinics/search` | Search with filters (city, language, etc.) | No |
| GET | `/clinics/nearby` | Geospatial search by coordinates | No |
| GET | `/clinics/geocode?q=94601` | Convert location to coordinates | No |
| GET | `/clinics/:id` | Get clinic by ID with reviews | No |
| POST | `/clinics` | Create new clinic | Yes |
| PUT | `/clinics/:id` | Update clinic | Yes |
| DELETE | `/clinics/:id` | Delete clinic | Yes |

### Reviews
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/clinics/:id/reviews` | Get all reviews for clinic | No |
| POST | `/clinics/:id/reviews` | Add review (1 per user) | Yes |
| PUT | `/clinics/:id/reviews/:reviewId` | Update own review | Yes |
| DELETE | `/clinics/:id/reviews/:reviewId` | Delete own review | Yes |

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Gabyara237/carecompass-backend/
cd carecompass-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/carecompass
JWT_SECRET=your_super_secret_key_here
```

> For production, use MongoDB Atlas connection string.

### 4. Seed the database (optional)
```bash
node seeds/clinics.seed.js
```

> Seeds 13 verified community health clinics across the Bay Area.

### 5. Run the server
```bash
# Development
npm run dev

# Production
npm start
```

> Server will run on http://localhost:3000


## Key Features Implementation

### Geospatial Search

**2dsphere Index:**
```javascript
clinicSchema.index({ location: '2dsphere' });
```

**Nearby Search Query:**
```javascript
{
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [lng, lat] },
      $maxDistance: radius * 1000  
  }
}
```

**Distance Calculation (Haversine Formula):**
```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
```

### Review System

**Auto-calculate Average Rating (Mongoose Middleware):**
```javascript
clinicSchema.pre('save', function() {
  if (this.isModified('reviews')) {
    this.calculateAverageRating();
  }
});
```

**One Review Per User:**
```javascript
const existingReview = clinic.reviews.find(
  review => review.user.toString() === userId.toString()
);
if (existingReview) {
  return res.status(400).json({ err: 'You have already reviewed this clinic' });
}
```

### Geocoding Integration

**Convert Zip Code to Coordinates:**
```javascript
const response = await fetch(
  `https://nominatim.openstreetmap.org/search?q=${zipCode}&format=json&limit=1`
);
const data = await response.json();
const { lat, lon } = data[0];
```

## Security Features

- **Password Hashing** – bcrypt with salt rounds
- **JWT Tokens** – Secure authentication with expiration
- **Environment Variables** – Sensitive data in .env
- **CORS** – Configured for frontend origin
- **Input Validation** – Mongoose schema validation
- **Protected Routes** – verify-token middleware

## Seed Data

13 verified community health clinics including:

- **FQHCs** (Federally Qualified Health Centers)
- **Planned Parenthood** locations
- **Free Clinics** (volunteer-run)
- **Community Health Centers** for immigrant populations

**All clinics:**
- ✓ Accept uninsured patients
- ✓ Offer sliding scale fees
- ✓ Provide multilingual services
- ✓ Verified addresses, phone numbers, and coordinates

## Testing the API

### Example: Search Nearby Clinics
```bash
GET http://localhost:3000/clinics/nearby?lat=37.8044&lng=-122.2711&radius=25&language=es&acceptsUninsured=true
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "searchLocation": { "lng": -122.2711, "lat": 37.8044 },
  "radius": 25,
  "data": [
    {
      "_id": "...",
      "name": "La Clínica de La Raza",
      "distance": 2.3,
      "languages": ["en", "es"],
      "acceptsUninsured": true,
      ...
    }
  ]
}
```

### Example: Create Review
```bash
POST http://localhost:3000/clinics/:clinicId/reviews
Headers: Authorization: Bearer YOUR_JWT_TOKEN
Body:
{
  "rating": 5,
  "comment": "Excellent service! Very helpful staff."
}
```

## Deployment

### MongoDB Atlas Setup
1. Create cluster at mongodb.com/cloud/atlas
2. Whitelist IP addresses
3. Create database user
4. Get connection string
5. Add to `.env` as `MONGODB_URI`

### Deploy to Render/Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy from main branch
4. Update frontend `.env` with deployed API URL

## Future Improvements

- **Rate Limiting** – Prevent API abuse
- **Caching** – Redis for frequently accessed clinics
- **Email Verification** – Confirm user emails
- **Admin Dashboard** – Manage clinics and users
- **Advanced Search** – Full-text search with Elasticsearch
- **File Upload** – Clinic images/documents (AWS S3)
- **Notifications** – Email/SMS for appointments
- **Analytics** – Track searches and popular clinics
- **API Documentation** – Swagger/OpenAPI spec

## Attributions

- **Geocoding:** Nominatim API (OpenStreetMap)
- **Clinic Data:** Verified from official FQHC and community health center websites
- **Geospatial Calculations:** Haversine formula implementation

---

**CareCompass Backend** – Powering healthcare access for all 💙