const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// API endpoint to get template content
app.get('/api/template/:platform/:filename', (req, res) => {
    const platform = req.params.platform;
    const filename = req.params.filename;
    const templatePath = path.join(__dirname, 'templates', platform, filename);
    
    // Security check - only allow HTML files and valid platforms
    if (!filename.endsWith('.html') || !['auth0', 'sendgrid'].includes(platform)) {
        return res.status(400).json({ error: 'Invalid platform or file type' });
    }
    
    fs.readFile(templatePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading template:', err);
            return res.status(404).json({ error: 'Template not found' });
        }
        
        res.setHeader('Content-Type', 'text/html');
        res.send(data);
    });
});

// API endpoint to process template with data
app.post('/api/preview/:platform/:filename', express.json(), (req, res) => {
    const platform = req.params.platform;
    const filename = req.params.filename;
    const templatePath = path.join(__dirname, 'templates', platform, filename);
    const data = req.body;
    
    // Security check - only allow HTML files and valid platforms
    if (!filename.endsWith('.html') || !['auth0', 'sendgrid'].includes(platform)) {
        return res.status(400).json({ error: 'Invalid platform or file type' });
    }
    
    fs.readFile(templatePath, 'utf8', (err, html) => {
        if (err) {
            console.error('Error reading template:', err);
            return res.status(404).json({ error: 'Template not found' });
        }
        
        // Replace template variables with provided data
        let processedHtml = html;
        
        // Replace common template variables
        processedHtml = processedHtml.replace(/\{\{\{subject\}\}\}/g, data.subject || '');
        processedHtml = processedHtml.replace(/\{\{home_url \| escape\}\}/g, data.home_url || '');
        processedHtml = processedHtml.replace(/\{\{logo_url \| escape\}\}/g, data.logo_url || '');
        processedHtml = processedHtml.replace(/\{\{code \| escape\}\}/g, data.code || '');
        processedHtml = processedHtml.replace(/\{\{url\}\}/g, data.url || '');
        processedHtml = processedHtml.replace(/\{\{friendly_name \| escape\}\}/g, data.friendly_name || '');
        processedHtml = processedHtml.replace(/\{\{support_url \| escape\}\}/g, data.support_url || '');
        processedHtml = processedHtml.replace(/\{\{contentsList\}\}/g, data.contentsList || '');
        
        // Handle conditional blocks (simplified)
        processedHtml = processedHtml.replace(/\{% if support_url != blank %\}[\s\S]*?\{\% endif %\}/g, 
            data.support_url ? 'through our <a href="' + data.support_url + '">Support Center</a>' : '');
        
        res.setHeader('Content-Type', 'text/html');
        res.send(processedHtml);
    });
});

// List available templates by platform
app.get('/api/templates', (req, res) => {
    const templatesDir = path.join(__dirname, 'templates');
    
    fs.readdir(templatesDir, (err, platforms) => {
        if (err) {
            console.error('Error reading templates directory:', err);
            return res.status(500).json({ error: 'Could not read templates directory' });
        }
        
        const result = {};
        
        // Process each platform directory
        const platformPromises = platforms.map(platform => {
            const platformPath = path.join(templatesDir, platform);
            
            return new Promise((resolve) => {
                fs.stat(platformPath, (err, stats) => {
                    if (err || !stats.isDirectory()) {
                        resolve();
                        return;
                    }
                    
                    fs.readdir(platformPath, (err, files) => {
                        if (err) {
                            resolve();
                            return;
                        }
                        
                        const htmlFiles = files.filter(file => file.endsWith('.html'));
                        result[platform] = htmlFiles;
                        resolve();
                    });
                });
            });
        });
        
        Promise.all(platformPromises).then(() => {
            res.json({ platforms: result });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Email template preview server running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/preview.html in your browser to preview templates`);
});
