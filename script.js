console.log("Script loaded");
// ===========================
// Initialize on DOM load
// ===========================
document.addEventListener('DOMContentLoaded', function() {
  initializeConfig();
  initializeNavigation();
  initializePersonaToggle();
  initializeForm();
});

// ===========================
// Config Injection
// ===========================
function initializeConfig() {
  // Inject config values into DOM
  const dpoLink = document.getElementById('dpo-link');
  const privacyLink = document.getElementById('privacy-link');
  const termsLink = document.getElementById('terms-link');
  const footerPrivacyLink = document.getElementById('footer-privacy-link');
  const footerTermsLink = document.getElementById('footer-terms-link');
  const footerContactLink = document.getElementById('footer-contact-link');
  const contactEmailLink = document.getElementById('contact-email-link');
  
  if (dpoLink) {
    dpoLink.href = `mailto:${window.TA_CONFIG.DPO_EMAIL}`;
  }
  
  if (privacyLink) {
    privacyLink.href = window.TA_CONFIG.PRIVACY_URL;
  }
  
  if (termsLink) {
    termsLink.href = window.TA_CONFIG.TERMS_URL;
  }
  
  if (footerPrivacyLink) {
    footerPrivacyLink.href = window.TA_CONFIG.PRIVACY_URL;
  }
  
  if (footerTermsLink) {
    footerTermsLink.href = window.TA_CONFIG.TERMS_URL;
  }
  
  if (footerContactLink) {
    footerContactLink.href = `mailto:${window.TA_CONFIG.CONTACT_EMAIL}`;
  }
  
  if (contactEmailLink) {
    contactEmailLink.href = `mailto:${window.TA_CONFIG.CONTACT_EMAIL}`;
    contactEmailLink.textContent = window.TA_CONFIG.CONTACT_EMAIL;
  }
  
  // Check if form submission is configured
  if (!window.TA_CONFIG.FORM_POST_URL) {
    document.getElementById('fallback-message').style.display = 'block';
    document.getElementById('submit-btn').disabled = true;
  }
}

// ===========================
// Navigation
// ===========================
function initializeNavigation() {
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const nav = document.getElementById('nav');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking nav links
  const navLinks = document.querySelectorAll('#nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      nav.classList.remove('active');
    });
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Scroll to join section
function scrollToJoin() {
  const joinSection = document.getElementById('join');
  if (joinSection) {
    const headerOffset = 80;
    const elementPosition = joinSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// ===========================
// Persona Toggle
// ===========================
function initializePersonaToggle() {
  const personaTabs = document.querySelectorAll('.persona-tab');
  const parentBullets = document.getElementById('parent-bullets');
  const studentBullets = document.getElementById('student-bullets');
  
  personaTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      personaTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Toggle bullets
      const persona = this.getAttribute('data-persona');
      if (persona === 'parent') {
        parentBullets.classList.add('active');
        studentBullets.classList.remove('active');
      } else {
        studentBullets.classList.add('active');
        parentBullets.classList.remove('active');
      }
    });
  });
}

// ===========================
// Form Handling
// ===========================
function initializeForm() {
  const form = document.getElementById('contact-form');
  const roleInputs = document.querySelectorAll('input[name="role"]');
  const ageGroupInputs = document.querySelectorAll('input[name="age_group"]');
  
  // Role change handler
  roleInputs.forEach(input => {
    input.addEventListener('change', handleRoleChange);
  });
  
  // Age group change handler
  ageGroupInputs.forEach(input => {
    input.addEventListener('change', handleAgeGroupChange);
  });
  
  // Form submission
  form.addEventListener('submit', handleFormSubmit);
  
  // Clear error on input
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      clearError(this);
    });
  });
}

function handleRoleChange() {
  const role = document.querySelector('input[name="role"]:checked')?.value;
  const ageGroupField = document.getElementById('age-group-field');
  const studentTelegramField = document.getElementById('student-telegram-field');
  const parentWhatsappField = document.getElementById('parent-whatsapp-field');
  const parentEmailField = document.getElementById('parent-email-field');
  
  if (role === 'student') {
    ageGroupField.style.display = 'block';
    studentTelegramField.style.display = 'block';
    document.getElementById('student_telegram').required = true;
  } else {
    ageGroupField.style.display = 'none';
    studentTelegramField.style.display = 'none';
    document.getElementById('student_telegram').required = false;
    
    // Hide minor consent if switching from student
    document.getElementById('minor-consent-field').style.display = 'none';
    document.getElementById('consent_minor').required = false;
    
    // Reset age group
    const ageGroupInputs = document.querySelectorAll('input[name="age_group"]');
    ageGroupInputs.forEach(input => input.checked = false);
  }
}

