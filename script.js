const form = document.getElementById("consultation-form");
const statusEl = document.getElementById("form-status");
const yearEl = document.getElementById("year");

// Free lead capture with Formspree (https://formspree.io/)
// 1. Create account at formspree.io
// 2. Create new form and copy the form ID
// 3. Paste your Formspree form ID below
const FORMSPREE_ID = "mjgjgnzy"; // Replace with your Formspree form ID

function hasFormspreeConfig() {
  return FORMSPREE_ID && FORMSPREE_ID.trim().length > 0;
}

function getFormspreeEndpoint() {
  const value = FORMSPREE_ID.trim();
  return value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `https://formspree.io/f/${value}`;
}

async function submitLeadToFormspree(lead) {
  const endpoint = getFormspreeEndpoint();
  
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      service: lead.service,
      country: lead.country,
      message: lead.message || "N/A",
    }),
  });

  if (!response.ok) {
    throw new Error(`Formspree error: ${response.statusText}`);
  }

  return response.json();
}

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const service = String(data.get("service") || "").trim();
    const country = String(data.get("country") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !phone || !email || !service || !country) {
      statusEl.textContent = "Please fill all required fields.";
      statusEl.style.color = "#cc2936";
      return;
    }

    const lead = {
      name,
      phone,
      email,
      service,
      country,
      message,
    };

    if (!hasFormspreeConfig()) {
      statusEl.textContent = "Form is not yet configured. Please add your Formspree ID in script.js.";
      statusEl.style.color = "#cc2936";
      return;
    }

    statusEl.textContent = "Submitting your request...";
    statusEl.style.color = "#0f6dff";

    try {
      await submitLeadToFormspree(lead);
      statusEl.textContent = "Thank you! Your request has been submitted. We'll contact you soon.";
      statusEl.style.color = "#0e7a3f";
      form.reset();
    } catch (error) {
      statusEl.textContent = "Submission failed. Please try again.";
      statusEl.style.color = "#cc2936";
    }
  });
}

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

reveals.forEach((item) => observer.observe(item));
