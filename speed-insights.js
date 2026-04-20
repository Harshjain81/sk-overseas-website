// Vercel Speed Insights initialization for vanilla HTML/JavaScript
// This script imports and initializes the Speed Insights tracking

import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights
// This will automatically track web vitals and performance metrics
// Note: Speed Insights only tracks in production when deployed to Vercel
injectSpeedInsights({
  debug: false, // Set to true to enable debug logging during development
});
