# SK Overseas Website

This is a lead-generation landing page for SK Overseas visa consultancy.

## Files

- `index.html` - Main landing page
- `styles.css` - Styling and responsive design
- `script.js` - Lead form behavior + Formspree submission
- `speed-insights.js` - Vercel Speed Insights initialization
- `speed-insights.bundle.js` - Bundled Speed Insights script
- `package.json` - Node dependencies and build scripts

## Run Locally

1. Install dependencies: `npm install`
2. Build Speed Insights: `npm run build`
3. Open `index.html` directly in browser

Note: Speed Insights will only track data in production when deployed to Vercel.

## Important Customization

1. Update phone number and email in `index.html`
2. Replace testimonials with real client reviews
3. Update contact address in footer section

## Free Lead Capture With Formspree + Vercel Deployment

This website is fully configured for free lead capture using **Formspree** and can be deployed on **Vercel** (both free).

### Step 1: Create Formspree Account

1. Go to https://formspree.io/
2. Sign up with your email (free)
3. Create a new form (any name like "SK Overseas Leads")
4. Copy your **Form ID** (looks like: `abcde12345`)

### Step 2: Configure in script.js

Open `script.js` and update this line:

```javascript
const FORMSPREE_ID = "YOUR_FORMSPREE_ID_HERE";
```

Replace `YOUR_FORMSPREE_ID_HERE` with your actual Form ID from Formspree.

### Step 3: Deploy on Vercel (Free)

1. Push your files to GitHub (create free account if needed)
2. Go to https://vercel.com/
3. Click **Import Project** → Connect your GitHub repo
4. Click **Deploy** (takes 1 minute)
5. You get a live URL like: `https://sk-overseas.vercel.app`

**Important**: After deployment, enable Speed Insights in your Vercel dashboard:
- Go to your project settings in Vercel
- Navigate to the Speed Insights section
- Enable Speed Insights to start tracking performance metrics

### Step 4: Test & View Submissions

1. Visit your Vercel site
2. Fill the form and submit
3. Check your email inbox - Formspree sends you all submissions
4. Formspree dashboard also shows all responses

### Summary of Free Services

- **Formspree**: Free email form backend
- **Vercel**: Free hosting, auto-deploy from GitHub
- **Vercel Speed Insights**: Free performance monitoring and web vitals tracking
- **GitHub**: Free repo hosting (optional but recommended)

All data comes to your email automatically!

## Vercel Speed Insights

This website includes **Vercel Speed Insights** for performance monitoring. Speed Insights automatically tracks:

- **Core Web Vitals**: LCP (Largest Contentful Paint), FID (First Input Delay), CLS (Cumulative Layout Shift)
- **Other Performance Metrics**: FCP (First Contentful Paint), TTFB (Time to First Byte), INP (Interaction to Next Paint)

### How It Works

1. The `speed-insights.js` file initializes the Speed Insights tracking
2. The bundled script (`speed-insights.bundle.js`) is included in the HTML
3. When deployed to Vercel, the script automatically collects performance data
4. View metrics in your Vercel dashboard under Speed Insights

### Build Commands

- `npm run build` - Build the Speed Insights bundle for production
- `npm run dev` - Watch mode for development (rebuilds on changes)

### Note

Speed Insights only tracks data in **production** environments when deployed to Vercel. It will not collect data during local development.
