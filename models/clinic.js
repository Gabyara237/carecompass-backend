const mongoose = require('mongoose');

// Constants
const LANGUAGES = ['en', 'es', 'ht', 'zh', 'ar', 'vi', 'ko', 'ru', 'tl', 'fr', 'pt','hi'];

const SPECIALTIES = [
  'primary_care',
  'dental',
  'mental_health',
  'womens_health',
  'pediatrics',
  'geriatrics',
  'urgent_care',
  'vision',
  'substance_abuse',
  'chronic_disease'
];

const PAYMENT_METHODS = ['cash', 'credit', 'debit', 'check', 'payment_plan', 'medicaid', 'medicare'];

// Review Schema
const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required']
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5']
        },
        comment: {
            type: String,
            trim: true,
            maxlength: [500, 'Comment cannot exceed 500 characters']
        }
    },
    { timestamps: true }
);

// Clinic Schema
const clinicSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, 'Clinic name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters']
    },

    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },

    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        index: true
    },

    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
        uppercase: true,
        maxlength: [2, 'State must be 2 characters'],
        index: true
    },

    zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
        trim: true,
        index: true
    },

    phone: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    website: {
        type: String,
        trim: true
      
    },
    
    googleMapsUrl: {
        type: String,
        trim: true
    },
    
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], 
            required: [true, 'Coordinates are required'],
            validate: {
            validator: function ([lng, lat]) {
                if (typeof lng !== 'number' || typeof lat !== 'number') return false;

                return (
                lng >= -180 && lng <= 180 &&
                lat >= -90 && lat <= 90
                );
            },
            message: 'Coordinates must be [longitude, latitude]'
            }
        }
    },

    languages: [{
        type: String,
        lowercase: true,
        enum: LANGUAGES,
    }],

    specialties: [{
        type: String,
        lowercase: true,
        enum: SPECIALTIES,
    }],

    services: [{
        type: String,
        lowercase: true
    }],

    acceptsUninsured: {
        type: Boolean,
        default: true,
        index: true
    },

    acceptsMedicaid: {
        type: Boolean,
        default: false
    },

    acceptsMedicare: {
        type: Boolean,
        default: false
    },

    paymentMethods: [{
        type: String,
        lowercase: true,
        enum: PAYMENT_METHODS
    }],

    hasSlidingScale: {
        type: Boolean,
        default: false
    },

    costs: {
        type: String,
        trim: true
    },

    hours: {
        monday: { type: String, default: 'Closed' },
        tuesday: { type: String, default: 'Closed' },
        wednesday: { type: String, default: 'Closed' },
        thursday: { type: String, default: 'Closed' },
        friday: { type: String, default: 'Closed' },
        saturday: { type: String, default: 'Closed' },
        sunday: { type: String, default: 'Closed' }
    },

    reviews: [reviewSchema],

    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    isVerified: {
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

// Indexes
clinicSchema.index({ location: '2dsphere' });
clinicSchema.index({ city: 1, state: 1 });
clinicSchema.index({ languages: 1 });
clinicSchema.index({ specialties: 1 });
clinicSchema.index({ averageRating: -1 });

// Methods
clinicSchema.methods.calculateAverageRating = function () {
    if (!this.reviews || this.reviews.length === 0) {
        this.averageRating = 0;
        return this.averageRating;
    }

    const sum = this.reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10; 

    return this.averageRating;
};


clinicSchema.set('toJSON', { virtuals: true });
clinicSchema.set('toObject', { virtuals: true });



clinicSchema.pre('save', function () {

    if (this.isModified('reviews')) {
        this.calculateAverageRating();
    }
});

const Clinic = mongoose.model('Clinic', clinicSchema);

// Export
module.exports = {
    Clinic,
    LANGUAGES,
    SPECIALTIES,
    PAYMENT_METHODS
};
