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

// Free lead capture with Web3Forms (https://web3forms.com/)
// 1. Create account at web3forms.com
// 2. Create a form and copy your Access Key
// 3. Paste your Access Key below
const WEB3FORMS_ACCESS_KEY = "04d1c22f-1839-4af2-a77c-fa73d415d7ac";

function hasWeb3FormsConfig() {
  return WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY.trim().length > 0 && WEB3FORMS_ACCESS_KEY !== "YOUR_WEB3FORMS_ACCESS_KEY_HERE";
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

async function submitLeadToWeb3Forms(lead) {
  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY.trim(),
    subject: "New Consultation Request - SK Overseas",
    from_name: "SK Overseas Website",
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    service: lead.services.join(", "),
    country: lead.country,
    message: lead.message || "N/A",
  };

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
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

    throw new Error(`Web3Forms error: ${errorMessage}`);
  }

  const result = await response.json();
  if (!result?.success) {
    throw new Error(`Web3Forms error: ${result?.message || "Submission failed"}`);
  }

  return result;
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
        modalEmail.textContent = "info@skoverseasvisaconsultancy.com";
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

    if (!hasWeb3FormsConfig()) {
      statusEl.textContent = "Form is not yet configured. Please add your Web3Forms Access Key in script.js.";
      statusEl.style.color = "#cc2936";
      return;
    }

    statusEl.textContent = "Submitting your request...";
    statusEl.style.color = "#0f6dff";

    try {
      await submitLeadToWeb3Forms(lead);
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
