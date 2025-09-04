const fs = require('fs');
const path = require('path');

// Function to recursively read all HTML files in a directory
function readTemplates(dir) {
    const templates = {};
    
    if (!fs.existsSync(dir)) {
        return templates;
    }
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            templates[item] = readTemplates(fullPath);
        } else if (item.endsWith('.html')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const name = item.replace('.html', '');
            templates[name] = content;
        }
    }
    
    return templates;
}

// Read all templates
const allTemplates = readTemplates('./templates');

// Generate the JavaScript file
const jsContent = `// Auto-generated templates file
// This file contains all email templates for the preview system

const TEMPLATES = ${JSON.stringify(allTemplates, null, 2)};

// Function to get template content
function getTemplate(platform, templateName) {
    if (TEMPLATES[platform] && TEMPLATES[platform][templateName]) {
        return TEMPLATES[platform][templateName];
    }
    return null;
}

// Function to get all available templates
function getAllTemplates() {
    return TEMPLATES;
}

// Function to get templates for a specific platform
function getTemplatesForPlatform(platform) {
    if (TEMPLATES[platform]) {
        return Object.keys(TEMPLATES[platform]);
    }
    return [];
}

// Make functions available globally
window.getTemplate = getTemplate;
window.getAllTemplates = getAllTemplates;
window.getTemplatesForPlatform = getTemplatesForPlatform;
window.TEMPLATES = TEMPLATES;
`;

// Write the file
fs.writeFileSync('./templates.js', jsContent);
console.log('Generated templates.js successfully!');
console.log('Found templates:', Object.keys(allTemplates));
