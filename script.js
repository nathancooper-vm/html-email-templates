let currentPlatform = null;
let currentTemplate = null;
let currentTemplatePath = null; // Array path like ['kickoff', 'intro-initial-a']
let availableTemplates = {};

// Load available templates on page load
function loadTemplates() {
    try {
        // Get templates from the embedded templates.js file
        availableTemplates = getAllTemplates();
        console.log('Loaded templates:', availableTemplates);
        // Default to SendGrid platform
        selectPlatform('sendgrid');
    } catch (error) {
        console.error('Error loading templates:', error);
    }
}

// Select platform from dropdown
function selectPlatform(platform) {
    currentPlatform = platform;
    currentTemplate = null;
    currentTemplatePath = null;
    
    // Update dropdown
    const select = document.getElementById('platform-select');
    if (select) {
        select.value = platform;
    }
    
    // Header is now static "Select Platform", no need to update
    
    // Clear active template links
    clearTemplateSelection();
    
    // Populate templates for selected platform
    populatePlatformTemplates(platform);
    
    // Show placeholder if no template selected
    if (!currentTemplate) {
        showPlaceholderMessage();
    }
}

function formatPlatformName(platform) {
    const names = {
        'auth0': 'Auth0',
        'sendgrid': 'SendGrid',
        'salesforce': 'Salesforce',
        'yesware': 'Yesware'
    };
    return names[platform] || platform;
}

// Populate templates for a platform, handling nested folders
function populatePlatformTemplates(platform) {
    const templateList = document.getElementById('template-list');
    if (!templateList) return;
    
    templateList.innerHTML = '';
    
    if (!platform || !availableTemplates[platform]) {
        return;
    }
    
    const platformTemplates = availableTemplates[platform];
    
    // Recursively build template list
    function buildTemplateList(items, parentList, parentPath = []) {
        Object.keys(items).sort().forEach(key => {
            const item = items[key];
            
            // Check if it's a folder (object) or template (string)
            if (typeof item === 'object' && item !== null && !item.match) {
                // It's a folder - create expandable folder item
                const folderLi = document.createElement('li');
                folderLi.className = 'folder-item';
                
                const folderDiv = document.createElement('div');
                folderDiv.className = 'folder-header';
                folderDiv.innerHTML = `
                    <span class="folder-icon">▶</span>
                    <span class="folder-name">${formatTemplateName(key)}</span>
                `;
                folderDiv.onclick = function() {
                    toggleFolder(folderLi);
                };
                
                const folderContent = document.createElement('ul');
                folderContent.className = 'folder-content';
                folderContent.style.display = 'none';
                
                // Recursively build nested items within this folder
                buildTemplateList(item, folderContent, [...parentPath, key]);
                
                folderLi.appendChild(folderDiv);
                folderLi.appendChild(folderContent);
                parentList.appendChild(folderLi);
            } else if (typeof item === 'string') {
                // It's a template - create template link
                const templatePath = [...parentPath, key];
                const templateLi = document.createElement('li');
                templateLi.className = 'template-item';
                
                const link = document.createElement('a');
                link.className = 'template-link';
                link.href = '#';
                link.textContent = formatTemplateName(key);
                link.onclick = function(e) {
                    e.preventDefault();
                    selectTemplate(platform, templatePath);
                };
                
                templateLi.appendChild(link);
                parentList.appendChild(templateLi);
            }
        });
    }
    
    buildTemplateList(platformTemplates, templateList);
}

function toggleFolder(folderItem) {
    const folderContent = folderItem.querySelector('.folder-content');
    const folderIcon = folderItem.querySelector('.folder-icon');
    
    if (folderContent.style.display === 'none') {
        folderContent.style.display = 'block';
        folderIcon.textContent = '▼';
        folderItem.classList.add('expanded');
    } else {
        folderContent.style.display = 'none';
        folderIcon.textContent = '▶';
        folderItem.classList.remove('expanded');
    }
}

function selectTemplate(platform, templatePath) {
    currentPlatform = platform;
    currentTemplatePath = templatePath;
    currentTemplate = templatePath.join('/');
    
    // Update active template link
    document.querySelectorAll('.template-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    updatePreview();
}

function clearTemplateSelection() {
    currentTemplate = null;
    currentTemplatePath = null;
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

// Get template using nested path
function getTemplateByPath(platform, pathArray) {
    let current = availableTemplates[platform];
    if (!current) return null;
    
    for (let i = 0; i < pathArray.length; i++) {
        current = current[pathArray[i]];
        if (!current) return null;
    }
    
    return typeof current === 'string' ? current : null;
}

function updatePreview() {
    if (!currentPlatform || !currentTemplatePath) {
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
        contentsList: "Your password reset request details...",
        email_address: "customer@example.com",
        social_x: "https://twitter.com/visitingmedia",
        social_facebook: "https://facebook.com/visitingmedia",
        social_instagram: "https://instagram.com/visitingmedia",
        social_linkedin: "https://linkedin.com/company/visitingmedia",
        social_youtube: "https://youtube.com/@visitingmedia"
    };

    try {
        // Get template content using nested path
        const templateHtml = getTemplateByPath(currentPlatform, currentTemplatePath);
        
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
                    
                    // Ensure body and html have no margins/padding
                    body.style.margin = '0';
                    body.style.padding = '0';
                    html.style.margin = '0';
                    html.style.padding = '0';
                    
                    // Get the actual content height
                    const contentHeight = Math.max(
                        body.scrollHeight,
                        body.offsetHeight,
                        html.clientHeight,
                        html.scrollHeight,
                        html.offsetHeight
                    );
                    
                    // Set iframe height to exact content size (includes the 32px bottom padding)
                    iframe.style.height = contentHeight + 'px';
                    
                    // Also update the preview content container height to match
                    previewContent.style.height = contentHeight + 'px';
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
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
