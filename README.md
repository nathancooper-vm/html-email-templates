# Auth0 SendGrid Email Templates

This project contains SendGrid-compatible email templates for Auth0 password change workflows, along with a preview system for testing and customization.

## Templates

### Auth0 Templates
- **changepasssword-code.html** - Password change email with verification code
- **changepasssword-link.html** - Password change email with reset link

### SendGrid Templates
- **system1.html** - System email template

## Preview System

The preview system allows you to view and test your email templates with sample data before deploying them to SendGrid.

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the preview server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000/preview.html
   ```

### Features

- **Two-Level Navigation**: First select a platform (Auth0 or SendGrid), then choose a template
- **Dynamic Template Loading**: Automatically discovers templates in platform subdirectories
- **Live Preview**: See how your templates look with sample data
- **Customizable Data**: Edit sample data to test different scenarios
- **Responsive Design**: Preview how emails look on different screen sizes
- **Real-time Updates**: Changes to sample data update the preview immediately

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

### SendGrid Integration

These templates are optimized for SendGrid with:

- Proper HTML structure and DOCTYPE
- Inline CSS for maximum email client compatibility
- Mobile-responsive design
- Outlook-compatible styling
- Proper table-based layout for email clients

### Development

To modify templates:

1. Edit the HTML files in the `templates/` directory
2. Use the preview system to test changes
3. Deploy to SendGrid when ready

### File Structure

```
├── templates/
│   ├── auth0/
│   │   ├── changepasssword-code.html
│   │   └── changepasssword-link.html
│   └── sendgrid/
│       └── system1.html
├── preview.html          # Preview interface
├── server.js            # Preview server
├── package.json         # Dependencies
└── README.md           # This file
```

## Usage

1. Start the preview server: `npm start`
2. Open `http://localhost:3000/preview.html`
3. Select a template and customize the sample data
4. Copy the processed HTML for use in SendGrid
