# Vibe Coding Guide — CodeMaster Technical Course & Blog Platform
This guide contains a series of **9 sequential prompts** designed for students to build a premium, full-stack educational web application with Next.js, Prisma (SQLite), NextAuth.js, and Razorpay. 

By feeding these prompts to an AI coding assistant (like Gemini, Claude, or ChatGPT) step-by-step, students can construct the exact architecture, functionalities, and interactive pages of the app (selling courses, video teaching, and technical blogging like GeeksforGeeks), while customizing the colors, style, and branding to their liking.

---

## Technical Architecture & Setup Rules

To ensure students do not run into common Next.js, database, or library bugs, the prompts incorporate specific guardrails for these known pain points:
1. **Windows C++ Compiler Restrictions**: Downgrade Prisma to version `6` (`^6.4.0`) to use the built-in Rust query engine. This avoids native C++ driver adapters (like `better-sqlite3`) that require Visual Studio build tools on Windows.
2. **Lucide React CASING & Icons**: Use `lucide-react` version `0.475.0` to preserve brand social icons.
3. **styled-jsx inside Server Components**: Keep Server Components pure. Never write `styled-jsx` directly in database-fetching Server Components; instead, extract dashboard CSS to dedicated stylesheets.
4. **React Hydration Mismatch**: Random client particle animations or dates must be deferred to post-mount (`useEffect`) to guarantee client-rendered HTML matches server-rendered HTML.
5. **Keyless Payments (Sandbox Simulator)**: Allow testing payments locally without actual Razorpay keys by creating a fallback sandbox simulator checkout modal in the frontend and signature bypass in the API endpoints.

---

# Prompt Sequence

### Step 1: Scaffolding, Theme Customization & Global CSS
> **Student Action**: Copy and paste the prompt below to start the project. Tell the AI what custom colors you want to use.

```text
Initialize a new Next.js 15+ project with TypeScript, App Router, and a `src` directory in the current folder. 
Do not use TailwindCSS; we want to write custom, modern vanilla CSS for maximum design control.

Let's setup the design system and scaffolding:
1. Install core dependencies: `prisma`, `@prisma/client`, `next-auth`, `razorpay`, `lucide-react@0.475.0`, `bcryptjs`, `zod`, `react-markdown`. (Ensure lucide-react is exactly 0.475.0).
2. Create `src/app/globals.css`. Set up CSS custom properties (variables) for a premium, developer-focused dark theme (or a clean light mode). Include tokens for background, card backgrounds, borders, typography, code-block syntax highlighting themes, and vibrant accents (e.g. hacker green, react blue, or tech purple). Add smooth micro-animations, glassmorphism, and shadow effects.
3. Set up custom utility classes for buttons (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-lg`), badges, card-gradients, and responsive grids.
4. Create the root `layout.tsx` incorporating Google Fonts (Inter + Fira Code for code blocks) and SEO metadata. Make sure all pages include responsive styling.

Once done, print Tasks Finished.
```

---

### Step 2: Database Schema (Prisma & SQLite)
> **Student Action**: Run this prompt next to build the relational database schema.

```text
Let's build the relational database schema using Prisma for our course and blogging platform. 
Create `prisma/schema.prisma` targeting SQLite database provider. Ensure you define the following models:
1. `User` (id, name, email, password, bio, role [default 'STUDENT', can be 'INSTRUCTOR', 'ADMIN'], timestamps, relations to enrollments, blogPosts, comments, accounts, sessions).
2. `Account` & `Session` & `VerificationToken` (standard models for NextAuth session adapters).
3. `Course` (id, title, slug [unique], description, price, level [BEGINNER/INTERMEDIATE/ADVANCED], category, thumbnail, instructorId [relation to User], published [Boolean], timestamps).
4. `Lesson` (id, courseId [relation], title, content, videoUrl, order [Int], isFreePreview [Boolean], timestamps).
5. `Enrollment` (id, userId, courseId, progress [Int default 0], status [ACTIVE/COMPLETED], paymentId, timestamps).
6. `Payment` (id, userId, courseId, amount, status [PENDING/SUCCESS/FAILED], razorpayOrderId, razorpayPaymentId, razorpaySignature, timestamps).
7. `BlogPost` (id, title, slug [unique], content, authorId [relation], category, tags [String JSON list], published [Boolean], timestamps).
8. `Comment` (id, userId, blogPostId, content, timestamps).

After generating the schema, run `npx prisma generate` to build the Prisma Client.

