// Gig Categories
export const CATEGORIES = [
  { slug: 'cafe', name: 'Cafes & Coffee Shops', icon: 'Coffee', color: 'amber' },
  { slug: 'restaurant', name: 'Restaurants & Bakeries', icon: 'UtensilsCrossed', color: 'orange' },
  { slug: 'bookstore', name: 'Bookstores & Libraries', icon: 'BookOpen', color: 'emerald' },
  { slug: 'gym', name: 'Gyms & Fitness Studios', icon: 'Dumbbell', color: 'blue' },
  { slug: 'coworking', name: 'Co-working Spaces', icon: 'Briefcase', color: 'purple' },
  { slug: 'retail', name: 'Retail & Clothing', icon: 'ShoppingBag', color: 'pink' },
  { slug: 'events', name: 'Event Venues', icon: 'PartyPopper', color: 'violet' },
  { slug: 'other', name: 'Other Cool Spots', icon: 'Sparkles', color: 'slate' },
] as const

export type CategorySlug = typeof CATEGORIES[number]['slug']

// Hyderabad Areas
export const AREAS = {
  studentHubs: [
    'Jubilee Hills',
    'Banjara Hills',
    'Madhapur',
    'Gachibowli',
    'Kukatpally',
    'Ameerpet',
  ],
  broader: [
    'Secunderabad',
    'Begumpet',
    'Kondapur',
    'HITEC City',
    'Miyapur',
    'Somajiguda',
    'Himayatnagar',
    'Abids',
    'Dilsukhnagar',
    'LB Nagar',
    'Punjagutta',
    'Lakdikapul',
    'Mehdipatnam',
    'Tolichowki',
  ],
} as const

export const ALL_AREAS = [...AREAS.studentHubs, ...AREAS.broader]

// Predefined Skills
export const SKILLS = {
  service: [
    'Barista',
    'Customer Service',
    'Cashier',
    'Host/Hostess',
    'Server',
    'Retail Sales',
  ],
  creative: [
    'Graphic Design',
    'Photography',
    'Videography',
    'Video Editing',
    'Content Writing',
    'Social Media Management',
  ],
  technical: [
    'Web Development',
    'App Development',
    'Data Entry',
    'IT Support',
  ],
  admin: [
    'Administration',
    'Reception',
    'Event Coordination',
    'Community Management',
    'Business Development',
  ],
} as const

export const ALL_SKILLS = [
  ...SKILLS.service,
  ...SKILLS.creative,
  ...SKILLS.technical,
  ...SKILLS.admin,
]

export const SKILL_CATEGORIES = {
  service: 'Service',
  creative: 'Creative',
  technical: 'Technical',
  admin: 'Admin',
} as const

// Proficiency Levels
export const PROFICIENCY_LEVELS = [
  { value: 'learning', label: 'I am currently learning this' },
  { value: 'good', label: 'I am good at this' },
  { value: 'expert', label: 'I am an expert at this' },
] as const

// Schedule Types
export const SCHEDULE_TYPES = [
  { value: 'weekends', label: 'Weekends Only' },
  { value: 'evenings', label: 'Evenings Only' },
  { value: 'flexible', label: 'Flexible Hours' },
  { value: 'fullday', label: 'Full Day' },
] as const

// Pay Types
export const PAY_TYPES = [
  { value: 'hourly', label: 'Per Hour' },
  { value: 'daily', label: 'Per Day' },
  { value: 'monthly', label: 'Per Month' },
  { value: 'stipend', label: 'Fixed Stipend' },
] as const

// Student Years
export const STUDENT_YEARS = [
  { value: '1st', label: '1st Year' },
  { value: '2nd', label: '2nd Year' },
  { value: '3rd', label: '3rd Year' },
  { value: '4th', label: '4th Year' },
  { value: 'Graduate', label: 'Graduate' },
] as const

// Genders
export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
] as const

// Indian States
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Telangana',
  'Karnataka',
  'Tamil Nadu',
  'Kerala',
  'Maharashtra',
  'Gujarat',
  'Rajasthan',
  'Uttar Pradesh',
  'Madhya Pradesh',
  'West Bengal',
  'Bihar',
  'Odisha',
  'Assam',
  'Punjab',
  'Haryana',
  'Delhi',
  'Jharkhand',
  'Chhattisgarh',
  'Uttarakhand',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Goa',
  'Tripura',
  'Meghalaya',
  'Manipur',
  'Nagaland',
  'Arunachal Pradesh',
  'Mizoram',
  'Sikkim',
] as const

// Application Statuses
export const APPLICATION_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'viewed', label: 'Viewed', color: 'blue' },
  { value: 'shortlisted', label: 'Shortlisted', color: 'purple' },
  { value: 'accepted', label: 'Accepted', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'expired', label: 'Expired', color: 'gray' },
] as const

// Time Slots for Availability
export const TIME_SLOTS = [
  { value: 'morning', label: 'Morning', time: '6 AM - 12 PM' },
  { value: 'afternoon', label: 'Afternoon', time: '12 PM - 5 PM' },
  { value: 'evening', label: 'Evening', time: '5 PM - 10 PM' },
] as const

export const DAYS_OF_WEEK = [
  { value: 'monday', short: 'Mon', label: 'Monday' },
  { value: 'tuesday', short: 'Tue', label: 'Tuesday' },
  { value: 'wednesday', short: 'Wed', label: 'Wednesday' },
  { value: 'thursday', short: 'Thu', label: 'Thursday' },
  { value: 'friday', short: 'Fri', label: 'Friday' },
  { value: 'saturday', short: 'Sat', label: 'Saturday' },
  { value: 'sunday', short: 'Sun', label: 'Sunday' },
] as const

// Common Perks
export const COMMON_PERKS = [
  { value: 'free_coffee', label: 'Free coffee/tea' },
  { value: 'meals_included', label: 'Meals included' },
  { value: 'flexible_hours', label: 'Flexible hours' },
  { value: 'wfh_days', label: 'Work from home days' },
  { value: 'training', label: 'Training provided' },
  { value: 'employee_discount', label: 'Employee discount' },
  { value: 'tips_allowed', label: 'Tips allowed' },
  { value: 'transport_allowance', label: 'Transportation allowance' },
  { value: 'weekend_bonus', label: 'Weekend bonus' },
  { value: 'certificate', label: 'Certificate provided' },
] as const
