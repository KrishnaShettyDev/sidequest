# SideQuest - Product Requirements Document

## Product Overview

**Product Name:** SideQuest
**Tagline:** "Your college life. Your side quest."
**Version:** 1.0
**Last Updated:** February 2026

### Vision
SideQuest is a two-sided marketplace that connects college students in Hyderabad with part-time gigs at aspirational venues — cafes, bookstores, gyms, co-working spaces, retail stores, and event venues. We're bringing the Western part-time work culture to India, creating an aspirational middle ground between "needing money" and delivery/labor gigs.

### Target Market
- **Primary:** College students in Hyderabad (ages 18-24)
- **Secondary:** Local businesses seeking part-time staff (cafes, gyms, retail, etc.)
- **Geography:** Hyderabad, India (V1)

---

## User Personas

### Persona 1: The Student (Arya)
- 20-year-old B.Tech student at IIIT Hyderabad
- Lives in Gachibowli, has flexible schedule
- Wants to earn extra money while gaining real-world experience
- Prefers working at "cool" places over delivery gigs
- Tech-savvy, uses Instagram and LinkedIn actively

### Persona 2: The Employer (Rohan)
- 28-year-old owner of a specialty coffee shop in Jubilee Hills
- Needs part-time baristas for weekends
- Values reliability and customer service skills
- Wants to tap into the student talent pool
- Prefers quick, simple hiring process

---

## Core Features (V1)

### 1. Authentication
- **Google Sign-In only** (no email/password)
- Role selection on first login (Student / Employer)
- Automatic redirect to onboarding flow

### 2. Student Onboarding (3 Steps)

#### Step 1: About You
- Profile photo upload
- Personal info (name, phone, birth date, gender)
- Emergency contact details
- Permanent address (full address with city, state, pincode)
- Education (college name, year)
- Bio (max 2000 characters)

#### Step 2: Skills
- Select from predefined skill options
- For each skill:
  - Proficiency level (Learning / Good at this / Expert)
  - Professional or Hobby
  - Years of experience
  - Description (optional)
  - Portfolio/work link (optional)
  - Tools/software used (optional)
- Resume upload (optional)

#### Step 3: Preferences
- **Availability Grid:** Weekly schedule (Mon-Sun, Morning/Afternoon/Evening)
- **Work Preferences:**
  - Preferred categories (multi-select)
  - Preferred areas in Hyderabad (multi-select)
  - Preferred schedule type
  - Minimum pay expectation (INR per hour)

### 3. Employer Onboarding (3 Steps)

#### Step 1: Venue Info
- Venue name
- Category selection
- Description
- Contact email and phone

#### Step 2: Location
- Address
- Area (Hyderabad locality)
- Google Maps link

#### Step 3: Branding
- Logo upload
- Cover photo upload
- Additional venue photos (up to 5)
- Website URL
- Instagram URL

### 4. Browse Gigs
- Grid/list view of all active gigs
- **Filters:**
  - Category (Cafe, Gym, Bookstore, etc.)
  - Area/locality
  - Pay range
  - Schedule type (weekends, evenings, flexible)
- **Each gig card shows:**
  - Venue photo
  - Role title
  - Venue name
  - Pay range
  - Location
  - Schedule type

### 5. Gig Detail Page
- Full description
- Venue info with photos
- Location on map
- Requirements & perks
- Pay details & schedule
- One-tap apply button
- "About the Employer" section

### 6. One-Tap Apply
- Profile completion check before applying
- Confirmation modal
- Application created instantly
- Conversation auto-created for messaging

### 7. Student Dashboard
- Profile card with completion percentage
- Verified badge (if applicable)
- Recommended gigs based on preferences
- Quick links to applications and messages

### 8. Student Applications Page
- Table view of all applications
- Status filter (All, Pending, Accepted, Rejected)
- Each row shows: Gig title, Venue, Status, Applied date, Actions

### 9. Employer Dashboard
- Stats cards (Total gigs, Active applicants, New messages)
- Recent applications overview
- Quick link to post new gig

### 10. Employer Gig Management
- List of all posted gigs
- Create new gig form
- Edit existing gigs
- View applicants per gig
- Accept/reject applicants

### 11. Applicant Review
- Table view of applicants per gig
- Each row: Photo, Name, College, Skills, Applied date, Status
- Click to view full profile modal
- Actions: Accept, Reject, Message

### 12. In-App Messaging
- Conversation list (sorted by recent)
- Chat window with message bubbles
- Real-time updates
- Unread count badges in navbar

### 13. Settings
- Account management
- Profile status
- Danger zone (delete account)

---

## Data Models

### User Roles
- `student` — College students looking for gigs
- `employer` — Businesses posting gigs

