# Deployment Guide

This guide provides step-by-step instructions for deploying the Tutor Atlas Parent/Student Landing Page.

## Prerequisites

- A web hosting service (e.g., Netlify, Vercel, GitHub Pages, or traditional web server)
- Access to configure DNS for your subdomain (e.g., `student.tutoratlas.sg`)
- A form submission endpoint (e.g., Google Apps Script Web App)

## Quick Start

The landing page is a static site with no build process required. Simply copy all files to your web server.

## Deployment Options

### Option 1: Netlify (Recommended)

1. **Connect Repository**
   - Log in to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select `tutoratlas-parent` repository

2. **Configure Build Settings**
   - Build command: (leave empty)
   - Publish directory: `/` (root)
   - Click "Deploy site"

3. **Set Custom Domain**
   - Go to Site settings → Domain management
   - Add custom domain: `student.tutoratlas.sg`
   - Follow DNS configuration instructions

4. **Configure Form Submission**
   - Update `config.js` with your form endpoint URL
   - Commit and push changes

### Option 2: Vercel

1. **Import Project**
   - Log in to [Vercel](https://vercel.com)
   - Click "Add New" → "Project"
   - Import `tutoratlas-parent` from GitHub

2. **Configure Project**
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Click "Deploy"

3. **Set Custom Domain**
   - Go to Project Settings → Domains
   - Add domain: `student.tutoratlas.sg`
   - Configure DNS as instructed

4. **Configure Form Submission**
   - Update `config.js` with your form endpoint URL
   - Commit and push changes (auto-deploys)

### Option 3: GitHub Pages

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / (root)
   - Click "Save"

2. **Set Custom Domain**
   - Add custom domain: `student.tutoratlas.sg`
   - Configure DNS:
     - Add CNAME record pointing to `<username>.github.io`
     - Or A records pointing to GitHub Pages IPs

3. **Configure Form Submission**
   - Update `config.js` with your form endpoint URL
   - Commit and push changes

### Option 4: Traditional Web Server

1. **Upload Files**
   ```bash
   # Via SCP
   scp -r * user@server:/var/www/student.tutoratlas.sg/
   
   # Or via FTP/SFTP using FileZilla or similar
   ```

2. **Configure Web Server**
   
   **For Apache** (`.htaccess`):
   ```apache
   # Enable HTTPS redirect
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   
   # Set security headers
   Header set X-Content-Type-Options "nosniff"
   Header set X-Frame-Options "SAMEORIGIN"
   Header set X-XSS-Protection "1; mode=block"
   ```
   
   **For Nginx** (`/etc/nginx/sites-available/student.tutoratlas.sg`):
   ```nginx
   server {
       listen 80;
       server_name student.tutoratlas.sg;
       root /var/www/student.tutoratlas.sg;
       index index.html;
       
       location / {
           try_files $uri $uri/ =404;
       }
       
       # Security headers
       add_header X-Content-Type-Options "nosniff";
       add_header X-Frame-Options "SAMEORIGIN";
       add_header X-XSS-Protection "1; mode=block";
   }
   ```

3. **Configure SSL Certificate**
   ```bash
   # Using Let's Encrypt
   sudo certbot --nginx -d student.tutoratlas.sg
   ```

4. **Configure Form Submission**
   - Update `config.js` with your form endpoint URL
   - Re-upload `config.js`

## Setting Up Form Submission

The landing page requires a backend endpoint to receive form submissions. Here's how to set it up with Google Apps Script:

### Create Google Apps Script Web App

1. **Create New Script**
   - Go to [Google Apps Script](https://script.google.com)
   - Create a new project: "TutorAtlas Form Handler"

2. **Add Script Code**
   ```javascript
   function doPost(e) {
     try {
       // Parse JSON payload
       const data = JSON.parse(e.postData.contents);
       
       // Get or create spreadsheet
       const ss = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
       const sheet = ss.getSheetByName('Form Submissions') || ss.insertSheet('Form Submissions');
       
       // Add headers if first row is empty
       if (sheet.getLastRow() === 0) {
         sheet.appendRow([
           'Timestamp', 'Role', 'Age Group', 'Name', 'Parent WhatsApp', 
           'Parent Email', 'Student Telegram', 'Level', 'Subjects', 
           'Current Situation', 'Biggest Pain', 'Top Priority', 'Notes',
           'Call Opt-in', 'WTP Opt-in', 'Updates Opt-in', 
           'Consent General', 'Consent Minor', 'UTM Source', 'UTM Medium', 
           'UTM Campaign', 'Referrer', 'Device Type'
         ]);
       }
       
       // Append data
       sheet.appendRow([
         data.submitted_at_iso,
         data.role,
         data.age_group,
         data.name,
         data.parent_whatsapp,
         data.parent_email,
         data.student_telegram,
         data.level,
         data.subjects_needed,
         data.current_situation,
         data.biggest_pain,
         data.top_priority,
         data.optional_notes,
         data.call_opt_in,
         data.willingness_to_pay_opt_in,
         data.receive_updates_opt_in,
         data.consent_general,
         data.consent_minor,
         data.utm_source,
         data.utm_medium,
         data.utm_campaign,
         data.referrer,
         data.device_type
       ]);
       
       // Optional: Send email notification
       MailApp.sendEmail({
         to: 'hello@tutoratlas.sg',
         subject: 'New Landing Page Submission',
         body: `New submission from ${data.name} (${data.role})`
       });
       
       return ContentService.createTextOutput(JSON.stringify({success: true}))
         .setMimeType(ContentService.MimeType.JSON);
         
     } catch (error) {
       return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
         .setMimeType(ContentService.MimeType.JSON);
     }
   }
   ```

3. **Deploy as Web App**
   - Click "Deploy" → "New deployment"
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Click "Deploy"
   - Copy the Web App URL

4. **Update config.js**
   ```javascript
   window.TA_CONFIG = {
     SITE_NAME: "Tutor Atlas",
     CONTACT_EMAIL: "hello@tutoratlas.sg",
     DPO_EMAIL: "hello@tutoratlas.sg",
     PRIVACY_URL: "https://tutor.tutoratlas.sg/privacy.html",
     TERMS_URL: "https://tutor.tutoratlas.sg/terms.html",
     FORM_POST_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
   };
   ```

5. **Commit and Deploy**
   ```bash
   git add config.js
   git commit -m "[TutorAtlas] Configure form submission endpoint"
   git push origin main
   ```

## DNS Configuration

For subdomain `student.tutoratlas.sg`:

**CNAME Record** (recommended for most hosting):
```
Type:  CNAME
Name:  student
Value: <your-hosting-provider-domain>
TTL:   3600
```

**A Record** (for traditional hosting):
```
Type:  A
Name:  student
Value: <your-server-ip>
TTL:   3600
```

## Testing After Deployment

1. **Visual Check**
   - Visit `https://student.tutoratlas.sg`
   - Verify all sections render correctly
   - Check mobile responsiveness

2. **Interactive Features**
   - Test persona toggle (Parent/Guardian ↔ Student)
   - Test navigation anchor links
   - Test mobile menu

3. **Form Functionality**
   - Fill out form as Parent/Guardian
   - Fill out form as Student (under 18)
   - Verify validation rules work
   - Check form submission success

4. **Links and Configuration**
   - Verify privacy policy link works
   - Verify terms of use link works
   - Verify contact email link works
   - Check footer links

## Monitoring and Analytics

### Add Google Analytics (Optional)

Add before closing `</head>` in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Track Form Submissions

The form payload includes UTM parameters and referrer data for attribution tracking.

## Troubleshooting

### Form submission not working
- Check `FORM_POST_URL` is set in `config.js`
- Verify Google Apps Script is deployed with "Anyone" access
- Check browser console for errors

### CSS not loading
- Verify all paths are relative (no leading `/`)
- Check file permissions on server
- Clear browser cache

### Mobile menu not working
- Check JavaScript is enabled
- Verify `script.js` is loading
- Check browser console for errors

## Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **Form Validation**: Client-side validation is in place; add server-side validation in your form handler
3. **Rate Limiting**: Consider adding rate limiting to your form endpoint
4. **CORS**: Google Apps Script handles CORS automatically with `mode: 'no-cors'`

## Support

For deployment issues or questions:
- Email: hello@tutoratlas.sg
- Repository: https://github.com/ongjh000-lab/tutoratlas-parent
