const express = require('express');
const router = express.Router();

const { Clinic } = require('../models/clinic');
const verifyToken = require('../middleware/verify-token');

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';


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


router.get('/geocode', async (req, res) => {
  try {
    const {q} =req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({err:'Query "q" is required'});
    }

    const url= `${NOMINATIM_URL}?q=${encodeURIComponent(q.trim())}`+ `&format=json&limit=1&countrycodes=us&addressdetails=1`;

    const response= await fetch(url,{
      headers:{
        'User-Agent': 'CareCompass/1.0 (hackathon demo)',
        'Accept-Language': 'en',
      },
    });

    if (!response.ok) {
      return res.status(502).json({err:'Geocoding service error'});
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return res.json({success:true,found:false , data:null});
    }

    const top = data[0];

    return res.json({
      success: true,
      found: true,
      data: {
        lat: parseFloat(top.lat),
        lng: parseFloat(top.lon),
        displayName: top.display_name,
      },
    });
  } catch (err) {
    return res.status(500).json({err: err.message});
  }
});



router.get('/:clinicId', async (req, res)=> {
  try {
    const clinic = await Clinic.findById(req.params.clinicId)
      .populate('reviews.user', 'username')

    if (!clinic) {
      return res.status(404).json({err: 'Clinic not found'});
    }

    res.json({clinic});
  }catch (err) {
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
  }catch (err) {
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
      return res.status(404).json({err:'Clinic not found'});
    }

      res.json({message:'Clinic deleted successfully'});
  } catch (err) {
      if (err.kind ==='ObjectId') {
        return res.status(404).json({err:'Clinic not found'});
      }
      res.status(500).json({ err: err.message});
  }
});


router.get('/:clinicId/reviews', async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.clinicId)
      .select('reviews averageRating')
      .populate('reviews.user', 'username');

    if (!clinic) {
      return res.status(404).json({err:'Clinic not found'});
    }

    res.json({
      success: true,
      count: clinic.reviews.length,
      averageRating: clinic.averageRating,
      data: clinic.reviews
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({err:'Clinic not found'});
    }
    res.status(500).json({ err: err.message });
  }
});

router.post('/:clinicId/reviews',verifyToken, async(req, res)=> {
  try {
    const {rating,comment} = req.body;
    const userId = req.user._id;
    
    if (!userId) {
      return res.status(401).json({err: 'User not authenticated'});
    }
    if (!rating || rating <1 || rating >5) {
      return res.status(400).json({err:'Rating must be between 1 and 5'});
    }
    const clinic = await Clinic.findById(req.params.clinicId);

    if (!clinic) {
      return res.status(404).json({err:'Clinic not found'});
    }
    const existingReview = clinic.reviews.find(
      review => review.user.toString() ===userId.toString()
    );
    if (existingReview) {
      return res.status(400).json({err:'You have already reviewed this clinic'});
    }

    const newReview = {
      user: userId,
      rating: parseInt(rating),
      comment: comment || ''
    };
    clinic.reviews.push(newReview);

    await clinic.save();
    await clinic.populate('reviews.user','username');
    const addedReview = clinic.reviews[clinic.reviews.length - 1];

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: addedReview,
      averageRating: clinic.averageRating
    });
  } catch (err) {
    console.error('err:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({err:'Clinic not found'});
    }
    res.status(500).json({err: err.message});
  }
});

router.put('/:clinicId/reviews/:reviewId', verifyToken, async (req,res)=> {
  try {
    const {rating, comment} =req.body;
    const userId = req.user._id;
    
    if (!userId) {
      return res.status(401).json({err:'User not authenticated'});
    }

    const clinic = await Clinic.findById(req.params.clinicId);

    if (!clinic) {
      return res.status(404).json({err:'Clinic not found'});
    }
    const review = clinic.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({err:'Review not found'});
    }
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({err:'You can only edit your own reviews'});
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({err:'Rating must be between 1 and 5'});
      }
      review.rating = parseInt(rating);
    }
    if (comment !== undefined) {
      review.comment = comment;
    }

    await clinic.save();
    await clinic.populate('reviews.user', 'username');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review,
      averageRating: clinic.averageRating
    });
  } catch (err) {
    console.error('err:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({err:'Clinic or review not found'});
    }
    res.status(500).json({ err: err.message });
  }
});

router.delete('/:clinicId/reviews/:reviewId', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    
    if (!userId) {
      return res.status(401).json({err:'User not authenticated'});
    }
    const clinic = await Clinic.findById(req.params.clinicId);

    if (!clinic) {
      return res.status(404).json({err:'Clinic not found'});
    }

    const review = clinic.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({err:'Review not found'});
    }

    if (review.user.toString() !==userId.toString()) {
      return res.status(403).json({err:'You can only delete your own reviews'});
    }
    clinic.reviews.pull(req.params.reviewId);

    await clinic.save();

    res.json({
      success: true,
      message: 'Review deleted successfully',
      averageRating: clinic.averageRating
    });
  } catch (err) {
    console.error('err:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({err:'Clinic or review not found'});
    }
    res.status(500).json({ err: err.message });
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
