const mongoose = require('mongoose');
const { Clinic } = require('../models/clinic');
require('dotenv').config();


const clinics = [

  {
    name: "La Clinica de La Raza, Fruitvale Village",
    address: "3451 E 12th St",
    city: "Oakland",
    state: "CA",
    zipCode: "94601",
    phone: "+15105353500",
    email: "info@laclinica.org",
    website: "http://www.laclinica.org/la-clinica-fruitvale-village/",
    googleMapsUrl: "https://maps.app.goo.gl/N2u9KYCWMK6dmz2G9",
    location: {
      type: "Point",
      coordinates: [-122.22357075793308, 37.775646324054556]
    },
    languages: ["en", "es"],
    specialties: ["primary_care", "dental", "mental_health", "womens_health", "pediatrics"],
    services: ["vaccinations", "lab_tests", "prescriptions", "prenatal_care", "chronic_disease", "family_planning"],
    acceptsUninsured: true,
    acceptsMedicaid: true,
    acceptsMedicare: true,
    paymentMethods: ["cash", "credit", "payment_plan", "medicaid", "medicare"],
    hasSlidingScale: true,
    costs: "$0-$75 based on income, no one turned away",
    hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 8:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "8:00 AM - 12:00 PM",
      sunday: "Closed"
    },
    isVerified: true
  },

  {
    name: "Native American Health Center - Oakland",
    address: "3050 International Blvd",
    city: "Oakland",
    state: "CA",
    zipCode: "94601",
    phone: "+15105354400",
    email: "info@nativehealth.org",
    website: "https://www.nativehealth.org/",
    googleMapsUrl: "https://maps.app.goo.gl/GFFhzx6T45yvFVBD8",
    location: {
      type: "Point",
      coordinates: [-122.22692014259134, 37.77874591818791]
    },
    languages: ["en", "es", "vi"],
    specialties: ["primary_care", "dental", "mental_health", "substance_abuse"],
    services: ["behavioral_health", "chronic_disease", "dental", "cultural_support", "care_coordination"],
    acceptsUninsured: true,
    acceptsMedicaid: true,
    acceptsMedicare: true,
    paymentMethods: ["cash", "credit", "medicaid", "medicare", "payment_plan"],
    hasSlidingScale: true,
    costs: "Sliding scale available, serves all regardless of ability to pay",
    hours: {
      monday: "8:30 AM - 5:00 PM",
      tuesday: "8:30 AM - 5:00 PM",
      wednesday: "8:30 AM - 5:00 PM",
      thursday: "8:30 AM - 5:00 PM",
      friday: "8:30 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    isVerified: true
  },

  {
    name: "Tiburcio Vasquez Health Center - Union City",
    address: "33255 9th St, Union City",
    city: "Union City",
    state: "CA",
    zipCode: "94587",
    phone: "+15104715880",
    email: "info@tvhc.org",
    website: "http://www.tvhc.org/",
    googleMapsUrl: "https://maps.app.goo.gl/vGUwCr2GrYc8BCAE9",
    location: {
      type: "Point",
      coordinates: [-122.02373942651953, 37.608745381049204]
    },
    languages: ["en", "es"],
    specialties: ["primary_care", "womens_health", "pediatrics", "dental"],
    services: ["prenatal_care", "family_planning", "immunizations", "diabetes_management", "lab_tests"],
    acceptsUninsured: true,
    acceptsMedicaid: true,
    acceptsMedicare: false,
    paymentMethods: ["cash", "credit", "medicaid", "payment_plan"],
    hasSlidingScale: true,
    costs: "$0-$50 based on income",
    hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 7:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    isVerified: true
  },

  {
    name: "Asian Health Services",
    address: "818 Webster St",
    city: "Oakland",
    state: "CA",
    zipCode: "94607",
    phone: "+15109866800",
    email: "info@ahschc.org",
    website: "https://asianhealthservices.org/chenming-margaret-hu-medical-center/",
    googleMapsUrl: "https://maps.app.goo.gl/K1Zxo57ofXWyiqnw6",
    location: {
      type: "Point",
      coordinates: [-122.26427307888534, 37.82266304928784]
    },
    languages: ["en", "zh", "vi", "ko", "tl"],
    specialties: ["primary_care", "dental", "mental_health"],
    services: ["acupuncture", "health_education", "language_interpretation", "senior_services"],
    acceptsUninsured: true,
    acceptsMedicaid: true,
    acceptsMedicare: true,
    paymentMethods: ["cash", "credit", "medicaid", "medicare", "payment_plan"],
    hasSlidingScale: true,
    costs: "$10-$75 based on income",
    hours: {
      monday: "8:30 AM - 5:00 PM",
      tuesday: "8:30 AM - 7:00 PM",
      wednesday: "8:30 AM - 5:00 PM",
      thursday: "8:30 AM - 7:00 PM",
      friday: "8:30 AM - 5:00 PM",
      saturday: "8:30 AM - 12:30 PM",
      sunday: "Closed"
    },
    isVerified: true
  },

  {
    name: "Lifelong Medical Care",
    address: "9933 MacArthur Blvd",
    city: "San Leandro",
    state: "CA",
    zipCode: "94605",
    phone: "+15109814100",
    email: "info@lifelongmedical.org",
    website: "https://lifelongmedical.org/",
    googleMapsUrl: "https://maps.app.goo.gl/u6tdrTGPAKy6huBU7",
    location: {
      type: "Point",
      coordinates: [-122.1506467075712, 37.755341032279546]
    },
    languages: ["en", "es", "zh"],
    specialties: ["primary_care", "womens_health", "mental_health"],
    services: ["hiv_care", "prenatal_care", "behavioral_health", "care_coordination"],
    acceptsUninsured: true,
    acceptsMedicaid: true,
    acceptsMedicare: true,
    paymentMethods: ["cash", "credit", "medicaid", "medicare", "payment_plan"],
    hasSlidingScale: true,
    costs: "$25-$100 based on income",
    hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    isVerified: true
  },

  {
    name: "RotaCare Bay Area Free Clinic",
    address: "2210 Gladstone Dr",
    city: "Pittsburg",
    state: "CA",
    zipCode: "94565",
    phone: "+19254392009",
    email: "info@rotacarebayarea.org",
    website: "http://www.rotacarebayarea.org/clinics/pittsburg.html",
    googleMapsUrl: "https://maps.app.goo.gl/sEBYLZUfoNEUgur66",
    location: {
      type: "Point",
      coordinates: [-121.86878304899922, 38.05378295819321]
    },
    languages: ["en", "es"],
    specialties: ["primary_care"],
    services: ["basic_medical", "health_screenings", "referrals"],
    acceptsUninsured: true,
    acceptsMedicaid: false,
    acceptsMedicare: false,
    paymentMethods: ["cash"],
    hasSlidingScale: false,
    costs: "Free - all services provided at no cost",
    hours: {
      monday: "Closed",
      tuesday: "Closed",
      wednesday: "6:00 PM - 9:00 PM",
      thursday: "Closed",
      friday: "Closed",
      saturday: "9:00 AM - 12:00 PM",
      sunday: "Closed"
    },
    isVerified: true
  },

  {
    name: "Over 60 Health Center",
    address: "3260 Sacramento St",
    city: "Berkeley",
    state: "CA",
    zipCode: "94704",
    phone: "+15109814100",
    email: "info@over60health.org",
    website: "https://www.lifelongmedical.org/locations/over-60-health-center",
    googleMapsUrl: "https://maps.app.goo.gl/r6YKqJYWeCB3AQBq7",
    location: {
      type: "Point",
      coordinates: [-122.27809116079449, 37.84821250684659]
    },
    languages: ["en", "es", "zh"],
    specialties: ["primary_care", "geriatrics"],
    services: ["chronic_disease", "medicare_enrollment", "social_services"],
    acceptsUninsured: true,
    acceptsMedicaid: true,
    acceptsMedicare: true,
    paymentMethods: ["cash", "credit", "medicaid", "medicare"],
    hasSlidingScale: true,
    costs: "Sliding scale for seniors 60+",
    hours: {
      monday: "8:30 AM - 4:30 PM",
      tuesday: "8:30 AM - 4:30 PM",
      wednesday: "8:30 AM - 4:30 PM",
      thursday: "8:30 AM - 4:30 PM",
      friday: "8:30 AM - 4:30 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    isVerified: true
  },

  {
    name: "Mission Neighborhood Health Center",
    address: "240 Shotwell St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94110",
    phone: "+14155523870",
    email: "info@mnhc.org",
    website: "https://www.mnhc.org",
    googleMapsUrl: "https://maps.app.goo.gl/3TthwiiMETb1XLJT9",
    location: {
      type: "Point",
      coordinates: [-122.41640289943064, 37.764820309281]
    },
    languages: ["en", "es"],
    specialties: ["primary_care", "womens_health", "pediatrics", "dental"],
    services: ["prenatal_care", "health_education", "chronic_disease", "immigration_medical_exams"],
    acceptsUninsured: true,
    acceptsMedicaid: true,
    acceptsMedicare: true,
    paymentMethods: ["cash", "credit", "medicaid", "medicare", "payment_plan"],
    hasSlidingScale: true,
    costs: "$0-$100 based on income, no one turned away",
    hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 7:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "8:00 AM - 12:00 PM",
      sunday: "Closed"
    },
    isVerified: true
  },

  {
    name: "North East Medical Services (NEMS)",
    address: "1520 Stockton St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94133",
    phone: "+18885001886",
    email: "info@nems.org",
    website: "https://www.nems.org",
    googleMapsUrl: "https://maps.app.goo.gl/a2u2K93KyDZqQ8u67",
    location: {
      type: "Point",
      coordinates: [-122.40899485728363, 37.831951212299856]
    },
    languages: ["en", "zh"],
    specialties: ["primary_care", "dental", "mental_health"],
    services: ["traditional_chinese_medicine", "senior_services", "language_interpretation"],
    acceptsUninsured: true,
    acceptsMedicaid: true,
    acceptsMedicare: true,
    paymentMethods: ["cash", "credit", "medicaid", "medicare"],
    hasSlidingScale: true,
    costs: "$15-$85 based on income",
    hours: {
      monday: "8:30 AM - 5:00 PM",
      tuesday: "8:30 AM - 5:00 PM",
      wednesday: "8:30 AM - 5:00 PM",
      thursday: "8:30 AM - 6:00 PM",
      friday: "8:30 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    isVerified: true
  },

  {
    name: "Tom Waddell Urban Health Clinic",
    address: "230 Golden Gate Ave",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    phone: "(415) 554-2830",
    email: "info@sfdph.org",
    website: "http://www.sf.gov/location/tom-waddell-urban-health-clinic",
    googleMapsUrl: "+14153557500",
    location: {
      type: "Point",
      coordinates: [-122.41445006079688, 37.782391799915516]
    },
    languages: ["en", "es", "zh", "tl", "vi"],
    specialties: ["primary_care", "womens_health", "mental_health"],
    services: ["hiv_testing", "lgbtq_services", "transgender_care", "substance_abuse_treatment"],
    acceptsUninsured: true,
    acceptsMedicaid: true,
    acceptsMedicare: true,
    paymentMethods: ["cash", "credit", "medicaid", "medicare", "payment_plan"],
    hasSlidingScale: true,
    costs: "Sliding scale, serves all SF residents regardless of immigration status",
    hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    isVerified: true
  },

  {
    name: "Planned Parenthood - El Cerrito Health Center",
    address: "280 El Cerrito Plaza",
    city: "El Cerrito",
    state: "CA",
    zipCode: "94530",
    phone: "+15105275806",
    email: "info@ppmar.org",
    website: "https://www.plannedparenthood.org/health-center/california/el-cerrito/94530/el-cerrito-health-center-3940-90200",
    googleMapsUrl: "https://maps.app.goo.gl/p4jkpYz9AsjXunvp9",
    location: {
      type: "Point",
      coordinates: [-122.29830808778026, 37.89951629233911]
    },
    languages: ["en", "es"],
    specialties: ["womens_health", "primary_care"],
    services: ["birth_control", "std_testing", "pregnancy_testing", "abortion_services", "cancer_screenings", "hormone_therapy"],
    acceptsUninsured: true,
    acceptsMedicaid: true,
    acceptsMedicare: false,
    paymentMethods: ["cash", "credit", "debit", "medicaid", "payment_plan"],
    hasSlidingScale: true,
    costs: "$0-$150 based on income, no one turned away",
    hours: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "11:00 AM - 7:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "8:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    isVerified: true
  },

  {
    name: "Planned Parenthood - San Francisco Health Center",
    address: "1522 Bush St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94109",
    phone: "(415) 821-1282",
    email: "info@ppmar.org",
    website: "https://www.plannedparenthood.org/health-center/california/san-francisco/94109/san-francisco-health-center-3997-90200?utm_campaign=san-francisco-health-center&utm_medium=organic&utm_source=local-listing",
    googleMapsUrl: "https://maps.app.goo.gl/J9anuU88UgiqPsGD6",
    location: {
      type: "Point",
      coordinates: [-122.42265743196127, 37.78874304688553]
    },
    languages: ["en", "es", "zh"],
    specialties: ["womens_health", "primary_care"],
    services: ["birth_control", "std_testing", "abortion_services", "vasectomy", "gender_affirming_care", "prep_hiv_prevention"],
    acceptsUninsured: true,
    acceptsMedicaid: true,
    acceptsMedicare: false,
    paymentMethods: ["cash", "credit", "debit", "medicaid", "payment_plan"],
    hasSlidingScale: true,
    costs: "Sliding scale, financial assistance available",
    hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "8:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    isVerified: true
  },

  {
    name: "Planned Parenthood - Oakland Health Center",
    address: "1400 Broadway",
    city: "Oakland",
    state: "CA",
    zipCode: "94612",
    phone: "(510) 834-7710",
    email: "info@ppmar.org",
    website: "https://www.plannedparenthood.org/health-center/california/oakland/94612/oakland-health-center-21934-90130?utm_campaign=oakland-health-center&utm_medium=organic&utm_source=local-listing",
    googleMapsUrl: "https://maps.app.goo.gl/ic2oRUpQpNmngxtC7",
    location: {
      type: "Point",
      coordinates: [-122.2709638319607, 37.80464637972479]
    },
    languages: ["en", "es", "zh", "vi"],
    specialties: ["womens_health", "primary_care"],
    services: ["birth_control", "std_testing", "abortion_services", "emergency_contraception", "pregnancy_testing", "hiv_testing"],
    acceptsUninsured: true,
    acceptsMedicaid: true,
    acceptsMedicare: false,
    paymentMethods: ["cash", "credit", "debit", "medicaid", "payment_plan"],
    hasSlidingScale: true,
    costs: "$0-$150 based on income",
    hours: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "11:00 AM - 7:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "8:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    isVerified: true
  },
];


const seedClinics = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const deleteResult = await Clinic.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing clinics`);

    const insertedClinics = await Clinic.insertMany(clinics);
    console.log(`Successfully seeded ${insertedClinics.length} clinics`);

    console.log('\nSEED SUMMARY:');
    console.log(`\nTotal clinics: ${insertedClinics.length}`);
    console.log(`\nAll accept uninsured: ${insertedClinics.filter(c => c.acceptsUninsured).length}`);
    console.log(`\nWith sliding scale: ${insertedClinics.filter(c => c.hasSlidingScale).length}`);
    console.log(`\nFree clinics: ${insertedClinics.filter(c => c.costs.toLowerCase().includes('free')).length}`);
    
    console.log('\nLANGUAGES SUPPORTED:');
    const allLanguages = new Set();
    insertedClinics.forEach(c => c.languages.forEach(l => allLanguages.add(l)));
    console.log(`${Array.from(allLanguages).join(', ')}`);

    console.log('\n CITIES:');
    const cities = {};
    insertedClinics.forEach(c => {
      cities[c.city] = (cities[c.city] || 0) + 1;
    });
    Object.entries(cities).forEach(([city, count]) => {
      console.log(`${city}: ${count} clinics`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding clinics:', error);
    process.exit(1);
  }
};

seedClinics();