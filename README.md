# Email Template Preview System

A comprehensive email template preview system for Auth0 and SendGrid platforms, featuring optimized templates with platform-specific email client compatibility.

## Live Preview

🌐 **View the live preview system**: https://nathancooper-vm.github.io/html-email-templates/

## Templates

### Auth0 Templates
- **change-password-code.html** - Password change email with verification code
- **change-password-link.html** - Password change email with reset link  
- **hospitality-cloud-join.html** - Hospitality Cloud user invitation
- **hospitality-cloud-password.html** - Hospitality Cloud password reset
- **multi-factor-authentication.html** - MFA verification email
- **saleshub-join.html** - SalesHub user invitation
- **saleshub-password.html** - SalesHub password reset
- **verification-email-code.html** - Email verification with code
- **verification-email-link.html** - Email verification with link
- **welcome.html** - Welcome email template

### SendGrid Templates
- **system-1.html** - System email template
- **system-detailed.html** - Detailed system notification
- **system-validation.html** - System validation email
- **marketing-1.html** - Marketing email template
- **marketing-2.html** - Marketing email template variant
- **marketing-3.html** - Marketing email template variant

## Email Client Compatibility

### Auth0 Templates
Auth0 templates include comprehensive **MSO (Microsoft Office) styles** for optimal Outlook compatibility:

- **MSO Table Properties**: `mso-table-lspace` and `mso-table-rspace` for proper table spacing
- **MSO Line Height**: `mso-line-height-rule: exactly` for consistent text rendering
- **Outlook Conditional Comments**: `<!--[if mso]>` blocks for Outlook-specific markup
- **Table-based Fallbacks**: Alternative table layouts for div-based verification codes
- **Outlook Group Fix**: `.outlook-group-fix` class for proper width handling

### SendGrid Templates  
SendGrid templates are **clean and optimized** for SendGrid's automatic email client optimization:

- **No MSO Styles**: Relies on SendGrid's "apply on send" feature
- **Automatic Optimization**: SendGrid handles Outlook compatibility automatically
- **Clean HTML**: Focused on modern email client compatibility

## Preview System

The preview system provides a convenient way to view and test email templates across both platforms.

### Features

- **Two-Level Navigation**: Accordion-style platform selection (Auth0/SendGrid) with template lists
- **Live Preview**: Real-time template rendering with sample data
- **Static Hosting**: GitHub Pages compatible - no server required
- **Cross-Platform Testing**: Compare Auth0 vs SendGrid template rendering
- **Mobile Responsive**: Desktop-optimized interface for template preview
- **Dynamic Resizing**: Preview containers automatically adjust to content size

### Template Variables

The templates support the following variables:

- `{{{subject}}}` - Email subject line
- `{{home_url | escape}}` - Home page URL
- `{{logo_url | escape}}` - Logo image URL
- `{{code | escape}}` - Verification code (for code template)
- `{{url}}` - Reset link URL (for link template)
- `{{friendly_name | escape}}` - Application friendly name
- `{{support_url | escape}}` - Support center URL
- `{{contentsList}}` - Additional content (for link template)

## Local Development

### Static Preview (Recommended)
For GitHub Pages compatible preview:

1. Start a local server:
   ```bash
   python3 -m http.server 8080
   ```

2. Open your browser:
   ```
   http://localhost:8080
   ```

### Node.js Preview (Legacy)
For server-side template processing:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the preview server:
   ```bash
   npm start
   ```

3. Open your browser:
   ```
   http://localhost:3000/preview.html
   ```

## File Structure

```
├── templates/
│   ├── auth0/                    # Auth0 templates with MSO styles
│   │   ├── change-password-code.html
│   │   ├── change-password-link.html
│   │   ├── hospitality-cloud-join.html
│   │   ├── hospitality-cloud-password.html
│   │   ├── multi-factor-authentication.html
│   │   ├── saleshub-join.html
│   │   ├── saleshub-password.html
│   │   ├── verification-email-code.html
│   │   ├── verification-email-link.html
│   │   └── welcome.html
│   └── sendgrid/                 # SendGrid templates (clean)
│       ├── system-1.html
│       ├── system-detailed.html
│       ├── system-validation.html
│       ├── marketing-1.html
│       ├── marketing-2.html
│       └── marketing-3.html
├── index.html                    # Main preview interface
├── styles.css                    # Preview system styles
├── script.js                     # Client-side template processing
├── templates.js                  # Generated template data
├── generate-templates.js         # Template generation script
├── server.js                     # Node.js preview server (legacy)
├── package.json                  # Dependencies
└── README.md                     # This file
```

## Usage

1. **View Live Preview**: Visit https://nathancooper-vm.github.io/html-email-templates/
2. **Local Development**: Run `python3 -m http.server 8080` and visit `http://localhost:8080`
3. **Template Selection**: Use the accordion navigation to browse Auth0 and SendGrid templates
4. **Preview Testing**: Compare how templates render across different platforms
5. **Deployment**: Copy template HTML for use in your email platform
