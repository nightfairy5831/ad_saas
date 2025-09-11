/**
 * Ad Personalization Widget
 * Reads UTM parameters, calls API for personalized content, updates DOM elements
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        apiEndpoint: '/api/v1/content',
        eventEndpoint: '/api/v1/event',
        retryAttempts: 3,
        retryDelay: 1000, // ms
        debug: true
    };

    // Global state
    let currentSegment = null;
    let siteId = null;

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
        const script = document.querySelector('script[data-site-id]');
        if (script) {
            siteId = script.getAttribute('data-site-id');
            log('Site ID found:', siteId);
        } else {
            error('No data-site-id attribute found on widget script');
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


    // API calls with retry logic
    async function callAPI(url, data, retryCount = 0) {
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
            error(`API call failed (attempt ${retryCount + 1}):`, err);
            
            if (retryCount < CONFIG.retryAttempts - 1) {
                log(`Retrying in ${CONFIG.retryDelay}ms...`);
                await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
                return callAPI(url, data, retryCount + 1);
            }
            throw err;
        }
    }

    // Content fetching
    async function fetchPersonalizedContent() {
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

        // Update elements by data attributes
        const elementMappings = {
            'data-copy-element="headline"': blocks.headline,
            'data-copy-element="description"': blocks.sub,
            'data-copy-element="subheadline"': blocks.sub,
            'data-copy-element="cta-button"': blocks.cta,
            'data-copy-element="cta"': blocks.cta,
            'data-copy-element="secondary-cta"': blocks.cta
        };


        // Update using data-copy-element attribute
        Object.entries(elementMappings).forEach(([selector, text]) => {
            if (!text) return;
            
            const elements = document.querySelectorAll(`[${selector}]`);
            elements.forEach(element => {
                const oldText = element.textContent || element.innerHTML;
                element.textContent = text;
                element.classList.add('copyai-updated');
                elementsUpdated++;
                log(`Updated element: ${selector}`, `"${oldText}" → "${text}"`);
            });
        });

        // Update using legacy data attributes (for existing landing pages)
        const legacyMappings = {
            '[data-headline]': blocks.headline,
            '[data-sub]': blocks.sub,
            '[data-cta]': blocks.cta
        };

        Object.entries(legacyMappings).forEach(([selector, text]) => {
            if (!text) return;
            
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const oldText = element.textContent || element.innerHTML;
                element.textContent = text;
                element.classList.add('copyai-updated');
                elementsUpdated++;
                log(`Updated legacy element: ${selector}`, `"${oldText}" → "${text}"`);
            });
        });


        // Update bullet points if available
        if (blocks.bullets && Array.isArray(blocks.bullets)) {
            const bulletElements = document.querySelectorAll('[data-copy-element="bullets"]');
            bulletElements.forEach(element => {
                if (element.tagName === 'UL' || element.tagName === 'OL') {
                    element.innerHTML = blocks.bullets.map(bullet => `<li>${bullet}</li>`).join('');
                } else {
                    element.innerHTML = blocks.bullets.join('<br>');
                }
                element.classList.add('copyai-updated');
                elementsUpdated++;
                log('Updated bullets:', blocks.bullets);
            });
        }

        log(`Total elements updated: ${elementsUpdated}`);

        // Trigger custom event
        const event = new CustomEvent('copyai:updated', {
            detail: {
                segment: currentSegment,
                blocks: blocks,
                elementsUpdated: elementsUpdated
            }
        });
        document.dispatchEvent(event);

        return elementsUpdated;
    }

    // Event tracking
    async function trackEvent(eventType, metadata = {}) {
        const eventData = {
            event_type: eventType,
            segment: currentSegment,
            site_id: siteId,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            ...getURLParameters(),
            ...metadata
        };

        try {
            await callAPI(CONFIG.eventEndpoint, eventData);
            log('Event tracked:', eventType, metadata);
        } catch (err) {
            error('Failed to track event:', eventType, err);
        }
    }

    // Event listeners for interaction tracking
    function setupEventTracking() {
        trackEvent('PAGE_VIEW');

        // Track CTA clicks and purchases
        document.addEventListener('click', function(e) {
            const element = e.target;
            
            const isPurchase = element.matches('[data-purchase]');
            if (isPurchase) {
                const purchaseText = element.textContent?.trim() || 'Purchase Click';
                trackEvent('PURCHASE_CLICK', { 
                    purchase_text: purchaseText,
                    element_selector: element.tagName.toLowerCase() + (element.className ? '.' + element.className.split(' ').join('.') : '')
                });
                return;
            }
            
            // Check if clicked element is a CTA
            const isCTA = element.matches('[data-copy-element*="cta"], [data-cta], .cta-button, button[data-copy-element]');
            if (isCTA) {
                const ctaText = element.textContent?.trim() || 'CTA Click';
                trackEvent('CTA_CLICK', { 
                    cta_text: ctaText,
                    element_selector: element.tagName.toLowerCase() + (element.className ? '.' + element.className.split(' ').join('.') : '')
                });
            }
        });

    }

    // Main initialization
    async function initialize() {
        log('Initializing CopyAI Widget...');
        
        // Extract site ID
        extractSiteId();

        // Fetch and apply personalized content
        try {
            const content = await fetchPersonalizedContent();
            if (content) {
                const updated = updateDOMElements(content);
                if (updated > 0) {
                    log(`Successfully personalized ${updated} elements for segment: ${currentSegment}`);
                } else {
                    log('No elements found to personalize. Make sure your HTML has data-copy-element attributes.');
                }
            } else {
                log('No personalized content received, keeping default content');
            }
        } catch (err) {
            error('Initialization failed:', err);
        }

        // Set up event tracking
        setupEventTracking();

        // Set global debug object
        window.copyAIDebug = {
            currentSegment,
            siteId,
            trackEvent,
            getURLParameters,
            log,
            CONFIG
        };

        log('Widget initialized successfully');
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();