function handleAgeGroupChange() {
  const role = document.querySelector('input[name="role"]:checked')?.value;
  const ageGroup = document.querySelector('input[name="age_group"]:checked')?.value;
  const minorConsentField = document.getElementById('minor-consent-field');
  
  if (role === 'student' && ageGroup === 'under_18') {
    minorConsentField.style.display = 'block';
    document.getElementById('consent_minor').required = true;
  } else {
    minorConsentField.style.display = 'none';
    document.getElementById('consent_minor').required = false;
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  // Clear previous messages
  document.getElementById('form-message').className = 'form-message';
  document.getElementById('form-message').textContent = '';
  
  // Validate form
  if (!validateForm()) {
    return;
  }
  
  // Build payload
  const payload = buildPayload();
  
  // Submit form
  submitForm(payload);
}

function validateForm() {
  let isValid = true;
  
  // Clear all errors
  document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  
  // Role
  const role = document.querySelector('input[name="role"]:checked')?.value;
  if (!role) {
    showError('role-error', 'Please select your role');
    isValid = false;
  }
  
  // Name
  const name = document.getElementById('name').value.trim();
  if (!name) {
    showError('name-error', 'Please enter your name');
    document.getElementById('name').classList.add('error');
    isValid = false;
  }
  
  // Parent/Guardian validation
  if (role === 'parent') {
    const whatsapp = document.getElementById('parent_whatsapp').value.trim();
    const email = document.getElementById('parent_email').value.trim();
    
    if (!whatsapp && !email) {
      showError('parent-whatsapp-error', 'Please provide WhatsApp OR Email');
      showError('parent-email-error', 'Please provide WhatsApp OR Email');
      document.getElementById('parent_whatsapp').classList.add('error');
      document.getElementById('parent_email').classList.add('error');
      isValid = false;
    }
  }
  
  // Student validation
  if (role === 'student') {
    const ageGroup = document.querySelector('input[name="age_group"]:checked')?.value;
    if (!ageGroup) {
      showError('age-group-error', 'Please select your age group');
      isValid = false;
    }
    
    const telegram = document.getElementById('student_telegram').value.trim();
    if (!telegram) {
      showError('student-telegram-error', 'Please enter your Telegram handle');
      document.getElementById('student_telegram').classList.add('error');
      isValid = false;
    }
    
    // Student under 18 validation
    if (ageGroup === 'under_18') {
      const guardianWhatsapp = document.getElementById('parent_whatsapp').value.trim();
      const guardianEmail = document.getElementById('parent_email').value.trim();
      
      if (!guardianWhatsapp && !guardianEmail) {
        showError('parent-whatsapp-error', 'Guardian WhatsApp OR Email required for under 18');
        showError('parent-email-error', 'Guardian WhatsApp OR Email required for under 18');
        document.getElementById('parent_whatsapp').classList.add('error');
        document.getElementById('parent_email').classList.add('error');
        isValid = false;
      }
      
      const minorConsent = document.getElementById('consent_minor').checked;
      if (!minorConsent) {
        showError('consent-minor-error', 'Guardian consent is required for students under 18');
        isValid = false;
      }
    }
  }
  
  // General consent
  const generalConsent = document.getElementById('consent_general').checked;
  if (!generalConsent) {
    showError('consent-general-error', 'You must consent to continue');
    isValid = false;
  }
  
  return isValid;
}

function buildPayload() {
  const role = document.querySelector('input[name="role"]:checked')?.value || null;
  const ageGroup = document.querySelector('input[name="age_group"]:checked')?.value || null;
  
  const payload = {
    submitted_at_iso: new Date().toISOString(),
    role: role,
    age_group: ageGroup,
    name: document.getElementById('name').value.trim(),
    parent_whatsapp: document.getElementById('parent_whatsapp').value.trim() || null,
    parent_email: document.getElementById('parent_email').value.trim() || null,
    student_telegram: document.getElementById('student_telegram').value.trim() || null,
    level: document.getElementById('level').value || null,
    subjects_needed: document.getElementById('subjects_needed').value.trim() || null,
    current_situation: document.getElementById('current_situation').value || null,
    biggest_pain: document.getElementById('biggest_pain').value || null,
    top_priority: document.getElementById('top_priority').value || null,
    optional_notes: document.getElementById('optional_notes').value.trim() || null,
    call_opt_in: document.getElementById('call_opt_in').checked,
    willingness_to_pay_opt_in: document.getElementById('willingness_to_pay_opt_in').checked,
    receive_updates_opt_in: document.getElementById('receive_updates_opt_in').checked,
    consent_general: document.getElementById('consent_general').checked,
    consent_minor: role === 'student' && ageGroup === 'under_18' ? document.getElementById('consent_minor').checked : null,
    utm_source: getQueryParam('utm_source'),
    utm_medium: getQueryParam('utm_medium'),
    utm_campaign: getQueryParam('utm_campaign'),
    referrer: document.referrer || null,
    device_type: getDeviceType()
  };
  
  return payload;
}

function submitForm(payload) {
  const submitBtn = document.getElementById('submit-btn');
  const formMessage = document.getElementById('form-message');
  
  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  
  // If no form post URL configured, show fallback
  if (!window.TA_CONFIG.FORM_POST_URL) {
    formMessage.className = 'form-message error';
    formMessage.textContent = `Form submission is not configured. Please email us at ${window.TA_CONFIG.CONTACT_EMAIL}`;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
    return;
  }
  
  // Submit via fetch
  fetch(window.TA_CONFIG.FORM_POST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      formMessage.className = 'form-message success';
      formMessage.textContent = 'Thank you! We\'ll reply within 48 hours.';
      
      // Reset form
      document.getElementById('contact-form').reset();
      
      // Hide conditional fields
      document.getElementById('age-group-field').style.display = 'none';
      document.getElementById('student-telegram-field').style.display = 'none';
      document.getElementById('minor-consent-field').style.display = 'none';
    } else {
      formMessage.className = 'form-message error';
      formMessage.textContent = 'Something went wrong. Please try again or email us at ' + window.TA_CONFIG.CONTACT_EMAIL;
      console.error('Form submission error:', data.error);
    }
    
    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  })
  .catch(error => {
    formMessage.className = 'form-message error';
    formMessage.textContent = 'Something went wrong. Please try again or email us at ' + window.TA_CONFIG.CONTACT_EMAIL;
    
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
    
    console.error('Form submission error:', error);
  });
}

// ===========================
// Utility Functions
// ===========================
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

function clearError(input) {
  input.classList.remove('error');
  const formGroup = input.closest('.form-group');
  if (formGroup) {
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.classList.remove('show');
    }
  }
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || null;
}

function getDeviceType() {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// Make scrollToJoin available globally
window.scrollToJoin = scrollToJoin;
