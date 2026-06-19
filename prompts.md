Build a full-stack Next.js web application: "Aichi Nagoya 2026 Asian Para Games - 
Report on Injuries and Illnesses" for the Asian Paralympic Committee.
reference - https://services-asianparalympic.org/report-on-injuries-and-illnesses/
=============================================================================
TECH STACK
=============================================================================
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Backend: Next.js API Routes
- Database: MySQL
- ORM: Prisma
- Form: React Hook Form + Zod
- Auth (Admin): NextAuth.js (credentials provider)
- Phone Input: react-phone-number-input
- Hosting-ready: Vercel + PlanetScale or local MySQL

=============================================================================
PROJECT STRUCTURE
=============================================================================

para-games-report/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout with font + metadata
│   │   ├── page.tsx                    # Redirect to /form/step1
│   │   ├── form/
│   │   │   ├── layout.tsx              # Form layout (header + footer)
│   │   │   ├── step1/
│   │   │   │   └── page.tsx            # Step 1: Reporter Info
│   │   │   ├── step2/
│   │   │   │   └── page.tsx            # Step 2: Injuries & Illnesses
│   │   │   ├── step3/
│   │   │   │   └── page.tsx            # Step 3: Review & Submit
│   │   │   └── success/
│   │   │       └── page.tsx            # Success/Thank you page
│   │   ├── admin/
│   │   │   ├── layout.tsx              # Admin layout (protected)
│   │   │   ├── login/
│   │   │   │   └── page.tsx            # Admin login page
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx            # All submissions table
│   │   │   └── report/
│   │   │       └── [id]/
│   │   │           └── page.tsx        # Single report detail view
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts        # NextAuth handler
│   │       └── reports/
│   │           ├── route.ts            # POST: create, GET: list all
│   │           └── [id]/
│   │               └── route.ts        # GET: single report by ID
│   ├── components/
│   │   ├── Header.tsx                  # Red banner with APC branding
│   │   ├── Footer.tsx                  # Black footer with copyright
│   │   ├── ProgressBar.tsx             # Green step progress bar
│   │   ├── PhoneInput.tsx              # Country flag + number input
│   │   ├── ExampleTable.tsx            # Gray reference table (Step 2)
│   │   ├── InjuryForm.tsx              # Single injury entry fields
│   │   ├── IllnessForm.tsx             # Single illness entry fields
│   │   └── admin/
│   │       ├── ReportsTable.tsx        # Admin submissions list table
│   │       └── ReportDetail.tsx        # Full report detail view
│   ├── context/
│   │   └── FormContext.tsx             # Global form state (React Context)
│   ├── lib/
│   │   ├── prisma.ts                   # Prisma client singleton
│   │   ├── auth.ts                     # NextAuth config
│   │   └── validations.ts             # Zod schemas for all steps
│   └── types/
│       └── index.ts                    # TypeScript interfaces
├── public/
│   └── apc-logo.png                    # Asian Paralympic Committee logo
├── .env                                # Environment variables
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── package.json

=============================================================================
DATABASE: MySQL via Prisma
=============================================================================

-- prisma/schema.prisma --

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Report {
  id             String    @id @default(uuid())
  npc            String
  reportedBy     String
  dateOfReport   DateTime  @db.Date
  email          String
  phone          String
  status         String    @default("submitted")
  createdAt      DateTime  @default(now())
  injuries       Injury[]
  illnesses      Illness[]
}

model Injury {
  id               String   @id @default(uuid())
  reportId         String
  report           Report   @relation(fields: [reportId], references: [id])
  accreditationNo  String
  sportEvent       String
  roundHeat        String?
  injuryDate       String
  injuryTime       String?
  bodyPart         String
  bodyPartCode     String?
  injuryType       String
  injuryTypeCode   String?
  causeOfInjury    String?
  causeCode        String?
  absenceDays      Int?
}

