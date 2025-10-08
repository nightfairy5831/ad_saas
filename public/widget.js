/**
 * Ad Personalization Widget
 * Reads UTM parameters, calls API for personalized content, updates DOM elements
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        apiEndpoint: 'https://adfunnels-puce.vercel.app/api/v1/content',
        eventEndpoint: 'https://adfunnels-puce.vercel.app/api/v1/event',
        debug: true
    };

    // Global state
    let currentSegment = null;
    let siteId = null;
    let isHoldout = Math.random() < 0.05; // 5% holdout

    // Utility functions
    function log(message, ...args) {
        if (CONFIG.debug) {
            console.log(`[CopyAI Widget] ${message}`, ...args);
        }
    }

    function error(message, ...args) {
        console.error(`[CopyAI Widget] ${message}`, ...args);
    }


    function extractSiteId() {
        if (window.data_site_id) {
            siteId = window.data_site_id;
            log('Site ID found from global variable:', siteId);
        } else {
            error('No Site ID found. Please set: window.data_site_id="your_site_id"');
        }
        return siteId;
    }

    // UTM Parameter extraction
    function getURLParameters() {
        const params = new URLSearchParams(window.location.search);
        const utmParams = {};

        // All 5 standard UTM parameters
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
            const value = params.get(param);
            if (value) {
                utmParams[param] = value;
                log(`Found ${param}:`, value);
            }
        });

        return utmParams;
    }


    // API calls
    async function callAPI(url, data) {
        try {
            log(`Calling API: ${url}`, data);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Site-ID': siteId || 'unknown'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            log('API response:', result);
            return result;
        } catch (err) {
            error(`API call failed:`, err);
            throw err;
        }
    }

    // Content fetching
    async function fetchPersonalizedContent() {
        if (isHoldout) {
            log('User is in holdout group, skipping personalization');
            return null;
        }

        const utmParams = getURLParameters();

        const requestData = {
            ...utmParams,
            site_id: siteId,
            url: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        };

        try {
            const content = await callAPI(CONFIG.apiEndpoint, requestData);
            currentSegment = content.segment;
            return content;
        } catch (err) {
            error('Failed to fetch personalized content:', err);
            return null;
        }
    }

    // DOM manipulation
    function updateDOMElements(content) {
        if (!content || !content.blocks) {
            log('No content blocks to update');
            return;
        }

        let elementsUpdated = 0;
        const { blocks } = content;

        // Helper function to replace entire target element with new content
        function replaceTargetElement(targetElement, text, styles, elementType) {
            // Get the original classes and basic structure
            const originalClasses = targetElement.className;
            const originalId = targetElement.id;

            // Create new content based on element type
            let newContent = '';

            if (styles) {
                // Backend provided styles - use them
                if (elementType === 'headline') {
                    newContent = `<div><h1><span style="${styles}">${text}</span></h1></div>`;
                } else if (elementType === 'subheadline') {
                    newContent = `<div><h2><span style="${styles}">${text}</span></h2></div>`;
                } else if (elementType === 'button') {
                    newContent = `<span style="${styles}">${text}</span>`;
                } else if (elementType === 'textblock') {
                    newContent = `<div><p><span style="${styles}">${text}</span></p></div>`;
                }
            } else {
                // No backend styles - preserve first element's style but replace content completely
                const firstElement = targetElement.querySelector('h1, h2, h3, h4, h5, h6, p, span');
                if (firstElement) {
                    const computedStyle = window.getComputedStyle(firstElement);
                    const preservedStyles = [
                        'color', 'font-family', 'font-size', 'font-weight',
                        'font-style', 'text-decoration', 'text-align'
                    ].map(prop => `${prop}: ${computedStyle.getPropertyValue(prop)}`).join('; ');

                    const tagName = firstElement.tagName.toLowerCase();
                    newContent = `<div><${tagName} style="${preservedStyles}">${text}</${tagName}></div>`;
                } else {
                    // Fallback - create basic structure
                    if (elementType === 'headline') {
                        newContent = `<div><h1>${text}</h1></div>`;
                    } else if (elementType === 'subheadline') {
                        newContent = `<div><h2>${text}</h2></div>`;
                    } else if (elementType === 'button') {
                        newContent = `${text}`;
                    } else if (elementType === 'textblock') {
                        newContent = `<div><p>${text}</p></div>`;
                    }
                }
            }

            // Replace the entire content
            targetElement.innerHTML = newContent;
        }

        // Helper function to extract text and styles from TextWithStyle or string
        const extractTextAndStyles = (value) => {
            if (typeof value === 'string') {
                // Try to parse as JSON first (in case backend returns stringified JSON)
                try {
                    const parsed = JSON.parse(value);
                    if (parsed && typeof parsed === 'object' && parsed.text) {
                        return { text: parsed.text, styles: parsed.styles || '' };
                    }
                } catch (e) {
                    // Not JSON, treat as plain text
                }
                return { text: value, styles: '' };
            }
            if (value && typeof value === 'object' && value.text) {
                return { text: value.text, styles: value.styles || '' };
            }
            return { text: '', styles: '' };
        };

        // Update elements using CSS classes
        const headlineData = extractTextAndStyles(blocks.headline);
        const subheadlineData = extractTextAndStyles(blocks.sub || blocks.subheadline);
        const ctaData = extractTextAndStyles(blocks.cta);

        const cssMappings = {
            '.custome-headline': { ...headlineData, type: 'headline' },
            '.custome-subheadline': { ...subheadlineData, type: 'subheadline' },
            '.custome-ctaButton': { ...ctaData, type: 'button' },
            '.custome-purchaseButton': { ...ctaData, type: 'button' }
        };

        // Add textblock mappings
        if (blocks.textblock && Array.isArray(blocks.textblock)) {
            blocks.textblock.forEach((textData, index) => {
                if (textData !== undefined) {
                    const textblockData = extractTextAndStyles(textData);
                    cssMappings[`.custome-textblock${index + 1}`] = { ...textblockData, type: 'textblock' };
                }
            });
        }


        Object.entries(cssMappings).forEach(([selector, config]) => {
            if (!config.text) return;

            const elements = document.querySelectorAll(selector);
            elements.forEach(targetElement => {
                const oldText = targetElement.textContent || targetElement.innerHTML;

                replaceTargetElement(targetElement, config.text, config.styles, config.type);

                targetElement.classList.add('copyai-updated');
                elementsUpdated++;
                log(`Updated element: ${selector}`, `"${oldText}" → "${config.text}"${config.styles ? ` with styles: ${config.styles}` : ''}`);
            });
        });

        log(`Total elements updated: ${elementsUpdated}`);
        return elementsUpdated;
    }

    // Event tracking
    async function trackEvent(eventType) {
        const eventData = {
            event_type: eventType,
            segment: currentSegment,
            site_id: siteId,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            is_holdout: isHoldout,
            ...getURLParameters()
        };

        try {
            await callAPI(CONFIG.eventEndpoint, eventData);
            log('Event tracked:', eventType);
        } catch (err) {
            error('Failed to track event:', eventType, err);
        }
    }

    // Event listeners for interaction tracking
    function setupEventTracking() {
        trackEvent('PAGE_VIEW');

        // Track CTA clicks and purchases
        document.addEventListener('click', function(e) {
            let element = e.target;

            let currentElement = element;
            let maxDepth = 5; // Prevent infinite loops
            let depth = 0;

            while (currentElement && depth < maxDepth) {
                if (currentElement.matches && currentElement.matches('.custome-purchaseButton')) {
                    trackEvent('PURCHASE_CLICK');
                    return;
                }

                // Check for CTA button
                if (currentElement.matches && currentElement.matches('.custome-ctaButton')) {
                    trackEvent('CTA_CLICK');
                    return;
                }

                currentElement = currentElement.parentElement;
                depth++;
            }
        });

    }

    // Main initialization
    async function initialize() {
        log('Initializing CopyAI Widget...');
        extractSiteId();

        const spinnerEl = document.createElement('div');
        spinnerEl.id = 'copyai-spinner';
        spinnerEl.innerHTML = '<div style="border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;margin:auto;"></div>';
        spinnerEl.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:white;display:flex;align-items:center;justify-content:center;z-index:9999;visibility:visible;';
        document.head.insertAdjacentHTML('beforeend', '<style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>');
        document.body.appendChild(spinnerEl);

        try {
            const content = await fetchPersonalizedContent();
            if (content) {
                const updated = updateDOMElements(content);
                if (updated > 0) {
                    log(`Successfully personalized ${updated} elements for segment: ${currentSegment}`);
                } else {
                    log('No elements found to personalize. Make sure your HTML has CSS classes: custome-headline, custome-subheadline, custome-ctaButton, custome-purchaseButton, custome-textblock1-5');
                }
            } else {
                log('No personalized content received, keeping default content');
            }
        } catch (err) {
            error('Initialization failed:', err);
        }

        const spinner = document.getElementById('copyai-spinner');
        if (spinner) spinner.remove();

        const previewContainer = document.getElementById('preview-container');
        if (previewContainer) previewContainer.style.display = 'block';

        setupEventTracking();
        log('Widget initialized successfully');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();