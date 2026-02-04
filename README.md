# Tutor Atlas Parent/Student Landing Page

A static landing page for Singapore parents and students seeking home/private tuition services. Built with vanilla HTML, CSS, and JavaScript—no frameworks, no build tools.

## Overview

This landing page is designed to:
- Match the premium, calm, fuss-free aesthetic of the Tutor Atlas tutor landing page
- Capture parent/student interest in early access to the Tutor Atlas platform
- Validate product-market fit signals for MVP features
- Be fully portable and deployable to any subdomain (e.g., `student.tutoratlas.sg`)

## Features

- **Mobile-first responsive design** with sticky navigation
- **Persona toggle** (Parent/Guardian vs Student) with dynamic content
- **Comprehensive contact form** with inline validation
- **Strict copy implementation** from PRD
- **Single source of truth configuration** via `config.js`
- **No external dependencies** (except Google Fonts)

## File Structure

```
tutoratlas-parent/
├── index.html          # Main landing page
├── styles.css          # All styles (premium, calm aesthetic)
├── script.js           # Form validation, submission, interactivity
├── config.js           # Single source of truth for URLs and emails
├── assets/             # Images and icons (lightweight)
└── README.md           # This file
```

## Configuration

All site-wide constants are defined in `config.js`:

```javascript
window.TA_CONFIG = {
  SITE_NAME: "Tutor Atlas",
  CONTACT_EMAIL: "hello@tutoratlas.sg",
  DPO_EMAIL: "hello@tutoratlas.sg",
  PRIVACY_URL: "https://tutor.tutoratlas.sg/privacy.html",
  TERMS_URL: "https://tutor.tutoratlas.sg/terms.html",
  FORM_POST_URL: ""  // Set this to your form endpoint (e.g., Google Apps Script)
};
```

### Setting up form submission

1. Create a Google Apps Script Web App or similar endpoint
2. Update `FORM_POST_URL` in `config.js` with your endpoint URL
3. The form will POST JSON data to this endpoint (see payload schema below)

If `FORM_POST_URL` is empty, the submit button will be disabled and a fallback message will display.

## Form Payload Schema

The form submits JSON with the following structure:

```json
{
  "submitted_at_iso": "2026-02-04T10:30:00.000Z",
  "role": "parent|student",
  "age_group": "under_18|18_plus|null",
  "name": "string",
  "parent_whatsapp": "string|null",
  "parent_email": "string|null",
  "student_telegram": "string|null",
  "level": "primary|secondary|jc|ib|other",
  "subjects_needed": "string|null",
  "current_situation": "have_tutor|looking|not_sure",
  "biggest_pain": "verify_quality|progress_clarity|rescheduling|payments|outside_network|adhoc_exam|other",
  "top_priority": "scheduler|payments|records|marketplace_direct|marketplace_adhoc",
  "optional_notes": "string|null",
  "call_opt_in": true|false,
  "willingness_to_pay_opt_in": true|false,
  "receive_updates_opt_in": true|false,
  "consent_general": true,
  "consent_minor": true|false|null,
  "utm_source": "string|null",
  "utm_medium": "string|null",
  "utm_campaign": "string|null",
  "referrer": "string|null",
  "device_type": "mobile|tablet|desktop|unknown"
}
```

## Validation Rules

- **Parent/Guardian**: Requires WhatsApp OR Email
- **Student**: Requires Telegram handle
- **Student under 18**: Requires guardian WhatsApp OR Email + minor consent checkbox
- **All users**: Requires general consent checkbox

## Deployment

### Option 1: Simple file hosting
1. Copy all files to your web server
2. Point subdomain to the directory
3. Done!

### Option 2: GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set custom domain if needed

### Option 3: Netlify/Vercel
1. Connect repository to Netlify or Vercel
2. Deploy with default settings (no build command needed)
3. Set custom domain

## Design Principles

- **Premium, calm, fuss-free**: No loud gradients, no hype, no fear-based marketing
- **Mobile-first**: Large tap targets (min 48px), comfortable one-handed use
- **Clear hierarchy**: Generous whitespace, logical flow
- **Repeated CTAs**: Multiple opportunities to scroll to form
- **Warm palette**: Off-white background, slate/blue-grey primary, amber accent

## Brand Guidelines

- **Brand name**: Always "Tutor Atlas" (two words, title case)
- **Never**: "TutorAtlas" (one word) in UI copy
- **Positioning**: "We are not a tuition agency. We're a tech-first app."
- **Vision**: "The Grab for home tuition" (direct marketplace without middlemen)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

## Performance

- Lightweight design (no heavy JS libraries)
- Optimized for fast load times
- Google Fonts loaded with `display=swap` for better perceived performance

## Privacy & Compliance

- Links to existing privacy policy and terms of use
- Clear consent mechanisms
- No collection of sensitive personal data (NRIC, full DOB, home address, school name)
- DPO contact information provided

## Support

For questions or issues, contact: hello@tutoratlas.sg

## License

Proprietary - All rights reserved by Tutor Atlas
