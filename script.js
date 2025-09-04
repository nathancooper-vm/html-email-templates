let currentPlatform = null;
let currentTemplate = null;
let availableTemplates = {};

// Load available templates on page load
function loadTemplates() {
    try {
        // Get templates from the embedded templates.js file
        availableTemplates = getAllTemplates();
        console.log('Loaded templates:', availableTemplates);
        populateNavigation();
    } catch (error) {
        console.error('Error loading templates:', error);
    }
}

function populateNavigation() {
    // Populate Auth0 templates
    const auth0List = document.getElementById('auth0-templates');
    auth0List.innerHTML = '';
    if (availableTemplates.auth0) {
        Object.keys(availableTemplates.auth0).forEach(template => {
            const li = document.createElement('li');
            li.className = 'template-item';
            const link = document.createElement('a');
            link.className = 'template-link';
            link.href = '#';
            link.textContent = formatTemplateName(template);
            link.onclick = (e) => {
                e.preventDefault();
                selectTemplate('auth0', template);
            };
            li.appendChild(link);
            auth0List.appendChild(li);
        });
    }

    // Populate SendGrid templates
    const sendgridList = document.getElementById('sendgrid-templates');
    sendgridList.innerHTML = '';
    if (availableTemplates.sendgrid) {
        Object.keys(availableTemplates.sendgrid).forEach(template => {
            const li = document.createElement('li');
            li.className = 'template-item';
            const link = document.createElement('a');
            link.className = 'template-link';
            link.href = '#';
            link.textContent = formatTemplateName(template);
            link.onclick = (e) => {
                e.preventDefault();
                selectTemplate('sendgrid', template);
            };
            li.appendChild(link);
            sendgridList.appendChild(li);
        });
    }
}

function toggleAccordion(platform) {
    const content = document.getElementById(platform + '-content');
    const header = content.previousElementSibling;
    
    // Toggle the accordion
    if (content.classList.contains('open')) {
        content.classList.remove('open');
        header.classList.remove('active');
        // If no template is selected, show placeholder
        if (!currentTemplate) {
            showPlaceholderMessage();
        }
    } else {
        // Close other accordions
        document.querySelectorAll('.accordion-content').forEach(acc => {
            acc.classList.remove('open');
        });
        document.querySelectorAll('.accordion-header').forEach(hdr => {
            hdr.classList.remove('active');
        });
        
        // Open this accordion
        content.classList.add('open');
        header.classList.add('active');
        
        // Clear template selection when switching platforms
        clearTemplateSelection();
        
        // Show placeholder message
        showPlaceholderMessage();
    }
}

