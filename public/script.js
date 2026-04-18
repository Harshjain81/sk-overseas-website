const form = document.getElementById("consultation-form");
const statusEl = document.getElementById("form-status");
const yearEl = document.getElementById("year");
const callLinkEls = document.querySelectorAll(".call-link");
const contactModalEl = document.getElementById("contact-modal");
const contactModalCloseEls = document.querySelectorAll("[data-contact-modal-close]");
const copyButtonEls = document.querySelectorAll("[data-copy-target]");
const serviceDropdownEl = document.querySelector("[data-service-dropdown]");
const serviceTriggerEl = document.getElementById("service-trigger");
const serviceOptionEls = serviceDropdownEl
  ? Array.from(serviceDropdownEl.querySelectorAll('input[name="service"]'))
  : [];

// Free lead capture with Formspree (https://formspree.io/)
// 1. Create account at formspree.io
// 2. Create new form and copy the form ID
// 3. Paste your Formspree form ID below
const FORMSPREE_ID = "https://formspree.io/f/mjgjgnzy"; // Replace with your Formspree form URL or ID

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

  serviceTriggerEl.textContent = selected.map((item) => item.value).join(", ");
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

  const payload = new FormData();
  payload.append("name", lead.name);
  payload.append("phone", lead.phone);
  payload.append("email", lead.email);
  payload.append("service", lead.services.join(", "));
  lead.services.forEach((service) => payload.append("services[]", service));
  payload.append("country", lead.country);
  payload.append("message", lead.message || "N/A");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Accept": "application/json",
    },
    body: payload,
  });

  if (!response.ok) {
    let errorMessage = response.statusText;

    try {
      const errorData = await response.json();
      if (Array.isArray(errorData?.errors) && errorData.errors.length > 0) {
        errorMessage = errorData.errors
          .map((item) => {
            const field = item?.field ? `${item.field}: ` : "";
            return `${field}${item?.message || "Invalid value"}`;
          })
          .join(" | ");
      } else {
        errorMessage = errorData?.error || errorData?.message || errorMessage;
      }
    } catch (error) {
      try {
        errorMessage = await response.text();
      } catch (readError) {
        errorMessage = response.statusText;
      }
    }

    throw new Error(`Formspree error: ${errorMessage}`);
  }

  return response.json();
}

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

function isDesktopDevice() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function openContactModal() {
  if (!contactModalEl) {
    return;
  }

  contactModalEl.classList.add("open");
  contactModalEl.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeContactModal() {
  if (!contactModalEl) {
    return;
  }

  contactModalEl.classList.remove("open");
  contactModalEl.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

async function copyTextFromElement(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    return;
  }

  const text = element.textContent.trim();

  try {
    await navigator.clipboard.writeText(text);
    statusEl.textContent = `${text} copied to clipboard.`;
    statusEl.style.color = "#0e7a3f";
  } catch (error) {
    statusEl.textContent = "Copy failed. Please select the text manually.";
    statusEl.style.color = "#cc2936";
  }
}

if (contactModalCloseEls.length > 0) {
  contactModalCloseEls.forEach((item) => {
    item.addEventListener("click", closeContactModal);
  });
}

if (contactModalEl) {
  contactModalEl.addEventListener("click", (event) => {
    if (event.target === contactModalEl) {
      closeContactModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeContactModal();
  }
});

if (copyButtonEls.length > 0) {
  copyButtonEls.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-copy-target");
      if (targetId) {
        copyTextFromElement(targetId);
      }
    });
  });
}

if (callLinkEls.length > 0) {
  callLinkEls.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!isDesktopDevice()) {
        return;
      }

      event.preventDefault();
      const companyPhone = link.getAttribute("data-phone") || "+91 99999 99999";
      const modalPhone = document.getElementById("modal-phone");
      const modalEmail = document.getElementById("modal-email");

      if (modalPhone) {
        modalPhone.textContent = companyPhone;
      }

      if (modalEmail) {
        modalEmail.textContent = "info@skoverseas.com";
      }

      openContactModal();
    });
  });
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
      statusEl.textContent = error?.message ? error.message : "Submission failed. Please try again.";
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