Once done, print Tasks Finished.
```

---

### Step 3: Database Seeding
> **Student Action**: Run this prompt to populate the database with default courses and tech blogs.

```text
Create a Prisma seeding script in `prisma/seed.ts` that will populate the database when we run `npx prisma db seed`.
The seed script must populate:
1. An INSTRUCTOR user.
2. 4+ Courses (e.g., Complete Next.js Bootcamp, Advanced Data Structures in Python, System Design Interview Prep, Web3 DApp Development). Provide realistic descriptions, levels, prices, and thumbnails.
3. 3-5 Lessons per Course. Make the first lesson of each course `isFreePreview: true` with a dummy YouTube URL and some markdown content.
4. 5+ Blog Posts (e.g., "Understanding React Server Components", "How to Deploy Prisma to Vercel", "10 Tips for cleaner code"). Write dummy technical content formatted in Markdown (with code blocks).
5. Ensure the seed file compiles properly. Configure the `prisma.seed` command in your `package.json` and tell me how to run the migration and seed the database.

Once done, print Tasks Finished.
```

---

### Step 4: Authentication Core & Route Protection
> **Student Action**: Run this prompt to set up NextAuth session management and route validation.

```text
Let's implement credentials authentication:
1. Create a Prisma client singleton at `src/lib/db.ts` to prevent multiple client instances during hot-reloading.
2. Set up NextAuth configuration in `src/lib/auth.ts` with a CredentialsProvider. Implement email/password validation by fetching from the SQLite user table and comparing passwords using `bcryptjs`.
3. Expose session and role variables inside the JWT token and Session callbacks.
4. Create the Catchall NextAuth API route handler at `src/app/api/auth/[...nextauth]/route.ts`.
5. Create a registration API endpoint at `src/app/api/auth/register/route.ts` that validates email uniqueness, hashes passwords with bcrypt, and registers a new User.
6. Set up route protection middleware in `src/proxy.ts` (Next.js 16 Proxy convention or standard middleware) that redirects unauthenticated users trying to access `/dashboard` routes back to `/login`, and redirects logged-in users away from `/login`/`/register` to `/dashboard`.

Once done, print Tasks Finished.
```

---

### Step 5: Auth UI Pages (Login & Register)
> **Student Action**: Create the forms for user signups.

```text
Create beautiful, responsive split-screen pages for Authentication:
1. Create an auth page layout in `src/app/(auth)/layout.tsx` that displays a premium tech branding block on the left (e.g. background with code snippets, abstract tech grid) and the form inputs on the right.
2. Create the Login page `src/app/(auth)/login/page.tsx` using custom CSS. Validate email and password inputs client-side, showing error indicators. Integrate the NextAuth `signIn('credentials')` action and handle post-login redirects.
3. Create the Register page `src/app/(auth)/register/page.tsx` containing fields for Name, Email, Password, and a short Bio.
Ensure both forms look premium, use glassmorphism inputs, smooth hover scales, and clear validation logic.

Once done, print Tasks Finished.
```

---

### Step 6: Navigation, Hero & Landing Page
> **Student Action**: Build the public homepage.

```text
Let's assemble the public homepage and layout navigation:
1. Build a sticky Glassmorphism `Navbar.tsx` component in `src/components/Navbar.tsx`. Make it responsive with a toggleable burger menu on mobile. The navbar must read the NextAuth auth session and show a "Dashboard" link if logged in, and a "Login" CTA button if not. Include links for Courses and Blog.
2. Build a modern `HeroSection.tsx` component. It should feature a large display heading ("Master Tech Skills with CodeMaster"), a bold gradient tagline, call-to-action buttons ("Browse Courses", "Read the Blog"), and clean decorative coding elements (brackets/particles). 
   - CRITICAL: To prevent React hydration mismatches, ensure any dynamic properties are deferred by rendering particles only after mounting (using `useState` and `useEffect` client-side).
3. Build a `FeaturedCoursesGrid.tsx` to display top courses.
4. Build a `Footer.tsx` component featuring links, descriptions, contact info, and social brand icons using `lucide-react`. Add `use client` to Footer if it utilizes styled-jsx tags to prevent rendering errors.
5. Create the main landing page `src/app/page.tsx`. Fetch top courses and latest blog posts from the database, render the Hero, Featured Courses, and Latest Articles list.

