"use strict";
self["webpackHotUpdatechrome_extension_boilerplate_react"]("contentScript",{

/***/ "./src/pages/Content/index.js":
/*!************************************!*\
  !*** ./src/pages/Content/index.js ***!
  \************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   contentPopup: () => (/* binding */ contentPopup),
/* harmony export */   injectProcessComponent: () => (/* binding */ injectProcessComponent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _arrive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrive.js */ "./src/pages/Content/arrive.js");
/* harmony import */ var _arrive_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_arrive_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ "./node_modules/@hot-loader/react-dom/index.js");
/* module decorator */ module = __webpack_require__.hmd(module);
(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();
var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};




// More specific selector for the sidebar button
document.arrive('div[role="button"][aria-label="Meta AI"][data-tab="2"]', element => {
  console.log("Precise sidebar button detected, trying to render the button...");

  // Create a container for the button
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'button_container';

  // Insert the button container just after the detected element
  element.parentNode.insertBefore(buttonContainer, element.nextSibling);

  // Attach shadow DOM to avoid style conflicts
  const shadowRoot = buttonContainer.attachShadow({
    mode: 'open'
  });
  (0,react_dom__WEBPACK_IMPORTED_MODULE_2__.render)( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Button, null), shadowRoot);

  // Style the button container to appear slightly below the selected sidebar button
  const style = document.createElement('style');
  shadowRoot.appendChild(style);
  console.log("Button injected below the precise sidebar element.");
});

// Inject the Process component when needed
function injectProcessComponent(processElement) {
  document.body.appendChild(processElement);
}
function contentPopup() {}
;
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
      document.querySelectorAll(selector).forEach(element => {
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
      document.querySelectorAll(selector).forEach(element => {
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
    style.textContent = Object.keys(blurStyles).map(selector => `${selector}:hover { filter: blur(0px) !important; }`).join(' ');
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
  document.addEventListener('keydown', event => {
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
;
(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;
  if (!reactHotLoader) {
    return;
  }
  reactHotLoader.register(injectProcessComponent, "injectProcessComponent", "D:\\React Extension\\Privacy Pro React\\src\\pages\\Content\\index.js");
  reactHotLoader.register(contentPopup, "contentPopup", "D:\\React Extension\\Privacy Pro React\\src\\pages\\Content\\index.js");
})();
;
(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("e570c6f73eec44eef3c9")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=contentScript.de8a52ed99f52274718f.hot-update.js.map