model Illness {
  id               String   @id @default(uuid())
  reportId         String
  report           Report   @relation(fields: [reportId], references: [id])
  accreditationNo  String
  sportEvent       String
  occurredOn       String
  diagnosis        String
  affectedSystem   String?
  systemCode       String?
  mainSymptoms     String?
  symptomCodes     String?
  causeOfIllness   String?
  causeCode        String?
  absenceDays      Int?
}

model AdminUser {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   # bcrypt hashed
  name      String
  createdAt DateTime @default(now())
}

=============================================================================
ENVIRONMENT VARIABLES (.env)
=============================================================================

DATABASE_URL="mysql://root:password@localhost:3306/para_games_db"
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@asianparalympic.org"
ADMIN_PASSWORD_HASH="$2b$10$..."   # bcrypt hash of admin password

=============================================================================
VISUAL DESIGN — EXACT MATCH TO REFERENCE
=============================================================================

COLORS:
  --brand-red:     #E03A18   (header background)
  --brand-cyan:    #00BCD4   (NEXT / SUBMIT / PREVIOUS buttons)
  --progress-green:#4CAF50   (progress bar fill)
  --text-dark:     #333333   (body text)
  --border-gray:   #CCCCCC   (input borders, table borders)
  --bg-white:      #FFFFFF   (page background)
  --footer-black:  #1A1A1A   (footer background)
  --link-teal:     #00ACC1   (Save and Resume Later link)
  --success-green-bg: #F0FFF0 (success message background)
  --success-green-border: #C3E6CB

FONTS: Inter (Google Fonts) for all text

