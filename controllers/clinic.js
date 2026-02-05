const express = require('express');
const router = express.Router();

const { Clinic } = require('../models/clinic');
const verifyToken = require('../middleware/verify-token');


router.get('/', async (req, res) => {
  try {
    const {limit = 50, page = 1} = req.query;
    
    const clinics = await Clinic.find()
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-reviews')
      .lean(); 
    
    const total = await Clinic.countDocuments();
    
    res.json({
      success: true,
      count: clinics.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: clinics
    });
  } catch (err) {
    res.status(500).json({ err: err.message});
  }
});


router.get('/search', async (req, res) => {
  try {
    const {
      zipCode,
      city,
      language,
      specialty,
      acceptsUninsured,
      limit = 50,
      lng,
      lat,
      radius = 25 
    } = req.query;

    let query = {};
    

    if (lng && lat) {
      const radiusInKm = parseFloat(radius);
      const radiusInRadians = radiusInKm / 6378.1; 
      
      query.location = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)], 
            radiusInRadians
          ]
        }
      };
    }

    if (city) query.city = new RegExp(city, 'i');
    if (zipCode) query.zipCode = zipCode;
    if (language) query.languages = language.toLowerCase();
    if (specialty) query.specialties = specialty.toLowerCase();
    if (acceptsUninsured === 'true') query.acceptsUninsured = true;

    const clinics = await Clinic.find(query)
      .select('-reviews')
      .limit(parseInt(limit))
      .lean(); 

    res.json({
      success: true,
      count: clinics.length,
      filters: { city, zipCode, language, specialty, acceptsUninsured, lng, lat, radius },
      data: clinics
    });
  } catch (err) {
    res.status(500).json({err: err.message});
  }
});


router.get('/nearby', async (req, res)=> {
  try {
    const {
      lng,
      lat,
      radius = 25, 
      language,
      specialty,
      acceptsUninsured,
      limit = 50
    } = req.query;


    if (!lng || !lat) {
      return res.status(400).json({ 
        err: 'Longitude and latitude are required' 
      });
    }


    let query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(radius) * 1000 
        }
      }
    };


    if (language) query.languages = language.toLowerCase();
    if (specialty) query.specialties = specialty.toLowerCase();
    if (acceptsUninsured === 'true') query.acceptsUninsured = true;

    const clinics = await Clinic.find(query)
      .select('-reviews')
      .limit(parseInt(limit))
      .lean();

    const clinicsWithDistance = clinics.map(clinic => {
      const [clinicLng, clinicLat] = clinic.location.coordinates;
      const distance = calculateDistance(
        parseFloat(lat), 
        parseFloat(lng), 
        clinicLat, 
        clinicLng
      );
      
      return {
        ...clinic,
        distance: parseFloat(distance.toFixed(2)) 
      };
    });

    res.json({
      success: true,
      count: clinicsWithDistance.length,
      searchLocation: { lng: parseFloat(lng), lat: parseFloat(lat) },
      radius: parseFloat(radius),
      data: clinicsWithDistance
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


router.get('/:clinicId', async (req, res)=> {
    try {
        const clinic = await Clinic.findById(req.params.clinicId)
        .populate('reviews.user', 'firstName lastName')

        if (!clinic) {
          return res.status(404).json({err: 'Clinic not found'});
        }

        res.json({clinic});
    } catch (err) {
        if (err.kind === 'ObjectId') {
          return res.status(404).json({err: 'Clinic not found'});
        }
        res.status(500).json({ err: err.message});
    }
});


router.post('/', verifyToken, async(req, res) => {

    try {
        const clinic = await Clinic.create(req.body);
        
        res.status(201).json(clinic);
    } catch (err) {
      res.status(500).json({err: err.message})

    }
});



router.put('/:clinicId', verifyToken, async (req, res) => {
    try {
        
        const clinic = await Clinic.findById(req.params.clinicId);

        if (!clinic) {
          return res.status(404).json({err: 'Clinic not found'});
        }
        
        Object.keys(req.body).forEach(key => {
          clinic[key] = req.body[key];
        });
    
        await clinic.save();

        res.json({ clinic });
    } catch (err) {
        if (err.name === 'ValidationError') {
          const messages = Object.values(err.errors).map(error => error.message);
          return res.status(400).json({err: messages.join(', ')});
        }
        if (err.kind === 'ObjectId') {
          return res.status(404).json({err: 'Clinic not found' });
        }
        res.status(500).json({ err: err.message});
    }
});


router.delete('/:clinicId', verifyToken, async (req, res) => {
    try {
        const clinic = await Clinic.findByIdAndDelete(req.params.clinicId);

        if (!clinic) {
          return res.status(404).json({err: 'Clinic not found'});
        }

        res.json({ message: 'Clinic deleted successfully'});
    } catch (err) {
        if (err.kind === 'ObjectId') {
          return res.status(404).json({err: 'Clinic not found'});
        }
        res.status(500).json({ err: err.message});
    }
});


function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = 
        Math.sin(dLat /2) * Math.sin(dLat /2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon /2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
}

function toRad(degrees) {
    return degrees * (Math.PI /180);
}

module.exports = router;
