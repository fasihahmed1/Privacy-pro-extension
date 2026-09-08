import React from "react";
import './arrive.js';
import { render } from "react-dom";

// More specific selector for the sidebar button
document.arrive('div[role="button"][aria-label="Meta AI"][data-tab="2"]', (element) => {
    console.log("Precise sidebar button detected, trying to render the button...");

    // Create a container for the button
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'button_container';
    
    // Insert the button container just after the detected element
    element.parentNode.insertBefore(buttonContainer, element.nextSibling);

    // Attach shadow DOM to avoid style conflicts
    const shadowRoot = buttonContainer.attachShadow({ mode: 'open' });

    render(<Button />, shadowRoot);

    // Style the button container to appear slightly below the selected sidebar button
    const style = document.createElement('style');
    shadowRoot.appendChild(style);

    console.log("Button injected below the precise sidebar element.");
});

// Inject the Process component when needed
export function injectProcessComponent(processElement) {
    document.body.appendChild(processElement);
}

export function contentPopup() {};
(function () {
    const blurStyles = {
        img: '15px',
        span: '3px',
        video: '50px',
        'yt-formatted-string': '3px'
    };

    let isBlurred = false;

    // Function to apply blur styles
    function applyBlur() {
        for (const [selector, blurValue] of Object.entries(blurStyles)) {
            document.querySelectorAll(selector).forEach((element) => {
                element.style.filter = `blur(${blurValue})`;
                element.style.transition = 'filter'; // Smooth transition for hover effect
            });
        }
        isBlurred = true;

        // Add hover effect for blur removal
        addHoverEffect();
    }

    // Function to remove blur styles
    function removeBlur() {
        for (const selector of Object.keys(blurStyles)) {
            document.querySelectorAll(selector).forEach((element) => {
                element.style.filter = '';
            });
        }
        isBlurred = false;

        // Remove hover effect
        removeHoverEffect();
    }

    // Add a hover effect to remove blur
    function addHoverEffect() {
        const style = document.createElement('style');
        style.id = 'blur-hover-style';
        style.textContent = Object.keys(blurStyles)
            .map((selector) => `${selector}:hover { filter: blur(0px) !important; }`)
            .join(' ');
        document.head.appendChild(style);
    }

    // Remove the hover effect
    function removeHoverEffect() {
        const style = document.getElementById('blur-hover-style');
        if (style) {
            style.remove();
        }
    }

    // Listen for keydown events to toggle blur
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'z') {
            if (isBlurred) {
                removeBlur();
            } else {
                applyBlur();
            }
        }
    });

    console.log("Blur toggle script loaded. Press 'Ctrl+Shift+Z' to toggle blur effect.");
})();
