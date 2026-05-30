const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initial Mock Data Seed
const initialData = {
  users: [
    {
      id: "usr_admin",
      username: "admin",
      email: "admin@directory.com",
      password: "$2a$10$ZVeaItvki389n4ft2j/WjeMKWEn17H.YYkR/qhJjjoeY064TPLO0O", // Password: admin123
      role: "admin",
      createdAt: new Date().toISOString()
    },
    {
      id: "usr_owner1",
      username: "john_cafe",
      email: "john@vintagebrew.com",
      password: "$2a$10$ZVeaItvki389n4ft2j/WjeMKWEn17H.YYkR/qhJjjoeY064TPLO0O", // Password: admin123
      role: "owner",
      createdAt: new Date().toISOString()
    },
    {
      id: "usr_user1",
      username: "alice_explorer",
      email: "alice@explorer.com",
      password: "$2a$10$ZVeaItvki389n4ft2j/WjeMKWEn17H.YYkR/qhJjjoeY064TPLO0O", // Password: admin123
      role: "user",
      createdAt: new Date().toISOString()
    }
  ],
  businesses: [
    {
      id: "biz_1",
      ownerId: "usr_owner1",
      name: "The Filter Coffee Club",
      category: "restaurants",
      description: "Traditional South Indian filter coffee coupled with gourmet artisanal dosas, freshly steamed idlis, and a modern fusion environment.",
      address: "100 Feet Rd, HAL 2nd Stage, Indiranagar",
      city: "Bangalore",
      coordinates: { lat: 12.9716, lng: 77.6412 },
      phone: "+91 80 5550 1980",
      email: "info@filtercoffeeclub.in",
      website: "https://filtercoffeeclub.in",
      hours: {
        monday: "06:30 AM - 10:00 PM",
        tuesday: "06:30 AM - 10:00 PM",
        wednesday: "06:30 AM - 10:00 PM",
        thursday: "06:30 AM - 10:00 PM",
        friday: "06:30 AM - 11:00 PM",
        saturday: "06:30 AM - 11:00 PM",
        sunday: "06:30 AM - 10:00 PM"
      },
      services: ["Filter Coffee", "Free Wi-Fi", "Outdoor Seating", "Traditional Ghee Roast", "Vegan Options"],
      isVerified: true,
      rating: 4.8,
      reviewCount: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: "biz_2",
      ownerId: "usr_owner1",
      name: "Jasmine & Sandalwood Luxury Spa",
      category: "salons",
      description: "Premium hair styling, traditional Ayurvedic massage treatments, organic sandalwood facials, and luxury bridal makeovers.",
      address: "789 Glow Lane, Koramangala 4th Block",
      city: "Bangalore",
      coordinates: { lat: 12.9352, lng: 77.6245 },
      phone: "+91 80 5550 2450",
      email: "appointments@jasminesandal.in",
      website: "https://jasminesandal.in",
      hours: {
        monday: "Closed",
        tuesday: "09:00 AM - 08:00 PM",
        wednesday: "09:00 AM - 08:00 PM",
        thursday: "09:00 AM - 08:00 PM",
        friday: "09:00 AM - 09:00 PM",
        saturday: "09:00 AM - 09:00 PM",
        sunday: "10:00 AM - 06:00 PM"
      },
      services: ["Bridal Makeover", "Sandalwood Facial", "Ayurvedic Massage", "Hair Styling", "Pedicure"],
      isVerified: true,
      rating: 4.5,
      reviewCount: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: "biz_3",
      ownerId: "usr_owner1",
      name: "Apollo First Medical Clinic",
      category: "healthcare",
      description: "Comprehensive family medical clinic offering rapid out-patient consulting, pediatric care, vaccination drives, and telemedicine.",
      address: "456 Care Crest Rd, HSR Layout Sector 3",
      city: "Bangalore",
      coordinates: { lat: 12.9101, lng: 77.6420 },
      phone: "+91 80 5550 3770",
      email: "care@apollofirst.in",
      website: "https://apollofirst.in",
      hours: {
        monday: "08:00 AM - 08:00 PM",
        tuesday: "08:00 AM - 08:00 PM",
        wednesday: "08:00 AM - 08:00 PM",
        thursday: "08:00 AM - 08:00 PM",
        friday: "08:00 AM - 08:00 PM",
        saturday: "08:00 AM - 02:00 PM",
        sunday: "Closed"
      },
      services: ["General Consultation", "Pediatrics", "Vaccinations", "Health Checkups", "Emergency Care"],
      isVerified: true,
      rating: 4.2,
      reviewCount: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: "biz_4",
      ownerId: "usr_owner1",
      name: "Blossom Book House & Study Hub",
      category: "retail",
      description: "An iconic bookstore combined with quiet reading nooks, specialty tea counter, and community literary clubs.",
      address: "Church Street, Opp. Metro Station",
      city: "Bangalore",
      coordinates: { lat: 12.9750, lng: 77.6010 },
      phone: "+91 80 5550 4510",
      email: "hello@blossoms.in",
      hours: {
        monday: "09:00 AM - 09:00 PM",
        tuesday: "09:00 AM - 09:00 PM",
        wednesday: "09:00 AM - 09:00 PM",
        thursday: "09:00 AM - 09:00 PM",
        friday: "09:00 AM - 10:00 PM",
        saturday: "09:00 AM - 10:00 PM",
        sunday: "10:00 AM - 08:00 PM"
      },
      services: ["New & Rare Books", "Reading Lounge", "Book Exchange", "Home Delivery"],
      isVerified: false, // Needs admin verification
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    },
    {
      id: "biz_5",
      ownerId: "usr_owner1",
      name: "The Collection, UB City",
      category: "retail",
      description: "Located in the Central Business District (CBD) on Vittal Mallya Road, this is Bangalore’s premier luxury mall housing high-end international brands like Louis Vuitton and Burberry.",
      address: "Vittal Mallya Road, CBD",
      city: "Bangalore",
      coordinates: { lat: 12.9716, lng: 77.5958 },
      phone: "+91 80 2219 9000",
      email: "info@ubcitycollection.in",
      website: "https://ubcitycollection.in",
      hours: {
        monday: "11:00 AM - 10:00 PM",
        tuesday: "11:00 AM - 10:00 PM",
        wednesday: "11:00 AM - 10:00 PM",
        thursday: "11:00 AM - 10:00 PM",
        friday: "11:00 AM - 10:00 PM",
        saturday: "11:00 AM - 10:00 PM",
        sunday: "11:00 AM - 10:00 PM"
      },
      services: ["High-End Fashion", "Luxury Brands", "Gourmet Dining", "Valet Parking", "Art Gallery"],
      isVerified: true,
      rating: 4.6,
      reviewCount: 840,
      createdAt: new Date().toISOString()
    },
    {
      id: "biz_6",
      ownerId: "usr_owner1",
      name: "The Bangalore Education Society",
      category: "education",
      description: "Educational institution providing comprehensive learning programs, quality academic coaching, and student development.",
      address: "4th Main, 8th Cross Rd, Malleshwaram",
      city: "Bangalore",
      coordinates: { lat: 12.9960, lng: 77.5712 },
      phone: "080 2331 1770",
      email: "contact@bangaloreeducation.in",
      website: "https://bangaloreeducation.in",
      hours: {
        monday: "08:30 AM - 04:30 PM",
        tuesday: "08:30 AM - 04:30 PM",
        wednesday: "08:30 AM - 04:30 PM",
        thursday: "08:30 AM - 04:30 PM",
        friday: "08:30 AM - 04:30 PM",
        saturday: "08:30 AM - 01:00 PM",
        sunday: "Closed"
      },
      services: ["Primary School", "Secondary School", "Library Access", "Science Labs", "Sports Ground"],
      isVerified: true,
      rating: 4.3,
      reviewCount: 152,
      createdAt: new Date().toISOString()
    },
    {
      id: "biz_7",
      ownerId: "usr_owner1",
      name: "Toit Brewpub",
      category: "restaurants",
      description: "Bangalore's most loved craft brewery and gastropub serving freshly brewed ales, wood-fired pizzas, and gourmet burgers in a lively industrial-chic setting.",
      address: "298, 100 Feet Rd, Indiranagar",
      city: "Bangalore",
      coordinates: { lat: 12.9784, lng: 77.6408 },
      phone: "+91 80 4091 2627",
      email: "hello@toit.in",
      website: "https://toit.in",
      hours: {
        monday: "12:00 PM - 11:30 PM",
        tuesday: "12:00 PM - 11:30 PM",
        wednesday: "12:00 PM - 11:30 PM",
        thursday: "12:00 PM - 11:30 PM",
        friday: "12:00 PM - 12:00 AM",
        saturday: "12:00 PM - 12:00 AM",
        sunday: "12:00 PM - 11:30 PM"
      },
      services: ["Craft Beer", "Wood-Fired Pizza", "Live Music", "Outdoor Terrace", "Private Events"],
      isVerified: true,
      rating: 4.7,
      reviewCount: 2340,
      createdAt: new Date().toISOString()
    },
    {
      id: "biz_8",
      ownerId: "usr_owner1",
      name: "Cult.fit Koramangala",
      category: "fitness",
      description: "Premium fitness center offering high-intensity group workouts, yoga, Zumba, strength training, and personal coaching with state-of-the-art equipment.",
      address: "17, 5th Block, Koramangala",
      city: "Bangalore",
      coordinates: { lat: 12.9352, lng: 77.6229 },
      phone: "+91 99001 99001",
      email: "support@cult.fit",
      website: "https://cult.fit",
      hours: {
        monday: "05:30 AM - 10:00 PM",
        tuesday: "05:30 AM - 10:00 PM",
        wednesday: "05:30 AM - 10:00 PM",
        thursday: "05:30 AM - 10:00 PM",
        friday: "05:30 AM - 10:00 PM",
        saturday: "06:00 AM - 08:00 PM",
        sunday: "06:00 AM - 08:00 PM"
      },
      services: ["HIIT Classes", "Yoga", "Zumba", "Personal Training", "Nutrition Coaching"],
      isVerified: true,
      rating: 4.5,
      reviewCount: 876,
      createdAt: new Date().toISOString()
    },
    {
      id: "biz_9",
      ownerId: "usr_owner1",
      name: "Namdhari's Fresh Supermarket",
      category: "retail",
      description: "Bangalore's trusted organic grocery chain offering farm-fresh produce, exotic vegetables, dairy, bakery items, and imported gourmet foods.",
      address: "80 Feet Rd, Koramangala 4th Block",
      city: "Bangalore",
      coordinates: { lat: 12.9340, lng: 77.6270 },
      phone: "+91 80 4112 5555",
      email: "care@namdharis.com",
      website: "https://namdharis.com",
      hours: {
        monday: "07:00 AM - 09:30 PM",
        tuesday: "07:00 AM - 09:30 PM",
        wednesday: "07:00 AM - 09:30 PM",
        thursday: "07:00 AM - 09:30 PM",
        friday: "07:00 AM - 09:30 PM",
        saturday: "07:00 AM - 09:30 PM",
        sunday: "07:00 AM - 09:30 PM"
      },
      services: ["Organic Produce", "Home Delivery", "Bakery", "Dairy Products", "Imported Foods"],
      isVerified: true,
      rating: 4.4,
      reviewCount: 512,
      createdAt: new Date().toISOString()
    },
    {
      id: "biz_10",
      ownerId: "usr_owner1",
      name: "Manipal Hospital Whitefield",
      category: "healthcare",
      description: "Multi-specialty tertiary care hospital with advanced diagnostics, 24/7 emergency services, oncology, cardiology, and robotic surgery facilities.",
      address: "143, ITPL Main Rd, Whitefield",
      city: "Bangalore",
      coordinates: { lat: 12.9698, lng: 77.7499 },
      phone: "+91 80 2502 4444",
      email: "info@manipalhospitals.com",
      website: "https://manipalhospitals.com",
      hours: {
        monday: "24 Hours",
        tuesday: "24 Hours",
        wednesday: "24 Hours",
        thursday: "24 Hours",
        friday: "24 Hours",
        saturday: "24 Hours",
        sunday: "24 Hours"
      },
      services: ["Emergency Care", "Cardiology", "Oncology", "Robotic Surgery", "Diagnostics"],
      isVerified: true,
      rating: 4.6,
      reviewCount: 1890,
      createdAt: new Date().toISOString()
    },
    {
      id: "biz_11",
      ownerId: "usr_owner1",
      name: "Leela Palace Spa & Wellness",
      category: "salons",
      description: "Award-winning luxury spa at The Leela Palace offering signature Ayurvedic therapies, hot stone massages, aromatherapy, and exclusive couple retreat packages.",
      address: "23, Old Airport Rd, HAL",
      city: "Bangalore",
      coordinates: { lat: 12.9592, lng: 77.6484 },
      phone: "+91 80 2521 1234",
      email: "spa@theleela.com",
      website: "https://theleela.com",
      hours: {
        monday: "09:00 AM - 09:00 PM",
        tuesday: "09:00 AM - 09:00 PM",
        wednesday: "09:00 AM - 09:00 PM",
        thursday: "09:00 AM - 09:00 PM",
        friday: "09:00 AM - 10:00 PM",
        saturday: "09:00 AM - 10:00 PM",
        sunday: "09:00 AM - 09:00 PM"
      },
      services: ["Ayurvedic Therapy", "Hot Stone Massage", "Aromatherapy", "Couple Retreat", "Facial Treatments"],
      isVerified: true,
      rating: 4.9,
      reviewCount: 634,
      createdAt: new Date().toISOString()
    },
    {
      id: "biz_12",
      ownerId: "usr_owner1",
      name: "BYJU'S Learning Centre",
      category: "education",
      description: "India's leading ed-tech brand offering personalized coaching for K-12, JEE, NEET, and competitive exams with adaptive learning technology and expert tutors.",
      address: "Think & Learn Campus, JP Nagar",
      city: "Bangalore",
      coordinates: { lat: 12.9063, lng: 77.5857 },
      phone: "+91 88851 33333",
      email: "support@byjus.com",
      website: "https://byjus.com",
      hours: {
        monday: "09:00 AM - 07:00 PM",
        tuesday: "09:00 AM - 07:00 PM",
        wednesday: "09:00 AM - 07:00 PM",
        thursday: "09:00 AM - 07:00 PM",
        friday: "09:00 AM - 07:00 PM",
        saturday: "09:00 AM - 05:00 PM",
        sunday: "Closed"
      },
      services: ["K-12 Tutoring", "JEE Coaching", "NEET Prep", "Tablet Learning", "Mock Tests"],
      isVerified: true,
      rating: 4.2,
      reviewCount: 3210,
      createdAt: new Date().toISOString()
    },
    {
      id: "biz_13",
      ownerId: "usr_owner1",
      name: "Iron Hill Fitness Studio",
      category: "fitness",
      description: "Boutique strength and conditioning gym with Olympic lifting platforms, powerlifting equipment, CrossFit WODs, and certified strength coaches.",
      address: "12, 1st Cross, Sadashivanagar",
      city: "Bangalore",
      coordinates: { lat: 13.0050, lng: 77.5800 },
      phone: "+91 98450 77123",
      email: "train@ironhill.in",
      website: "https://ironhill.in",
      hours: {
        monday: "05:00 AM - 10:00 PM",
        tuesday: "05:00 AM - 10:00 PM",
        wednesday: "05:00 AM - 10:00 PM",
        thursday: "05:00 AM - 10:00 PM",
        friday: "05:00 AM - 10:00 PM",
        saturday: "06:00 AM - 08:00 PM",
        sunday: "06:00 AM - 06:00 PM"
      },
      services: ["Powerlifting", "CrossFit", "Olympic Lifting", "Strength Coaching", "Nutrition Plans"],
      isVerified: false,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    },
    {
      id: "biz_14",
      ownerId: "usr_owner1",
      name: "Koshy's Restaurant",
      category: "restaurants",
      description: "Bangalore's oldest and most iconic café since 1940, serving Anglo-Indian cuisine, legendary breakfast platters, and freshly brewed Coorg coffee in a heritage setting.",
      address: "39, St. Marks Rd, Shivajinagar",
      city: "Bangalore",
      coordinates: { lat: 12.9762, lng: 77.5993 },
      phone: "+91 80 2221 3793",
      email: "info@koshys.in",
      website: "https://koshys.in",
      hours: {
        monday: "08:00 AM - 11:00 PM",
        tuesday: "08:00 AM - 11:00 PM",
        wednesday: "08:00 AM - 11:00 PM",
        thursday: "08:00 AM - 11:00 PM",
        friday: "08:00 AM - 11:30 PM",
        saturday: "08:00 AM - 11:30 PM",
        sunday: "08:30 AM - 10:30 PM"
      },
      services: ["Anglo-Indian Cuisine", "Breakfast", "Coorg Coffee", "Heritage Dining", "Takeaway"],
      isVerified: true,
      rating: 4.6,
      reviewCount: 4120,
      createdAt: new Date().toISOString()
    }
  ],
  reviews: [
    {
      id: "rev_1",
      businessId: "biz_1",
      userId: "usr_user1",
      username: "alice_explorer",
      rating: 5,
      comment: "Absolutely in love with the classic filter coffee here! The ghee roast dosa is perfect and crispy. Highly recommended for weekend mornings.",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    },
    {
      id: "rev_2",
      businessId: "biz_1",
      userId: "usr_owner1",
      username: "john_cafe",
      rating: 5,
      comment: "Proud to serve the most authentic coffee experience in Indiranagar. Thank you for the support!",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "rev_3",
      businessId: "biz_1",
      userId: "usr_admin",
      username: "admin",
      rating: 4.4,
      comment: "Solid south Indian breakfast spot. Fast Wi-Fi and pleasant outdoor seating.",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "rev_4",
      businessId: "biz_2",
      userId: "usr_user1",
      username: "alice_explorer",
      rating: 4.5,
      comment: "Had an amazing sandalwood facial treatment. Extremely professional staff and peaceful aroma.",
      createdAt: new Date().toISOString()
    },
    {
      id: "rev_5",
      businessId: "biz_3",
      userId: "usr_user1",
      username: "alice_explorer",
      rating: 4.2,
      comment: "Consultation was detailed and professional, but wait times during peak hours can be high.",
      createdAt: new Date().toISOString()
    }
  ],
  bookmarks: []
};

