/**
 * Ad Personalization Widget
 * Reads UTM parameters, calls API for personalized content, updates DOM elements
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        apiEndpoint: 'https://ad-saas-one.vercel.app/api/v1/content',
        eventEndpoint: 'https://ad-saas-one.vercel.app/api/v1/event',
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
        
        // Standard UTM parameters
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
            const value = params.get(param);
            if (value) {
                utmParams[param] = value;
                log(`Found ${param}:`, value);
            }
        });

        // Google and Facebook click IDs
        ['gclid', 'fbclid', 'msclkid'].forEach(param => {
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

        // Helper function to find the text content element within a parent
        function findTextElement(parentElement, elementType) {
            let textElement = null;

            if (elementType === 'headline') {
                textElement = parentElement.querySelector('h1, h2, h3, h4, h5, h6');
            } else if (elementType === 'subheadline') {
                textElement = parentElement.querySelector('h2, h3, h4, p, span');
            } else if (elementType === 'button') {
                textElement = parentElement.querySelector('.main-heading-button, .button-text, span, div:not(.button-icon-start):not(.button-icon-end)');
                if (!textElement) textElement = parentElement;
            }

            return textElement || parentElement;
        }

        // Update elements using CSS classes
        const cssMappings = {
            '.custome-headline': { text: blocks.headline, type: 'headline' },
            '.custome-subheadline': { text: blocks.sub, type: 'subheadline' },
            '.custome-ctaButton': { text: blocks.cta, type: 'button' },
            '.custom-purchaseButton': { text: blocks.cta, type: 'button' }
        };

        Object.entries(cssMappings).forEach(([selector, config]) => {
            if (!config.text) return;

            const elements = document.querySelectorAll(selector);
            elements.forEach(parentElement => {
                const textElement = findTextElement(parentElement, config.type);
                if (textElement) {
                    const oldText = textElement.textContent || textElement.innerHTML;
                    textElement.textContent = config.text;
                    parentElement.classList.add('copyai-updated');
                    elementsUpdated++;
                    log(`Updated element: ${selector}`, `"${oldText}" → "${config.text}"`);
                }
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
                if (currentElement.matches && currentElement.matches('.custom-purchaseButton')) {
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

        try {
            const content = await fetchPersonalizedContent();
            if (content) {
                const updated = updateDOMElements(content);
                if (updated > 0) {
                    log(`Successfully personalized ${updated} elements for segment: ${currentSegment}`);
                } else {
                    log('No elements found to personalize. Make sure your HTML has CSS classes: custome-headline, custome-subheadline, custome-ctaButton, custom-purchaseButton');
                }
            } else {
                log('No personalized content received, keeping default content');
            }
        } catch (err) {
            error('Initialization failed:', err);
        }

        setupEventTracking();
        log('Widget initialized successfully');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();