# 🏫 School Management API

A Node.js REST API with an interactive web UI for managing school data and finding schools based on geographical proximity.

## Features

✨ **Add Schools**: Add new schools with their coordinates  
📍 **Find Nearby Schools**: Discover schools sorted by distance from your location  
🗺️ **Geolocation Support**: Automatically fetch your location using browser geolocation  
🎨 **Interactive UI**: Beautiful, responsive web interface  
📱 **Mobile Friendly**: Fully responsive design for all devices  

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Additional**: CORS, dotenv

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server running
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/sm6592624/School-Management-Api.git
cd school-management-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Database

Create a MySQL database and table:

```sql
CREATE DATABASE school_management;

USE school_management;

CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
```

### 5. Run the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The application will start at `http://localhost:5000`

## API Endpoints

### Add School

**Endpoint**: `POST /addSchool`

**Description**: Add a new school to the database

**Request Body**:
```json
{
  "name": "ABC High School",
  "address": "123 Main Street, New York",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "message": "School added successfully",
  "schoolId": 1
}
```

**Response** (Error - 400):
```json
{
  "success": false,
  "message": "All fields are required"
}
```

---

### List Schools

**Endpoint**: `GET /listSchools?latitude=<lat>&longitude=<lon>`

**Description**: Get all schools sorted by distance from the user's location

**Query Parameters**:
- `latitude` (required): User's latitude (float)
- `longitude` (required): User's longitude (float)

**Example Request**:
```
GET /listSchools?latitude=40.7128&longitude=-74.0060
```

**Response** (Success - 200):
```json
{
  "success": true,
  "schools": [
    {
      "id": 1,
      "name": "ABC High School",
      "address": "123 Main Street, New York",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "distance": "0.00 km"
    },
    {
      "id": 2,
      "name": "XYZ College",
      "address": "456 Park Avenue, New York",
      "latitude": 40.7580,
      "longitude": -73.9855,
      "distance": "6.54 km"
    }
  ]
}
```

**Response** (Error - 400):
```json
{
  "success": false,
  "message": "Valid latitude and longitude are required"
}
```

## Using the Web UI

### 1. Adding a School

1. Navigate to `http://localhost:5000`
2. Fill in the school details in the "Add New School" form:
   - School Name
   - Address
   - Latitude
   - Longitude
3. Click "Add School" button
4. You'll see a success message once added

### 2. Finding Schools

1. Enter your location coordinates:
   - Your Latitude
   - Your Longitude
2. Click "Find Schools" button
3. Or click "📍 Use My Location" to auto-detect your location
4. View the list of schools sorted by distance

## Project Structure

```
school-management-api/
├── public/
│   ├── index.html          # Main UI
│   ├── styles.css          # Styling
│   └── script.js           # Frontend logic
├── config/
│   └── db.js              # Database connection
├── controllers/
│   └── schoolController.js # API logic
├── routes/
│   └── schoolRoutes.js    # Route definitions
├── server.js              # Express server
├── package.json           # Dependencies
├── .env                   # Environment variables
├── .env.example           # Example environment file
└── .gitignore            # Git ignore rules
```

## Validation Rules

### Add School API

- **name**: Required, non-empty string
- **address**: Required, non-empty string
- **latitude**: Required, valid number (float)
- **longitude**: Required, valid number (float)

### List Schools API

- **latitude**: Required, valid number (float)
- **longitude**: Required, valid number (float)

## Distance Calculation

The API uses the Haversine formula to calculate the geographical distance between the user's location and each school:

```
Distance = 2 * R * arcsin(√(sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)))
```

Where R = Earth's radius ≈ 6371 km

## Testing with Postman

1. Import the Postman collection file (`School-Management-Api.postman_collection.json`)
2. Set the environment variable for `base_url` to `http://localhost:5000`
3. Test the endpoints using the pre-configured requests

## Error Handling

All API endpoints include comprehensive error handling:

- **400 Bad Request**: Invalid or missing parameters
- **500 Internal Server Error**: Database connection issues

Error responses include a `success: false` flag and descriptive `message` field.

## Features Implemented

✅ Database design with proper schema  
✅ Add School API with input validation  
✅ List Schools API with distance calculation  
✅ Sorting by geographical distance  
✅ Interactive web UI  
✅ Responsive design  
✅ Geolocation support  
✅ Error handling and validation  
✅ Postman collection for API testing  
✅ Environment variable configuration  
✅ CORS enabled for cross-origin requests  

## Future Enhancements

- 🔐 Authentication and authorization
- 🔍 School search by name
- ⭐ Rating and review system
- 📊 Analytics dashboard
- 🗺️ Map visualization
- 📧 Email notifications
- 🎓 Student management
- 👨‍🏫 Teacher management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue on the GitHub repository.

## Author

**SM** - [GitHub Profile](https://github.com/sm6592624)

---

**Happy coding! 🚀**