// Database utility functions
const loadDatabase = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error("Database reading failed, using in-memory initialization:", error);
    return initialData;
  }
};

const saveDatabase = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Database writing failed:", error);
    return false;
  }
};

// Mimic ODM Operations
const createModel = (collectionName) => {
  return {
    find: (filter = {}) => {
      const db = loadDatabase();
      const collection = db[collectionName] || [];
      return collection.filter(item => {
        for (let key in filter) {
          if (filter[key] !== undefined && item[key] !== filter[key]) {
            return false;
          }
        }
        return true;
      });
    },

    findOne: (filter = {}) => {
      const db = loadDatabase();
      const collection = db[collectionName] || [];
      return collection.find(item => {
        for (let key in filter) {
          if (filter[key] !== undefined && item[key] !== filter[key]) {
            return false;
          }
        }
        return true;
      });
    },

    findById: (id) => {
      const db = loadDatabase();
      const collection = db[collectionName] || [];
      return collection.find(item => item.id === id);
    },

    create: (data) => {
      const db = loadDatabase();
      if (!db[collectionName]) db[collectionName] = [];
      const newRecord = {
        id: `${collectionName.slice(0, 3)}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        ...data
      };
      db[collectionName].push(newRecord);
      saveDatabase(db);
      return newRecord;
    },

    updateById: (id, updateData) => {
      const db = loadDatabase();
      const index = (db[collectionName] || []).findIndex(item => item.id === id);
      if (index === -1) return null;
      db[collectionName][index] = {
        ...db[collectionName][index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      saveDatabase(db);
      return db[collectionName][index];
    },

    deleteById: (id) => {
      const db = loadDatabase();
      const initialLength = (db[collectionName] || []).length;
      db[collectionName] = (db[collectionName] || []).filter(item => item.id !== id);
      saveDatabase(db);
      return (db[collectionName] || []).length < initialLength;
    },

    save: (record) => {
      const db = loadDatabase();
      const collection = db[collectionName] || [];
      const index = collection.findIndex(item => item.id === record.id);
      if (index !== -1) {
        collection[index] = { ...record, updatedAt: new Date().toISOString() };
      } else {
        collection.push(record);
      }
      db[collectionName] = collection;
      saveDatabase(db);
      return record;
    }
  };
};

module.exports = {
  User: createModel('users'),
  Business: createModel('businesses'),
  Review: createModel('reviews'),
  Bookmark: createModel('bookmarks'),
  rawDb: { loadDatabase, saveDatabase }
};
