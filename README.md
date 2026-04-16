# SK Overseas Website

This is a lead-generation landing page for SK Overseas visa consultancy.

## Files

- `index.html` - Main landing page
- `styles.css` - Styling and responsive design
- `script.js` - Lead form behavior + Formspree submission

## Run Locally

Open `index.html` directly in browser.

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

### Step 4: Test & View Submissions

1. Visit your Vercel site
2. Fill the form and submit
3. Check your email inbox - Formspree sends you all submissions
4. Formspree dashboard also shows all responses

### Summary of Free Services

- **Formspree**: Free email form backend
- **Vercel**: Free hosting, auto-deploy from GitHub
- **GitHub**: Free repo hosting (optional but recommended)

All data comes to your email automatically!