Once done, print Tasks Finished.
```

---

### Step 7: Technical Blog & Course Catalog
> **Student Action**: Build the learning catalog and the blog reader.

```text
Let's build the content exploration system:
1. **Blog Listing & Reader** (`src/app/blog/page.tsx` & `src/app/blog/[slug]/page.tsx`): 
   - Fetch all blog posts. Create a listing UI with tags.
   - For the detail page, render the markdown content using `react-markdown` with custom CSS for code blocks (`<pre>`, `<code>`), quotes, and headers to resemble GeeksforGeeks/Medium quality. Include a comment section at the bottom.
2. **Courses Catalog** (`src/app/courses/page.tsx`): Fetch all published courses. Build a filterable UI where users can search, filter by level, or category.
3. **Course Detail Page** (`src/app/courses/[slug]/page.tsx`): 
   - Display course header (thumbnail, title, instructor, level, price).
   - Display a syllabus list (Lessons). If a lesson is `isFreePreview: true`, allow clicking to play the preview video in a modal.
   - Include a sticky sidebar with an "Enroll Now" button.

Once done, print Tasks Finished.
```

---

### Step 8: Razorpay Course Enrollment & Sandbox Simulator
> **Student Action**: Implement this prompt to build the payment workflow for course purchasing.

```text
Let's set up the enrollment payment workflow supporting both real Razorpay transactions and a mock/development sandbox simulator:
1. Create a Razorpay helper file `src/lib/razorpay.ts` that instantiates the Razorpay client using `process.env.RAZORPAY_KEY_ID` and `process.env.RAZORPAY_KEY_SECRET`. 
2. Create a POST endpoint `/api/payments/create-order/route.ts` that accepts a `courseId`, fetches the price, and checks if keys are default placeholders (e.g. `rzp_test_yourkeyhere`).
   - If keys are default placeholders, return a mock order payload (`isMock: true`, fake order ID).
   - If keys are valid, call `razorpay.orders.create` to generate a real Razorpay order ID.
   - Insert a `PENDING` transaction record in the `Payment` table.
3. Create a verification POST endpoint `/api/payments/verify/route.ts` that validates signature parameters:
   - If `orderId` starts with `order_mock_`, check if `signature === 'mock_signature'`.
   - Otherwise, verify the HMAC SHA-256 hash using the Razorpay key secret.
   - On successful payment, mark the payment as `SUCCESS` and create an `ACTIVE` `Enrollment` record for the user and course.
4. Modify the Course Detail Page "Enroll Now" button logic:
   - If `orderData.isMock` is returned, open a beautiful, custom glassmorphism **Sandbox Simulator checkout overlay modal** showing Course Price and Order ID. Add two buttons: "Simulate Success" (calls `/api/payments/verify` with mock signature) and "Cancel".
   - If real keys are present, load the Razorpay SDK script dynamically and prompt the native Razorpay payment overlay.
   - Redirect successful checkouts to `/dashboard/learning`.

Once done, print Tasks Finished.
```

---

### Step 9: Learning Dashboard & Video Player
> **Student Action**: Build the student portal.

```text
Let's build the student learning workspace dashboard:
1. Create a shared sidebar navigation layout at `src/app/dashboard/layout.tsx` providing links to: Overview, My Learning, Profile, and Settings.
2. Build the Main Overview dashboard home page `src/app/dashboard/page.tsx`. Fetch user session details and display enrolled courses summary and a quick continue learning card.
3. Build the Learning page `src/app/dashboard/learning/page.tsx`:
   - Display a grid of enrolled courses.
   - CRITICAL: Save all component styles inside a dedicated `dashboard.css` file and import it directly. Do not use styled-jsx within server-rendered pages to prevent styled-jsx hydration mismatches.
4. Build the Course Player (`src/app/dashboard/learning/[courseSlug]/page.tsx`):
   - A two-column layout: A large video player/markdown content area on the left, and a scrollable lesson playlist sidebar on the right.
   - Fetch the enrolled course and its lessons.
   - Allow students to click lessons, watch the embedded video/read content, and mark lessons as complete to update their `progress` in the `Enrollment` model.

Once done, print Tasks Finished.
```

---

## Tips for Success (Vibe Coding)

* **Customize Colors**: Students can adjust the CSS custom properties in `globals.css` to instantly change the theme.
* **Troubleshooting Compilation**: If Next.js fails to compile styled-jsx or throws client/server mismatches, verify you have added `'use client';` at the top of interactive components (like navigation, carousels, lists, and forms).
* **Database Reset**: To wipe the SQLite database and start fresh with seed data, run:
  ```bash
  npx prisma db push --force-reset
  npx prisma db seed
  ```