function selectTemplate(platform, template) {
    currentPlatform = platform;
    currentTemplate = template;
    
    // Update active template link
    document.querySelectorAll('.template-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Make sure the platform accordion is open
    const content = document.getElementById(platform + '-content');
    const header = content.previousElementSibling;
    if (!content.classList.contains('open')) {
        toggleAccordion(platform);
    }
    
    updatePreview();
}

function clearTemplateSelection() {
    currentTemplate = null;
    // Remove active state from all template links
    document.querySelectorAll('.template-link').forEach(link => {
        link.classList.remove('active');
    });
}

function formatTemplateName(filename) {
    // Convert filename to a more readable format
    return filename
        .replace('.html', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

function showPlaceholderMessage() {
    const iframe = document.getElementById('previewFrame');
    const previewContent = iframe.parentElement;
    
    iframe.srcdoc = `
        <html>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; height: 100vh;">
                <div style="text-align: center; color: #6c757d;">
                    <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Select a template to preview</h2>
                    <p style="margin: 0; font-size: 16px;">Choose a template from the options above to see the email preview</p>
                </div>
            </body>
        </html>
    `;
    
    // Reset container heights to fit placeholder content
    iframe.style.height = 'auto';
    previewContent.style.height = 'fit-content';
}

function processTemplate(templateHtml, data) {
    let processedHtml = templateHtml;
    
    // Replace template variables with sample data
    Object.keys(data).forEach(key => {
        const value = data[key];
        const regex = new RegExp(`{{${key}\\s*\\|\\s*escape}}`, 'g');
        processedHtml = processedHtml.replace(regex, value);
        
        // Also handle simple {{key}} format
        const simpleRegex = new RegExp(`{{${key}}}`, 'g');
        processedHtml = processedHtml.replace(simpleRegex, value);
    });

    // Handle conditional blocks
    processedHtml = processedHtml.replace(/{%\s*if\s+code\s*%}([\s\S]*?){%\s*endif\s*%}/g, (match, content) => {
        return data.code ? content : '';
    });

    processedHtml = processedHtml.replace(/{%\s*if\s+url\s*%}([\s\S]*?){%\s*endif\s*%}/g, (match, content) => {
        return data.url ? content : '';
    });

    return processedHtml;
}

function updatePreview() {
    if (!currentPlatform || !currentTemplate) {
        return;
    }

    const iframe = document.getElementById('previewFrame');
    const previewContent = iframe.parentElement;
    
    // Reset heights before loading new content to ensure proper sizing
    iframe.style.height = 'auto';
    previewContent.style.height = 'fit-content';
    
    // Use default sample data
    const data = {
        subject: "Password Change Request",
        home_url: "https://example.com",
        logo_url: "https://cdn.auth0.com/website/emails/product/icon-password.png",
        code: "123456",
        url: "https://example.com/reset-password?token=abc123",
        friendly_name: "Your App",
        support_url: "https://example.com/support",
        contentsList: "Your password reset request details..."
    };

    try {
        // Get template content from embedded templates
        const templateHtml = getTemplate(currentPlatform, currentTemplate);
        
        if (templateHtml) {
            // Process the template with sample data
            const processedHtml = processTemplate(templateHtml, data);
            
            // Write to iframe
            iframe.srcdoc = processedHtml;
            
            // Auto-resize iframe to content height
            iframe.onload = function() {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const body = iframeDoc.body;
                    const html = iframeDoc.documentElement;
                    
                    // Get the actual content height
                    const contentHeight = Math.max(
                        body.scrollHeight,
                        body.offsetHeight,
                        html.clientHeight,
                        html.scrollHeight,
                        html.offsetHeight
                    );
                    
                    // Set iframe height to content size with extra buffer to prevent scrollbars
                    iframe.style.height = (contentHeight + 64) + 'px'; // Add 64px buffer
                    
                    // Also update the preview content container height
                    previewContent.style.height = (contentHeight + 128) + 'px'; // 64px padding + 64px buffer
                } catch (e) {
                    // Fallback if cross-origin issues occur
                    iframe.style.height = 'auto';
                }
            };
        } else {
            iframe.srcdoc = '<html><body><p style="color: red; padding: 20px;">Template not found.</p></body></html>';
        }
    } catch (error) {
        console.error('Error loading template:', error);
        iframe.srcdoc = '<html><body><p style="color: red; padding: 20px;">Error loading template.</p></body></html>';
    }
}

// Initialize the application
function init() {
    loadTemplates();
    
    // Default to SendGrid platform (but no template selected)
    if (availableTemplates.sendgrid) {
        // Open SendGrid accordion by default
        const sendgridContent = document.getElementById('sendgrid-content');
        const sendgridHeader = sendgridContent.previousElementSibling;
        sendgridContent.classList.add('open');
        sendgridHeader.classList.add('active');
        
        // Show placeholder message
        showPlaceholderMessage();
    } else {
        // Fallback to first available platform
        const platforms = Object.keys(availableTemplates);
        if (platforms.length > 0) {
            const firstPlatform = platforms[0];
            const content = document.getElementById(firstPlatform + '-content');
            const header = content.previousElementSibling;
            content.classList.add('open');
            header.classList.add('active');
            showPlaceholderMessage();
        }
    }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