HEADER COMPONENT:
- Full-width red (#E03A18) background
- Geometric abstract pattern SVG overlay (orange tones, semi-transparent)
- Left side: "Aichi Nagoya 2026 Asian Para Games" in bold white 28px
            "Report on Injuries and Illnesses" in white 18px below
- Right side: "ASIAN PARALYMPIC COMMITTEE" text + APC wheelchair logo icon
             + "5th Asian Para Games Aichi-Nagoya 2026" small text
             + Flame/torch logo icon on far right
- Height: ~200px

PROGRESS BAR:
- Full-width gray track, rounded
- Green fill based on current step (step1=33%, step2=66%, step3=100%)
- "Step X of 3" label above in gray text

STEP 1 FIELDS:
- NPC: <select> dropdown with all Asian NPC countries listed
  Options: Afghanistan, Bahrain, Bangladesh, Bhutan, Brunei, Cambodia, China,
  Chinese Taipei, Hong Kong China, India, Indonesia, Iran, Iraq, Japan,
  Jordan, Kazakhstan, South Korea, Kuwait, Kyrgyzstan, Laos, Lebanon,
  Macau China, Malaysia, Maldives, Mongolia, Myanmar, Nepal, Pakistan,
  Palestine, Philippines, Qatar, Saudi Arabia, Singapore, Sri Lanka,
  Syria, Tajikistan, Thailand, Timor-Leste, Turkmenistan, UAE, Uzbekistan,
  Vietnam, Yemen
- Report by (name): text input
- Date of report: date input
- Contact Details section header (bold)
- Email: email input
- Phone: react-phone-number-input with flag selector, default India (+91)
- Info paragraph in teal/orange text at bottom (same as reference)
- NEXT button (cyan) + "Save and Resume Later" link

STEP 2 LAYOUT:
- Section "1. Injury - Example" heading
- Gray bordered example table showing sample injury (reference data):
  accreditation: 123456789, sport: athletics 100m,
  round: quarter final / 1st heat, date: 10.12.2025 13:15,
  body part: wrist left Code: 5, type: sprain Code: 8,
  cause: slipped & fell Code: 21, absence: 10 days
- Actual input form below with same fields in 3-column grid
- Section "2. Illness - Example" heading
- Gray bordered example table for illness (reference data):
  accreditation: 123456789, sport: football men,
  diagnosis: tonsillitis cold, occurred: 10.12.2025,
  system: respiratory Code: 1, symptoms: fever pain Code: 1,2,
  cause: infection Code: 9, absence: 10 days
- Actual illness input form below
- "Add Injury" checkbox at bottom to add additional injury entries
- PREVIOUS + NEXT buttons

STEP 3:
- Progress bar at 100%
- "Step 3 of 3" label
- SUBMIT button (cyan) + "Save and Resume Later" link
- On submit: POST all data to /api/reports, redirect to /form/success

SUCCESS PAGE:
- Header same
- Light green box: "Thanks for contacting us! We will be in touch with you shortly."
- No other content

ADMIN DASHBOARD (/admin/dashboard):
- Protected route (redirect to /admin/login if not authenticated)
- Login page: simple centered card with email + password + Login button
- Dashboard: full-width table showing all reports:
  Columns: #, NPC, Reported By, Date, Email, Phone, Injuries, Illnesses, Actions
  Actions: "View" button linking to /admin/report/[id]
- Report Detail (/admin/report/[id]):
  Shows all Step 1 info + all injury rows + all illness rows in tables
  Back button to dashboard

=============================================================================
FORM STATE / SAVE AND RESUME LATER
=============================================================================

Use React Context (FormContext.tsx) to store all form data in memory.
On "Save and Resume Later" click: save current formData to localStorage
with key "para_games_form_data".
On page load: check localStorage and restore if exists.

FormContext shape:
{
  step1: {
    npc: string,
    reportedBy: string,
    dateOfReport: string,
    email: string,
    phone: string
  },
  step2: {
    injuries: InjuryEntry[],
    illnesses: IllnessEntry[]
  }
}

InjuryEntry: {
  accreditationNo, sportEvent, roundHeat,
  injuryDate, injuryTime, bodyPart, bodyPartCode,
  injuryType, injuryTypeCode, causeOfInjury, causeCode, absenceDays
}

IllnessEntry: {
  accreditationNo, sportEvent, occurredOn, diagnosis,
  affectedSystem, systemCode, mainSymptoms, symptomCodes,
  causeOfIllness, causeCode, absenceDays
}

=============================================================================
API ROUTES
=============================================================================

POST /api/reports
  Body: { step1: {...}, injuries: [...], illnesses: [...] }
  Action: Create Report + related Injury + Illness records in MySQL
  Response: { success: true, id: "uuid" }

GET /api/reports
  Protected (check session)
  Response: all reports with injury/illness counts

GET /api/reports/[id]
  Protected (check session)
  Response: full report with all injuries and illnesses

=============================================================================
PACKAGES TO INSTALL
=============================================================================

npm install prisma @prisma/client
npm install next-auth bcryptjs
npm install react-hook-form @hookform/resolvers zod
npm install react-phone-number-input
npm install @types/bcryptjs

=============================================================================
SEED SCRIPT (prisma/seed.ts)
=============================================================================

Create one AdminUser with:
  email: "admin@asianparalympic.org"
  password: bcrypt.hash("Admin@123", 10)
  name: "Admin"

Run with: npx ts-node prisma/seed.ts

=============================================================================
COMMANDS TO RUN IN ORDER
=============================================================================

1. npx create-next-app@latest para-games-report --typescript --tailwind --app
2. cd para-games-report
3. npm install prisma @prisma/client next-auth bcryptjs react-hook-form 
   @hookform/resolvers zod react-phone-number-input @types/bcryptjs
4. npx prisma init
5. (Update schema.prisma with above schema)
6. (Create MySQL database: CREATE DATABASE para_games_db;)
7. npx prisma migrate dev --name init
8. npx ts-node prisma/seed.ts
9. npm run dev
10. Open http://localhost:3000

=============================================================================
NOTES
=============================================================================

- All inputs should have proper labels and placeholder text
- Form validation: required fields show red border + error message on blur
- Mobile responsive: stack columns to single column on <768px
- The geometric SVG background pattern in header: use inline SVG with 
  circles, arcs, and abstract shapes in shades of #C0341A, #E85A30, #F07040
- No external image dependencies — generate the APC logo as SVG inline
- Admin password for testing: Admin@123