### Application Statuses
- `pending` — Just applied
- `viewed` — Employer has seen the application
- `shortlisted` — Under consideration
- `accepted` — Offer extended
- `rejected` — Not selected
- `expired` — Gig is no longer active

### Gig Categories
| Category | Slug |
|----------|------|
| Cafes & Coffee Shops | cafe |
| Restaurants & Bakeries | restaurant |
| Bookstores & Libraries | bookstore |
| Gyms & Fitness Studios | gym |
| Co-working Spaces | coworking |
| Retail & Clothing | retail |
| Event Venues | events |
| Other Cool Spots | other |

### Hyderabad Areas
**Student Hubs:** Jubilee Hills, Banjara Hills, Madhapur, Gachibowli, Kukatpally, Ameerpet

**Broader Coverage:** Secunderabad, Begumpet, Kondapur, HITEC City, Miyapur, Somajiguda, Himayatnagar, Abids, Dilsukhnagar, LB Nagar, Punjagutta, Lakdikapul, Mehdipatnam, Tolichowki

### Predefined Skills
**Service:** Barista, Customer Service, Cashier, Host/Hostess, Server, Retail Sales

**Creative:** Graphic Design, Photography, Videography, Video Editing, Content Writing, Social Media Management

**Technical:** Web Development, App Development, Data Entry, IT Support

**Admin:** Administration, Reception, Event Coordination, Community Management, Business Development

---

## Non-Functional Requirements

### Performance
- Page load time < 3 seconds
- Real-time chat latency < 500ms
- Image uploads optimized and compressed

### Security
- Row-Level Security (RLS) on all database tables
- Students can only see their own applications
- Employers can only manage their own gigs and see their applicants
- Secure file uploads to Supabase Storage

### Scalability
- Designed to handle 10,000+ students and 500+ employers
- Database indexed for common queries

### Accessibility
- WCAG 2.1 AA compliance target
- Keyboard navigation support
- Screen reader friendly

### Mobile Responsiveness
- Mobile-first design
- Touch-friendly interactions
- Responsive from 320px to 2560px

---

## Design Guidelines

### Brand Identity
- **Primary Color:** Electric Purple (#7C3AED)
- **Secondary Color:** Bright Yellow (#FACC15)
- **Accent Color:** Coral Orange (#F97316)
- **Style:** Bold, Gen-Z, playful but professional

### Typography
- **Headings:** Bold, large (4xl-6xl)
- **Body:** Regular weight, readable
- **Tone:** Casual, friendly, emoji-friendly where appropriate

### UI Components
- Rounded corners (xl for cards, full for avatars)
- Subtle shadows
- Hover animations (scale + color)
- Progress indicators for multi-step flows
- Dark mode support

---

## Success Metrics (KPIs)

### Launch Goals (Month 1)
- 500 student sign-ups
- 50 employer sign-ups
- 100 gigs posted
- 200 applications submitted

### Growth Goals (Month 3)
- 2,000 active students
- 150 active employers
- 500 successful placements
- 4.5+ app store rating (when mobile launches)

---

## Out of Scope (V1)

- In-app payments/payroll
- Reviews and ratings system
- AI-powered gig matching
- Push notifications (mobile)
- Multi-city expansion
- Native mobile apps
- Phone number verification
- Referral system

---

## Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase (Auth, Postgres, Storage, Realtime) |
| Authentication | Google OAuth via Supabase |
| Hosting | Vercel |
| Icons | Lucide React |

---

## Timeline & Milestones

### Phase 1: Foundation
- Project setup
- Database schema
- Authentication flow
- Shared components

### Phase 2: Onboarding
- Student onboarding (3 steps)
- Employer onboarding (3 steps)
- Image upload functionality

### Phase 3: Core Features
- Gig browsing with filters
- Gig detail page
- One-tap apply flow

### Phase 4: Dashboards
- Student dashboard
- Employer dashboard
- Application management

### Phase 5: Communication
- In-app messaging
- Real-time updates
- Notification badges

### Phase 6: Polish
- Landing page
- Dark mode
- Mobile optimization
- SEO

---

## Appendix

### Competitive Analysis

| Platform | Focus | Weakness for Our Use Case |
|----------|-------|---------------------------|
| Internshala | Internships | Not part-time gigs |
| LinkedIn | Professional jobs | Too formal, not local |
| Apna | Blue-collar jobs | Not aspirational |
| VolunteerYatra | Volunteer travel | Exchange-based, not paid |

### Why SideQuest Wins
- Hyper-local (Hyderabad-first)
- Aspirational venues only
- Student-centric UX
- One-tap apply reduces friction
- Real-time chat for quick communication
