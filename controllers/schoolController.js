const db = require('../config/db');

// Add School API
const addSchool = (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude must be numbers',
      });
    }

    const sql = `
      INSERT INTO schools (name, address, latitude, longitude)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [name, address, latitude, longitude], (err, result) => {
      if (err) {
        console.error('Database error in addSchool:', err.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to add school: ' + err.message,
          error: process.env.NODE_ENV === 'development' ? err : undefined,
        });
      }

      res.status(201).json({
        success: true,
        message: 'School added successfully',
        schoolId: result.insertId,
      });
    });
  } catch (error) {
    console.error('Error in addSchool:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};

// Distance Calculation Function
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// List Schools API
const listSchools = (req, res) => {
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({
        success: false,
        message: 'Valid latitude and longitude are required',
      });
    }

    const sql = 'SELECT * FROM schools';

    db.query(sql, (err, results) => {
      if (err) {
        console.error('Database error in listSchools:', err.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch schools: ' + err.message,
          error: process.env.NODE_ENV === 'development' ? err : undefined,
        });
      }

      const sortedSchools = results
        .map((school) => {
          const distance = calculateDistance(
            userLat,
            userLon,
            school.latitude,
            school.longitude
          );

          return {
            ...school,
            distance: distance.toFixed(2) + ' km',
          };
        })
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      res.status(200).json({
        success: true,
        schools: sortedSchools,
        count: sortedSchools.length,
      });
    });
  } catch (error) {
    console.error('Error in listSchools:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};

module.exports = {
  addSchool,
  listSchools,
};
