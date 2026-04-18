const form = document.getElementById("consultation-form");
const statusEl = document.getElementById("form-status");
const yearEl = document.getElementById("year");
const serviceDropdownEl = document.querySelector("[data-service-dropdown]");
const serviceTriggerEl = document.getElementById("service-trigger");
const serviceOptionEls = serviceDropdownEl
  ? Array.from(serviceDropdownEl.querySelectorAll('input[name="service"]'))
  : [];

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

function updateServiceTriggerText() {
  if (!serviceTriggerEl) {
    return;
  }

  const selected = serviceOptionEls.filter((item) => item.checked);
  if (selected.length === 0) {
    serviceTriggerEl.textContent = "Select one or more services";
    serviceTriggerEl.classList.remove("has-selection");
    return;
  }

  serviceTriggerEl.textContent = `${selected.length} service${selected.length > 1 ? "s" : ""} selected`;
  serviceTriggerEl.classList.add("has-selection");
}

if (serviceDropdownEl && serviceTriggerEl) {
  serviceTriggerEl.addEventListener("click", () => {
    const shouldOpen = !serviceDropdownEl.classList.contains("open");
    serviceDropdownEl.classList.toggle("open", shouldOpen);
    serviceTriggerEl.setAttribute("aria-expanded", String(shouldOpen));
  });

  document.addEventListener("click", (event) => {
    if (!serviceDropdownEl.contains(event.target)) {
      serviceDropdownEl.classList.remove("open");
      serviceTriggerEl.setAttribute("aria-expanded", "false");
    }
  });

  serviceOptionEls.forEach((item) => {
    item.addEventListener("change", updateServiceTriggerText);
  });

  updateServiceTriggerText();
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
      service: lead.services.join(", "),
      services: lead.services,
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
    const services = data
      .getAll("service")
      .map((value) => String(value).trim())
      .filter((value) => value.length > 0);
    const country = String(data.get("country") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !phone || !email || services.length === 0 || !country) {
      statusEl.textContent = "Please fill all required fields.";
      statusEl.style.color = "#cc2936";
      return;
    }

    const lead = {
      name,
      phone,
      email,
      services,
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
      updateServiceTriggerText();
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
