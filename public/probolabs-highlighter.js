(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ProboLabs = {}));
})(this, (function (exports) { 'use strict';

  const ElementTag = {
    CLICKABLE: "CLICKABLE", // button, link, toggle switch, checkbox, radio, dropdowns, clickable divs
    FILLABLE: "FILLABLE", // input, textarea content_editable, date picker??
    SELECTABLE: "SELECTABLE", // select
    NON_INTERACTIVE_ELEMENT: 'NON_INTERACTIVE_ELEMENT',
  };

  class ElementInfo {
    constructor(element, index, {tag, type, text, html, xpath, css_selector, bounding_box, iframe_selector, short_css_selector, short_iframe_selector}) {
      this.index = index.toString();
      this.tag = tag;
      this.type = type;
      this.text = text;
      this.html = html;
      this.xpath = xpath;
      this.css_selector = css_selector;
      this.bounding_box = bounding_box;
      this.iframe_selector = iframe_selector;
      this.element = element;
      this.depth = -1;
      this.short_css_selector = short_css_selector;
      this.short_iframe_selector = short_iframe_selector;
    }

    getSelector() {
      return this.xpath ? this.xpath : this.css_selector;
    }

    getDepth() {
      if (this.depth >= 0) {
        return this.depth;
      }
      
      this.depth = 0;
      let currentElement = this.element;
      
      while (currentElement.nodeType === Node.ELEMENT_NODE) {          
        this.depth++;
        currentElement = getParentNode(currentElement);
      }
          
      return this.depth;
    }
  }

  function getParentNode(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return null;
    
    let parent = null;
    // SF is using slots and shadow DOM heavily
    // However, there might be slots in the light DOM which shouldn't be traversed
    if (element.assignedSlot && element.getRootNode() instanceof ShadowRoot)
      parent = element.assignedSlot;
    else      
      parent = element.parentNode;
    
    // Check if we're at a shadow root
    if (parent && parent.nodeType !== Node.ELEMENT_NODE && parent.getRootNode() instanceof ShadowRoot)      
      parent = parent.getRootNode().host;       

    return parent;
  }

  // License: MIT
  // Author: Anton Medvedev <anton@medv.io>
  // Source: https://github.com/antonmedv/finder
  const acceptedAttrNames = new Set(['role', 'name', 'aria-label', 'rel', 'href']);
  /** Check if attribute name and value are word-like. */
  function attr(name, value) {
      let nameIsOk = acceptedAttrNames.has(name);
      nameIsOk ||= name.startsWith('data-') && wordLike(name);
      let valueIsOk = wordLike(value) && value.length < 100;
      valueIsOk ||= value.startsWith('#') && wordLike(value.slice(1));
      return nameIsOk && valueIsOk;
  }
  /** Check if id name is word-like. */
  function idName(name) {
      return wordLike(name);
  }
  /** Check if class name is word-like. */
  function className(name) {
      return wordLike(name);
  }
  /** Check if tag name is word-like. */
  function tagName(name) {
      return true;
  }
  /** Finds unique CSS selectors for the given element. */
  function finder(input, options) {
      if (input.nodeType !== Node.ELEMENT_NODE) {
          throw new Error(`Can't generate CSS selector for non-element node type.`);
      }
      if (input.tagName.toLowerCase() === 'html') {
          return 'html';
      }
      const defaults = {
          root: document.body,
          idName: idName,
          className: className,
          tagName: tagName,
          attr: attr,
          timeoutMs: 1000,
          seedMinLength: 3,
          optimizedMinLength: 2,
          maxNumberOfPathChecks: Infinity,
      };
      const startTime = new Date();
      const config = { ...defaults, ...options };
      const rootDocument = findRootDocument(config.root, defaults);
      let foundPath;
      let count = 0;
      for (const candidate of search(input, config, rootDocument)) {
          const elapsedTimeMs = new Date().getTime() - startTime.getTime();
          if (elapsedTimeMs > config.timeoutMs ||
              count >= config.maxNumberOfPathChecks) {
              const fPath = fallback(input, rootDocument);
              if (!fPath) {
                  throw new Error(`Timeout: Can't find a unique selector after ${config.timeoutMs}ms`);
              }
              return selector(fPath);
          }
          count++;
          if (unique(candidate, rootDocument)) {
              foundPath = candidate;
              break;
          }
      }
      if (!foundPath) {
          throw new Error(`Selector was not found.`);
      }
      const optimized = [
          ...optimize(foundPath, input, config, rootDocument, startTime),
      ];
      optimized.sort(byPenalty);
      if (optimized.length > 0) {
          return selector(optimized[0]);
      }
      return selector(foundPath);
  }
  function* search(input, config, rootDocument) {
      const stack = [];
      let paths = [];
      let current = input;
      let i = 0;
      while (current && current !== rootDocument) {
          const level = tie(current, config);
          for (const node of level) {
              node.level = i;
          }
          stack.push(level);
          current = current.parentElement;
          i++;
          paths.push(...combinations(stack));
          if (i >= config.seedMinLength) {
              paths.sort(byPenalty);
              for (const candidate of paths) {
                  yield candidate;
              }
              paths = [];
          }
      }
      paths.sort(byPenalty);
      for (const candidate of paths) {
          yield candidate;
      }
  }
  function wordLike(name) {
      if (/^[a-z\-]{3,}$/i.test(name)) {
          const words = name.split(/-|[A-Z]/);
          for (const word of words) {
              if (word.length <= 2) {
                  return false;
              }
              if (/[^aeiou]{4,}/i.test(word)) {
                  return false;
              }
          }
          return true;
      }
      return false;
  }
  function tie(element, config) {
      const level = [];
      const elementId = element.getAttribute('id');
      if (elementId && config.idName(elementId)) {
          level.push({
              name: '#' + CSS.escape(elementId),
              penalty: 0,
          });
      }
      for (let i = 0; i < element.classList.length; i++) {
          const name = element.classList[i];
          if (config.className(name)) {
              level.push({
                  name: '.' + CSS.escape(name),
                  penalty: 1,
              });
          }
      }
      for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          if (config.attr(attr.name, attr.value)) {
              level.push({
                  name: `[${CSS.escape(attr.name)}="${CSS.escape(attr.value)}"]`,
                  penalty: 2,
              });
          }
      }
      const tagName = element.tagName.toLowerCase();
      if (config.tagName(tagName)) {
          level.push({
              name: tagName,
              penalty: 5,
          });
          const index = indexOf(element, tagName);
          if (index !== undefined) {
              level.push({
                  name: nthOfType(tagName, index),
                  penalty: 10,
              });
          }
      }
      const nth = indexOf(element);
      if (nth !== undefined) {
          level.push({
              name: nthChild(tagName, nth),
              penalty: 50,
          });
      }
      return level;
  }
  function selector(path) {
      let node = path[0];
      let query = node.name;
      for (let i = 1; i < path.length; i++) {
          const level = path[i].level || 0;
          if (node.level === level - 1) {
              query = `${path[i].name} > ${query}`;
          }
          else {
              query = `${path[i].name} ${query}`;
          }
          node = path[i];
      }
      return query;
  }
  function penalty(path) {
      return path.map((node) => node.penalty).reduce((acc, i) => acc + i, 0);
  }
  function byPenalty(a, b) {
      return penalty(a) - penalty(b);
  }
  function indexOf(input, tagName) {
      const parent = input.parentNode;
      if (!parent) {
          return undefined;
      }
      let child = parent.firstChild;
      if (!child) {
          return undefined;
      }
      let i = 0;
      while (child) {
          if (child.nodeType === Node.ELEMENT_NODE &&
              (tagName === undefined ||
                  child.tagName.toLowerCase() === tagName)) {
              i++;
          }
          if (child === input) {
              break;
          }
          child = child.nextSibling;
      }
      return i;
  }
  function fallback(input, rootDocument) {
      let i = 0;
      let current = input;
      const path = [];
      while (current && current !== rootDocument) {
          const tagName = current.tagName.toLowerCase();
          const index = indexOf(current, tagName);
          if (index === undefined) {
              return;
          }
          path.push({
              name: nthOfType(tagName, index),
              penalty: NaN,
              level: i,
          });
          current = current.parentElement;
          i++;
      }
      if (unique(path, rootDocument)) {
          return path;
      }
  }
  function nthChild(tagName, index) {
      if (tagName === 'html') {
          return 'html';
      }
      return `${tagName}:nth-child(${index})`;
  }
  function nthOfType(tagName, index) {
      if (tagName === 'html') {
          return 'html';
      }
      return `${tagName}:nth-of-type(${index})`;
  }
  function* combinations(stack, path = []) {
      if (stack.length > 0) {
          for (let node of stack[0]) {
              yield* combinations(stack.slice(1, stack.length), path.concat(node));
          }
      }
      else {
          yield path;
      }
  }
  function findRootDocument(rootNode, defaults) {
      if (rootNode.nodeType === Node.DOCUMENT_NODE) {
          return rootNode;
      }
      if (rootNode === defaults.root) {
          return rootNode.ownerDocument;
      }
      return rootNode;
  }
  function unique(path, rootDocument) {
      const css = selector(path);
      switch (rootDocument.querySelectorAll(css).length) {
          case 0:
              throw new Error(`Can't select any node with this selector: ${css}`);
          case 1:
              return true;
          default:
              return false;
      }
  }
  function* optimize(path, input, config, rootDocument, startTime) {
      if (path.length > 2 && path.length > config.optimizedMinLength) {
          for (let i = 1; i < path.length - 1; i++) {
              const elapsedTimeMs = new Date().getTime() - startTime.getTime();
              if (elapsedTimeMs > config.timeoutMs) {
                  return;
              }
              const newPath = [...path];
              newPath.splice(i, 1);
              if (unique(newPath, rootDocument) &&
                  rootDocument.querySelector(selector(newPath)) === input) {
                  yield newPath;
                  yield* optimize(newPath, input, config, rootDocument, startTime);
              }
          }
      }
  }

  // import { realpath } from "fs";

  function getAllDocumentElementsIncludingShadow(selectors, root = document) {
    const elements = Array.from(root.querySelectorAll(selectors));

    root.querySelectorAll('*').forEach(el => {
        if (el.shadowRoot) {
            elements.push(...getAllDocumentElementsIncludingShadow(selectors, el.shadowRoot));
        }
    });
    return elements;
  }

  function getAllFrames(root = document) {
    const result = [root];
    const frames = getAllDocumentElementsIncludingShadow('frame, iframe', root);  
    frames.forEach(frame => {
        try {
            const frameDocument = frame.contentDocument || frame.contentWindow.document;
            if (frameDocument) {
                result.push(frameDocument);
            }
        } catch (e) {
            // Skip cross-origin frames
            console.warn('Could not access frame content:', e.message);
        }
    });

    return result;
  }

  function getAllElementsIncludingShadow(selectors, root = document) {
    const elements = [];

    getAllFrames(root).forEach(doc => {
      elements.push(...getAllDocumentElementsIncludingShadow(selectors, doc));
    });

    return elements;
  }

  /**
   * Deeply searches through DOM trees including Shadow DOM and frames/iframes
   * @param {string} selector - CSS selector to search for
   * @param {Document|Element} [root=document] - Starting point for the search
   * @param {Object} [options] - Search options
   * @param {boolean} [options.searchShadow=true] - Whether to search Shadow DOM
   * @param {boolean} [options.searchFrames=true] - Whether to search frames/iframes
   * @returns {Element[]} Array of found elements
   
  function getAllElementsIncludingShadow(selector, root = document, options = {}) {
    const {
        searchShadow = true,
        searchFrames = true
    } = options;

    const results = new Set();
    
    // Helper to check if an element is valid and not yet found
    const addIfValid = (element) => {
        if (element && !results.has(element)) {
            results.add(element);
        }
    };

    // Helper to process a single document or element
    function processNode(node) {
        // Search regular DOM
        node.querySelectorAll(selector).forEach(addIfValid);

        if (searchShadow) {
            // Search all shadow roots
            const treeWalker = document.createTreeWalker(
                node,
                NodeFilter.SHOW_ELEMENT,
                {
                    acceptNode: (element) => {
                        return element.shadowRoot ? 
                            NodeFilter.FILTER_ACCEPT : 
                            NodeFilter.FILTER_SKIP;
                    }
                }
            );

            while (treeWalker.nextNode()) {
                const element = treeWalker.currentNode;
                if (element.shadowRoot) {
                    // Search within shadow root
                    element.shadowRoot.querySelectorAll(selector).forEach(addIfValid);
                    // Recursively process the shadow root for nested shadow DOMs
                    processNode(element.shadowRoot);
                }
            }
        }

        if (searchFrames) {
            // Search frames and iframes
            const frames = node.querySelectorAll('frame, iframe');
            frames.forEach(frame => {
                try {
                    const frameDocument = frame.contentDocument;
                    if (frameDocument) {
                        processNode(frameDocument);
                    }
                } catch (e) {
                    // Skip cross-origin frames
                    console.warn('Could not access frame content:', e.message);
                }
            });
        }
    }

    // Start processing from the root
    processNode(root);

    return Array.from(results);
  }
  */
  // <div x=1 y=2 role='combobox'> </div>
  function findDropdowns() {
    const dropdowns = [];
    
    // Native select elements
    dropdowns.push(...getAllElementsIncludingShadow('select'));
    
    // Elements with dropdown roles that don't have <input>..</input>
    const roleElements = getAllElementsIncludingShadow('[role="combobox"], [role="listbox"], [role="dropdown"], [role="option"], [role="menu"], [role="menuitem"]').filter(el => {
      return el.tagName.toLowerCase() !== 'input' || !["button", "checkbox", "radio"].includes(el.getAttribute("type"));
    });
    dropdowns.push(...roleElements);
    
    // Common dropdown class patterns
    const dropdownPattern = /.*(dropdown|select|combobox|menu).*/i;
    const elements = getAllElementsIncludingShadow('*');
    const dropdownClasses = Array.from(elements).filter(el => {
      const hasDropdownClass = dropdownPattern.test(el.className);
      const validTag = ['li', 'ul', 'span', 'div', 'p', 'a', 'button'].includes(el.tagName.toLowerCase());
      const style = window.getComputedStyle(el); 
      const result = hasDropdownClass && validTag && (style.cursor === 'pointer' || el.tagName.toLowerCase() === 'a' || el.tagName.toLowerCase() === 'button');
      return result;
    });
    
    dropdowns.push(...dropdownClasses);
    
    // Elements with aria-haspopup attribute
    dropdowns.push(...getAllElementsIncludingShadow('[aria-haspopup="true"], [aria-haspopup="listbox"], [aria-haspopup="menu"]'));

    // Improve navigation element detection
    // Semantic nav elements with list items
    dropdowns.push(...getAllElementsIncludingShadow('nav ul li, nav ol li'));
    
    // Navigation elements in common design patterns
    dropdowns.push(...getAllElementsIncludingShadow('header a, .header a, .nav a, .navigation a, .menu a, .sidebar a, aside a'));
    
    // Elements in primary navigation areas with common attributes
    dropdowns.push(...getAllElementsIncludingShadow('[role="navigation"] a, [aria-label*="navigation"] a, [aria-label*="menu"] a'));

    return dropdowns;
  }

  function findClickables() {
    const clickables = [];
    
    const checkboxPattern = /checkbox/i;
    // Collect all clickable elements first
    const nativeLinks = [...getAllElementsIncludingShadow('a')];
    const nativeButtons = [...getAllElementsIncludingShadow('button')];
    const inputButtons = [...getAllElementsIncludingShadow('input[type="button"], input[type="submit"], input[type="reset"]')];
    const roleButtons = [...getAllElementsIncludingShadow('[role="button"]')];
    // const tabbable = [...getAllElementsIncludingShadow('[tabindex="0"]')];
    const clickHandlers = [...getAllElementsIncludingShadow('[onclick]')];
    const dropdowns = findDropdowns();
    const nativeCheckboxes = [...getAllElementsIncludingShadow('input[type="checkbox"]')];  
    const fauxCheckboxes = getAllElementsIncludingShadow('*').filter(el => {
      if (checkboxPattern.test(el.className)) {
        const realCheckboxes = getAllElementsIncludingShadow('input[type="checkbox"]', el);
        if (realCheckboxes.length === 1) {
          const boundingRect = realCheckboxes[0].getBoundingClientRect();
          return boundingRect.width <= 1 && boundingRect.height <= 1      
        }
      }
      return false;
    });
    const nativeRadios = [...getAllElementsIncludingShadow('input[type="radio"]')];
    const toggles = findToggles();
    const pointerElements = findElementsWithPointer();
    // Add all elements at once
    clickables.push(
      ...nativeLinks,
      ...nativeButtons,
      ...inputButtons,
      ...roleButtons,
      // ...tabbable,
      ...clickHandlers,
      ...dropdowns,
      ...nativeCheckboxes,
      ...fauxCheckboxes,
      ...nativeRadios,
      ...toggles,
      ...pointerElements
    );

    // Only uniquify once at the end
    return clickables;  // Let findElements handle the uniquification
  }

  function findToggles() {
    const toggles = [];
    const checkboxes = getAllElementsIncludingShadow('input[type="checkbox"]');
    const togglePattern = /switch|toggle|slider/i;

    checkboxes.forEach(checkbox => {
      let isToggle = false;

      // Check the checkbox itself
      if (togglePattern.test(checkbox.className) || togglePattern.test(checkbox.getAttribute('role') || '')) {
        isToggle = true;
      }

      // Check parent elements (up to 3 levels)
      if (!isToggle) {
        let element = checkbox;
        for (let i = 0; i < 3; i++) {
          const parent = element.parentElement;
          if (!parent) break;

          const className = parent.className || '';
          const role = parent.getAttribute('role') || '';

          if (togglePattern.test(className) || togglePattern.test(role)) {
            isToggle = true;
            break;
          }
          element = parent;
        }
      }

      // Check next sibling
      if (!isToggle) {
        const nextSibling = checkbox.nextElementSibling;
        if (nextSibling) {
          const className = nextSibling.className || '';
          const role = nextSibling.getAttribute('role') || '';
          if (togglePattern.test(className) || togglePattern.test(role)) {
            isToggle = true;
          }
        }
      }

      if (isToggle) {
        toggles.push(checkbox);
      }
    });

    return toggles;
  }

  function findNonInteractiveElements() {
    // Get all elements in the document
    const all = Array.from(getAllElementsIncludingShadow('*'));
    
    // Filter elements based on Python implementation rules
    return all.filter(element => {
      if (!element.firstElementChild) {
        const tag = element.tagName.toLowerCase();      
        if (!['select', 'button', 'a'].includes(tag)) {
          const validTags = ['p', 'span', 'div', 'input', 'textarea','td','th'].includes(tag) || /^h\d$/.test(tag) || /text/.test(tag);
          const boundingRect = element.getBoundingClientRect();
          return validTags && boundingRect.height > 1 && boundingRect.width > 1;
        }
      }
      return false;
    });
  }



  // export function findNonInteractiveElements() {
  //   const all = [];
  //   try {
  //     const elements = getAllElementsIncludingShadow('*');
  //     all.push(...elements);
  //   } catch (e) {
  //     console.warn('Error getting elements:', e);
  //   }
    
  //   console.debug('Total elements found:', all.length);
    
  //   return all.filter(element => {
  //     try {
  //       const tag = element.tagName.toLowerCase();      

  //       // Special handling for input elements
  //       if (tag === 'input' || tag === 'textarea') {
  //         const boundingRect = element.getBoundingClientRect();
  //         const value = element.value || '';
  //         const placeholder = element.placeholder || '';
  //         return boundingRect.height > 1 && 
  //                boundingRect.width > 1 && 
  //                (value.trim() !== '' || placeholder.trim() !== '');
  //       }

       
  //       // Check if it's a valid tag for text content
  //       const validTags = ['p', 'span', 'div', 'label', 'th', 'td', 'li', 'button', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'select'].includes(tag) || 
  //                        /^h\d$/.test(tag) || 
  //                        /text/.test(tag);

  //       const boundingRect = element.getBoundingClientRect();

  //       // Get direct text content, excluding child element text
  //       let directText = '';
  //       for (const node of element.childNodes) {
  //         // Only include text nodes (nodeType 3)
  //         if (node.nodeType === 3) {
  //           directText += node.textContent || '';
  //         }
  //       }
        
  //       // If no direct text and it's a table cell or heading, check label content
  //       if (!directText.trim() && (tag === 'th' || tag === 'td' || tag === 'h1')) {
  //         const labels = element.getElementsByTagName('label');
  //         for (const label of labels) {
  //           directText += label.textContent || '';
  //         }
  //       }

  //       // If still no text and it's a heading, get all text content
  //       if (!directText.trim() && tag === 'h1') {
  //         directText = element.textContent || '';
  //       }

  //       directText = directText.trim();

  //       // Debug logging
  //       if (directText) {
  //         console.debugg('Text element found:', {
  //           tag,
  //           text: directText,
  //           dimensions: boundingRect,
  //           element
  //         });
  //       }

  //       return validTags && 
  //              boundingRect.height > 1 && 
  //              boundingRect.width > 1 && 
  //              directText !== '';
               
  //     } catch (e) {
  //       console.warn('Error processing element:', e);
  //       return false;
  //     }
  //   });
  // }





  function findElementsWithPointer() {
    const elements = [];
    const allElements = getAllElementsIncludingShadow('*');
    
    console.log('Checking elements with pointer style...');
    
    allElements.forEach(element => {
      // Skip SVG elements for now
      if (element instanceof SVGElement || element.tagName.toLowerCase() === 'svg') {
        return;
      }
      
      const style = window.getComputedStyle(element);
      if (style.cursor === 'pointer') {
        elements.push(element);
      }
    });
    
    console.log(`Found ${elements.length} elements with pointer cursor`);
    return elements;
  }

  function findCheckables() {
    const elements = [];

    elements.push(...getAllElementsIncludingShadow('input[type="checkbox"]'));
    elements.push(...getAllElementsIncludingShadow('input[type="radio"]'));
    const all_elements = getAllElementsIncludingShadow('label');
    const radioClasses = Array.from(all_elements).filter(el => {
      return /.*radio.*/i.test(el.className);    
    });
    elements.push(...radioClasses);
    return elements;
  }

  function findFillables() {
    const elements = [];

    const inputs = [...getAllElementsIncludingShadow('input:not([type="radio"]):not([type="checkbox"])')];
    console.log('Found inputs:', inputs.length, inputs);
    elements.push(...inputs);
    
    const textareas = [...getAllElementsIncludingShadow('textarea')];
    console.log('Found textareas:', textareas.length);
    elements.push(...textareas);
    
    const editables = [...getAllElementsIncludingShadow('[contenteditable="true"]')];
    console.log('Found editables:', editables.length);
    elements.push(...editables);

    return elements;
  }

  // Helper function to check if element is a form control
  function isFormControl(elementInfo) {
    return /^(input|select|textarea|button|label)$/i.test(elementInfo.tag);
  }

  const isDropdownItem = (elementInfo) => {
    const dropdownPatterns = [
      /dropdown[-_]?item/i,    // matches: dropdown-item, dropdownitem, dropdown_item
      /menu[-_]?item/i,        // matches: menu-item, menuitem, menu_item
      /dropdown[-_]?link/i,    // matches: dropdown-link, dropdownlink, dropdown_link
      /list[-_]?item/i,       // matches: list-item, listitem, list_item
      /select[-_]?item/i,     // matches: select-item, selectitem, select_item  
    ];

    const rolePatterns = [
      /menu[-_]?item/i,       // matches: menuitem, menu-item
      /option/i,              // matches: option
      /list[-_]?item/i,      // matches: listitem, list-item
      /tree[-_]?item/i       // matches: treeitem, tree-item
    ];

    const hasMatchingClass = elementInfo.element.className && 
                            dropdownPatterns.some(pattern => 
                              pattern.test(elementInfo.element.className)
                            );

    const hasMatchingRole = elementInfo.element.getAttribute('role') && 
                           rolePatterns.some(pattern => 
                             pattern.test(elementInfo.element.getAttribute('role'))
                           );

    return hasMatchingClass || hasMatchingRole;
  };

  /**
   * Finds the first element matching a CSS selector, traversing Shadow DOM if necessary
   * @param {string} selector - CSS selector to search for
   * @param {Element} [root=document] - Root element to start searching from
   * @returns {Element|null} - The first matching element or null if not found
   */
  function querySelectorShadow(selector, root = document) {
    // First try to find in light DOM
    let element = root.querySelector(selector);
    if (element) return element;
    
    // Get all elements with shadow root
    const shadowElements = Array.from(root.querySelectorAll('*'))
        .filter(el => el.shadowRoot);
    
    // Search through each shadow root until we find a match
    for (const el of shadowElements) {
        element = querySelectorShadow(selector, el.shadowRoot);
        if (element) return element;
    }
    
    return null;
  }

  const getElementByXPathOrCssSelector = (element_info) => {
    console.log('getElementByXPathOrCssSelector:', element_info);

    findElement(document, element_info.iframe_selector, element_info.css_selector);
  };

  const findElement = (root, iframeSelector, cssSelector) => {
    let element;
    
    if (iframeSelector) {      
      const frames = getAllDocumentElementsIncludingShadow('iframe', root);
      
      // Iterate over all frames and compare their CSS selectors
      for (const frame of frames) {
        const selector = generateCssPath(frame);
        if (selector === iframeSelector) {
          const frameDocument = frame.contentDocument || frame.contentWindow.document;
          element = querySelectorShadow(cssSelector, frameDocument);
          console.log('found element ', element);
          break;
        }        
      }  }
    else
      element = querySelectorShadow(cssSelector, root);
      
    if (!element) {
      console.warn('Failed to find element with CSS selector:', cssSelector);
    }

    return element;
  };


  function isDecendent(parent, child) {
    let element = child;
    while (element && element !== parent && element.nodeType === Node.ELEMENT_NODE) {              
        element = getParentNode(element);      
    }
    return element === parent;
  }

  function generateXPath(element) {
    return '/'+extractElementPath(element).map(item => `${item.tagName}${item.onlyChild ? '' : `[${item.index}]`}`).join('/');
  }

  function generateCssPath(element) {
    return extractElementPath(element).map(item => `${item.tagName}:nth-of-type(${item.index})`).join(' > ');
  }

  function extractElementPath(element) {
    if (!element) {
      console.error('ERROR: No element provided to generatePath');
      return [];
    }
    const path = [];
    // traversing up the DOM tree
    while (element && element.nodeType === Node.ELEMENT_NODE) {    
      let tagName = element.nodeName.toLowerCase();
          
      let sibling = element;
      let index = 1;
      
      while (sibling = sibling.previousElementSibling) {
        if (sibling.nodeName.toLowerCase() === tagName) index++;
      }
      sibling = element;
      
      let onlyChild = (index === 1);
      while (onlyChild && (sibling = sibling.nextElementSibling)) {
        if (sibling.nodeName.toLowerCase() === tagName) onlyChild = false;
      }
         
      // add a tuple with tagName, index (nth), and onlyChild    
      path.unshift({
        tagName: tagName,
        index: index,
        onlyChild: onlyChild      
      });    

      element = getParentNode(element);
    }
    
    return path;
  }

  function cleanHTML(rawHTML) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHTML, "text/html");

    function cleanElement(element) {
      const allowedAttributes = new Set([
        "role",
        "type",
        "class",
        "href",
        "alt",
        "title",
        "readonly",
        "checked",
        "enabled",
        "disabled",
      ]);

      [...element.attributes].forEach(attr => {
        const name = attr.name.toLowerCase();
        const value = attr.value;

        const isTestAttribute = /^(testid|test-id|data-test-id)$/.test(name);
        const isDataAttribute = name.startsWith("data-") && value;
        const isBooleanAttribute = ["readonly", "checked", "enabled", "disabled"].includes(name);

        if (!allowedAttributes.has(name) && !isDataAttribute && !isTestAttribute && !isBooleanAttribute) {
          element.removeAttribute(name);
        }
      });

      // Handle SVG content - more aggressive replacement
      if (element.tagName.toLowerCase() === "svg") {
        // Remove all attributes except class and role
        [...element.attributes].forEach(attr => {
          const name = attr.name.toLowerCase();
          if (name !== "class" && name !== "role") {
            element.removeAttribute(name);
          }
        });
        element.innerHTML = "CONTENT REMOVED";
      } else {
        // Recursively clean child elements
        Array.from(element.children).forEach(cleanElement);
      }

      // Only remove empty elements that aren't semantic or icon elements
      const keepEmptyElements = ['i', 'span', 'svg', 'button', 'input'];
      if (!keepEmptyElements.includes(element.tagName.toLowerCase()) && 
          !element.children.length && 
          !element.textContent.trim()) {
        element.remove();
      }
    }

    // Process all elements in the document body
    Array.from(doc.body.children).forEach(cleanElement);
    return doc.body.innerHTML;
  }

  function getContainingIframe(element) {
    // If not in an iframe, return null
    if (element.ownerDocument.defaultView === window.top) {
      return null;
    }
    
    // Try to find the iframe in the parent document that contains our element
    try {
      const parentDocument = element.ownerDocument.defaultView.parent.document;
      const iframes = parentDocument.querySelectorAll('iframe');
      
      for (const iframe of iframes) {
        if (iframe.contentWindow === element.ownerDocument.defaultView) {
          return iframe;
        }
      }
    } catch (e) {
      // Cross-origin restriction
      return "Cross-origin iframe - cannot access details";
    }
    
    return null;
  }

  function getElementInfo(element, index) {
    // Get text content with spaces between elements
    /* function getTextContent(element) {
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      let text = '';
      let node;

      while (node = walker.nextNode()) {
        const trimmedText = node.textContent.trim();
        if (trimmedText) {
          // Add space if there's already text
          if (text) {
             text += ' ';
          }
          text += trimmedText;
        }
      }

      return text;
    } */

    const xpath = generateXPath(element);
    const css_selector = generateCssPath(element);
    //disabled since it's blocking event handling in recorder
    const short_css_selector = ''; //getRobustSelector(element);

    const iframe = getContainingIframe(element);  
    const iframe_selector = iframe ? generateCssPath(iframe) : "";
    //disabled since it's blocking event handling in recorder
    const short_iframe_selector = ''; //iframe ? getRobustSelector(iframe) : "";

    // Return element info with pre-calculated values
    return new ElementInfo(element, index, {
      tag: element.tagName.toLowerCase(),
      type: element.type || '',
      text: element.innerText || element.placeholder || '', //getTextContent(element),
      html: cleanHTML(element.outerHTML),
      xpath: xpath,
      css_selector: css_selector,
      bounding_box: element.getBoundingClientRect(),
      iframe_selector: iframe_selector,
      short_css_selector: short_css_selector,
      short_iframe_selector: short_iframe_selector
    });
  }

  function getAriaLabelledByText(elementInfo, includeHidden=true) {
    if (!elementInfo.element.hasAttribute('aria-labelledby')) return '';

    const ids = elementInfo.element.getAttribute('aria-labelledby').split(/\s+/);
    let labelText = '';

    //locate root (document or iFrame document if element is contained in an iframe)
    let root = document;
    if (elementInfo.iframe_selector) {      
      const frames = getAllDocumentElementsIncludingShadow('iframe', document);
      
      // Iterate over all frames and compare their CSS selectors
      for (const frame of frames) {
        const selector = generateCssPath(frame);
        if (selector === elementInfo.iframe_selector) {
          root = frame.contentDocument || frame.contentWindow.document;        
          break;
        }
      } 
    }

    ids.forEach(id => {
      const el = querySelectorShadow(`#${CSS.escape(id)}`, root);
      if (el) {
        if (includeHidden || el.offsetParent !== null || getComputedStyle(el).display !== 'none') {
          labelText += el.textContent.trim() + ' ';
        }
      }
    });

    return labelText.trim();
  }



  const filterZeroDimensions = (elementInfo) => {
    const rect = elementInfo.bounding_box;
    //single pixel elements are typically faux controls and should be filtered too
    const hasSize = rect.width > 1 && rect.height > 1;
    const style = window.getComputedStyle(elementInfo.element);
    const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
    
    if (!hasSize || !isVisible) {
      
      return false;
    }
    return true;
  };



  function uniquifyElements(elements) {
    const seen = new Set();

    console.log(`Starting uniquification with ${elements.length} elements`);

    // Filter out testing infrastructure elements first
    const filteredInfrastructure = elements.filter(element_info => {
      // Skip the highlight-overlay element completely - it's part of the testing infrastructure
      if (element_info.element.id === 'highlight-overlay' || 
          (element_info.css_selector && element_info.css_selector.includes('#highlight-overlay'))) {
        console.log('Filtered out testing infrastructure element:', element_info.css_selector);
        return false;
      }
      
      // Filter out UI framework container/manager elements
      const el = element_info.element;
      // UI framework container checks - generic detection for any framework
      if ((el.getAttribute('data-rendered-by') || 
           el.getAttribute('data-reactroot') || 
           el.getAttribute('ng-version') || 
           el.getAttribute('data-component-id') ||
           el.getAttribute('data-root') ||
           el.getAttribute('data-framework')) && 
          (el.className && 
           typeof el.className === 'string' && 
           (el.className.includes('Container') || 
            el.className.includes('container') || 
            el.className.includes('Manager') || 
            el.className.includes('manager')))) {
        console.log('Filtered out UI framework container element:', element_info.css_selector);
        return false;
      }
      
      // Direct filter for framework container elements that shouldn't be interactive
      // Consolidating multiple container detection patterns into one efficient check
      const isFullViewport = element_info.bounding_box && 
                           element_info.bounding_box.x <= 5 && 
                           element_info.bounding_box.y <= 5 && 
                           element_info.bounding_box.width >= (window.innerWidth * 0.95) && 
                           element_info.bounding_box.height >= (window.innerHeight * 0.95);
                           
      // Empty content check
      const isEmpty = !el.innerText || el.innerText.trim() === '';
      
      // Check if it's a framework container element
      if (element_info.element.tagName === 'DIV' && 
          isFullViewport && 
          isEmpty && 
          (
            // Pattern matching for root containers
            (element_info.xpath && 
              (element_info.xpath.match(/^\/html\[\d+\]\/body\[\d+\]\/div\[\d+\]\/div\[\d+\]$/) || 
               element_info.xpath.match(/^\/\/\*\[@id='[^']+'\]\/div\[\d+\]$/))) ||
            
            // Simple DOM structure
            (element_info.css_selector.split(' > ').length <= 4 && element_info.depth <= 5) ||
            
            // Empty or container-like classes
            (!el.className || el.className === '' || 
             (typeof el.className === 'string' && 
              (el.className.includes('overlay') || 
               el.className.includes('container') || 
               el.className.includes('wrapper'))))
          )) {
        console.log('Filtered out framework container element:', element_info.css_selector);
        return false;
      }
      
      return true;
    });

    // First filter out elements with zero dimensions
    const nonZeroElements = filteredInfrastructure.filter(filterZeroDimensions);
    // sort by CSS selector depth so parents are processed first
    nonZeroElements.sort((a, b) => a.getDepth() - b.getDepth());
    console.log(`After dimension filtering: ${nonZeroElements.length} elements remain (${elements.length - nonZeroElements.length} removed)`);
    
    const filteredByParent = nonZeroElements.filter(element_info => {

      const parent = findClosestParent(seen, element_info);
      const keep = parent == null || shouldKeepNestedElement(element_info, parent);
      // console.log("node ", element_info.index, ": keep=", keep, " parent=", parent);
      // if (!keep && !element_info.xpath) {
      //   console.log("Filtered out element ", element_info," because it's a nested element of ", parent);
      // }
      if (keep)
        seen.add(element_info.css_selector);

      return keep;
    });

    console.log(`After parent/child filtering: ${filteredByParent.length} elements remain (${nonZeroElements.length - filteredByParent.length} removed)`);

    // Final overlap filtering
    const filteredResults = filteredByParent.filter(element => {

       // Look for any element that came BEFORE this one in the array
      const hasEarlierOverlap = filteredByParent.some(other => {
        // Only check elements that came before (lower index)
        if (filteredByParent.indexOf(other) >= filteredByParent.indexOf(element)) {
          return false;
        }
        
        const isOverlapping = areElementsOverlapping(element, other); 
        return isOverlapping;
      });  

      // Keep element if it has no earlier overlapping elements
      return !hasEarlierOverlap;
    });
    
    
    
    // Check for overlay removal
    console.log(`After filtering: ${filteredResults.length} (${filteredByParent.length - filteredResults.length} removed by overlap)`);
    
    const nonOverlaidElements = filteredResults.filter(element => {
      return !isOverlaid(element);
    });

    console.log(`Final elements after overlay removal: ${nonOverlaidElements.length} (${filteredResults.length - nonOverlaidElements.length} removed)`);
    
    return nonOverlaidElements;

  }



  const areElementsOverlapping = (element1, element2) => {
    if (element1.css_selector === element2.css_selector) {
      return true;
    }
    
    const box1 = element1.bounding_box;
    const box2 = element2.bounding_box;
    
    return box1.x === box2.x &&
           box1.y === box2.y &&
           box1.width === box2.width &&
           box1.height === box2.height;
          //  element1.text === element2.text &&
          //  element2.tag === 'a';
  };

  function findClosestParent(seen, element_info) {  
    
    // Split the xpath into segments
    const segments = element_info.css_selector.split(' > ');
    
    // Try increasingly shorter paths until we find one in the seen set
    for (let i = segments.length - 1; i > 0; i--) {
      const parentPath = segments.slice(0, i).join(' > ');
      if (seen.has(parentPath)) {
        return parentPath;
      }
    }

    return null;
  }

  function shouldKeepNestedElement(elementInfo, parentPath) {
    let result = false;
    const parentSegments = parentPath.split(' > ');

    const isParentLink = /^a(:nth-of-type\(\d+\))?$/.test(parentSegments[parentSegments.length - 1]);
    if (isParentLink) {
      return false;    
    }
    // If this is a checkbox/radio input
    if (elementInfo.tag === 'input' && 
        (elementInfo.type === 'checkbox' || elementInfo.type === 'radio')) {
      
      // Check if parent is a label by looking at the parent xpath's last segment
      
      const isParentLabel = /^label(:nth-of-type\(\d+\))?$/.test(parentSegments[parentSegments.length - 1]);
      
      // If parent is a label, don't keep the input (we'll keep the label instead)
      if (isParentLabel) {
        return false;
      }
    }
    
    // Keep all other form controls and dropdown items
    if (isFormControl(elementInfo) || isDropdownItem(elementInfo)) {
      result = true;
    }

    if(isTableCell(elementInfo)) {
      result = true;
    }
    
    
    // console.log(`shouldKeepNestedElement: ${elementInfo.tag} ${elementInfo.text} ${elementInfo.xpath} -> ${parentXPath} -> ${result}`);
    return result;
  }


  function isTableCell(elementInfo) {
    const element = elementInfo.element;
    if(!element || !(element instanceof HTMLElement)) {
      return false;
    }
    const validTags = new Set(['td', 'th']);
    const validRoles = new Set(['cell', 'gridcell', 'columnheader', 'rowheader']);
    
    const tag = element.tagName.toLowerCase();
    const role = element.getAttribute('role')?.toLowerCase();

    if (validTags.has(tag) || (role && validRoles.has(role))) {
      return true;
    }
    return false;
    
  }

  function isOverlaid(elementInfo) {
    const element = elementInfo.element;
    const boundingRect = elementInfo.bounding_box;
    

    
    
    // Create a diagnostic logging function that only logs when needed
    const diagnosticLog = (...args) => {
      { // set to true for debugging
        console.log('[OVERLAY-DEBUG]', ...args);
      }
    };

    // Special handling for tooltips
    if (elementInfo.element.className && typeof elementInfo.element.className === 'string' && 
        elementInfo.element.className.includes('tooltip')) {
      diagnosticLog('Element is a tooltip, not considering it overlaid');
      return false;
    }
    
    
      
        // Get element at the center point to check if it's covered by a popup/modal
        const middleX = boundingRect.x + boundingRect.width/2;
        const middleY = boundingRect.y + boundingRect.height/2;
        const elementAtMiddle = element.ownerDocument.elementFromPoint(middleX, middleY);
        
        if (elementAtMiddle && 
            elementAtMiddle !== element && 
            !isDecendent(element, elementAtMiddle) && 
            !isDecendent(elementAtMiddle, element)) {

        
        return true;
      }
        
        
      return false;
    
    }



  /**
   * Get the “best” short, unique, and robust CSS selector for an element.
   * 
   * @param {Element} element
   * @returns {string} A selector guaranteed to find exactly that element in its context
   */
  function getRobustSelector(element) {
    // 1. Figure out the real “root” (iframe doc, shadow root, or main doc)
    const root = (() => {
      const rootNode = element.getRootNode();
      if (rootNode instanceof ShadowRoot) {
        return rootNode;
      }
      return element.ownerDocument;
    })();

    // 2. Options to bias toward stable attrs and away from auto-generated classes
    const options = {
      root,
      // only use data-*, id or aria-label by default
      attr(name, value) {
        if (name === 'id' || name.startsWith('data-') || name === 'aria-label') {
          return true;
        }
        return false;
      },
      // skip framework junk
      filter(name, value) {
        if (name.startsWith('ng-') || name.startsWith('_ngcontent') || /^p-/.test(name)) {
          return false;
        }
        return true;
      },
      // let finder try really short seeds
      seedMinLength: 1,
      optimizedMinLength: 1,
    };

    let selector;
    try {
      selector = finder(element, options);
      // 3. Verify it really works in the context
      const found = root.querySelectorAll(selector);
      if (found.length !== 1 || found[0] !== element) {
        throw new Error('not unique or not found');
      }
      return selector;
    } catch (err) {
      // 4. Fallback: full path (you already have this utility)
      console.warn('[getRobustSelector] finder failed, falling back to full path:', err);
      return generateCssPath(element); // you’d import or define this elsewhere
    }
  }

  /**
   * Checks if an element is scrollable (has scrollable content)
   * 
   * @param element - The element to check
   * @returns boolean indicating if the element is scrollable
   */
  function isScrollableContainer(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    
    // Reliable way to detect if an element has scrollbars or is scrollable
    const hasScrollHeight = element.scrollHeight > element.clientHeight;
    const hasScrollWidth = element.scrollWidth > element.clientWidth;
    
    // Check actual style properties
    const hasOverflowY = style.overflowY === 'auto' || 
                        style.overflowY === 'scroll' || 
                        style.overflowY === 'overlay';
    const hasOverflowX = style.overflowX === 'auto' || 
                        style.overflowX === 'scroll' || 
                        style.overflowX === 'overlay';
    
    // Check common class names and attributes for scrollable containers across frameworks
    const hasScrollClasses = element.classList.contains('scroll') || 
                            element.classList.contains('scrollable') ||
                            element.classList.contains('overflow') ||
                            element.classList.contains('overflow-auto') ||
                            element.classList.contains('overflow-scroll') ||
                            element.getAttribute('data-scrollable') === 'true';
                            
    // Check for height/max-height constraints that often indicate scrolling content
    const hasHeightConstraint = style.maxHeight && 
                               style.maxHeight !== 'none' && 
                               style.maxHeight !== 'auto';
    
    // An element is scrollable if it has:
    // 1. Actual scrollbars in use (most reliable check) OR
    // 2. Overflow styles allowing scrolling AND content that would require scrolling
    return (hasScrollHeight && hasOverflowY) || 
           (hasScrollWidth && hasOverflowX) ||
           (hasScrollClasses && (hasScrollHeight || hasScrollWidth)) ||
           (hasHeightConstraint && hasScrollHeight);
  }

  /**
   * Detects scrollable containers that are ancestors of the target element
   * 
   * This function traverses up the DOM tree from the target element and identifies
   * all scrollable containers (elements that have scrollable content).
   * 
   * @param target - The target element to start the search from
   * @returns Array of objects with selector and scroll properties
   */
  function detectScrollableContainers(target) {
    const scrollableContainers = [];
    
    if (!target) {
      return scrollableContainers;
    }
    
    console.log('🔍 [detectScrollableContainers] Starting detection for target:', target.tagName, target.id, target.className);
    
    // Detect if target is inside an iframe
    const iframe = getContainingIframe(target);
    const iframe_selector = iframe ? generateCssPath(iframe) : "";
    
    console.log('🔍 [detectScrollableContainers] Iframe context:', iframe ? 'inside iframe' : 'main document', 'selector:', iframe_selector);
    
    // Start from the target element and traverse up the DOM tree
    let currentElement = target;
    let depth = 0;
    const MAX_DEPTH = 10; // Limit traversal depth to avoid infinite loops
    
    while (currentElement && currentElement.nodeType === Node.ELEMENT_NODE && depth < MAX_DEPTH) {        
      // Check if the current element is scrollable
      if (isScrollableContainer(currentElement)) {
        console.log('🔍 [detectScrollableContainers] Found scrollable container at depth', depth, ':', currentElement.tagName, currentElement.id, currentElement.className);
        
        const container = {
          containerEl: currentElement,
          selector: generateCssPath(currentElement),
          iframe_selector: iframe_selector,
          scrollTop: currentElement.scrollTop,
          scrollLeft: currentElement.scrollLeft,
          scrollHeight: currentElement.scrollHeight,
          scrollWidth: currentElement.scrollWidth,
          clientHeight: currentElement.clientHeight,
          clientWidth: currentElement.clientWidth
        };
        
        scrollableContainers.push(container);
      }
      
      // Move to parent element
      currentElement = getParentNode(currentElement);
      
      depth++;
    }
    
    console.log('🔍 [detectScrollableContainers] Detection complete. Found', scrollableContainers.length, 'scrollable containers');
    return scrollableContainers;
  }

  class DOMSerializer {
      constructor(options = {}) {
        this.options = {
          includeStyles: true,
          includeScripts: false, // Security consideration
          includeFrames: true,
          includeShadowDOM: true,
          maxDepth: 50,
          ...options
        };
        this.serializedFrames = new Map();
        this.shadowRoots = new Map();
      }
    
      /**
       * Serialize a complete document or element
       */
      serialize(rootElement = document) {
        try {
          const serialized = {
            type: 'document',
            doctype: this.serializeDoctype(rootElement),
            documentElement: this.serializeElement(rootElement.documentElement || rootElement),
            frames: [],
            timestamp: Date.now(),
            url: rootElement.URL || window.location?.href,
            metadata: {
              title: rootElement.title,
              charset: rootElement.characterSet,
              contentType: rootElement.contentType
            }
          };
    
          // Serialize frames and iframes if enabled
          if (this.options.includeFrames) {
            serialized.frames = this.serializeFrames(rootElement);
          }
    
          return serialized;
        } catch (error) {
          console.error('Serialization error:', error);
          throw new Error(`DOM serialization failed: ${error.message}`);
        }
      }
    
      /**
       * Serialize document type declaration
       */
      serializeDoctype(doc) {
        if (!doc.doctype) return null;
        
        return {
          name: doc.doctype.name,
          publicId: doc.doctype.publicId,
          systemId: doc.doctype.systemId
        };
      }
    
      /**
       * Serialize an individual element and its children
       */
      serializeElement(element, depth = 0) {
        if (depth > this.options.maxDepth) {
          return { type: 'text', content: '<!-- Max depth exceeded -->' };
        }
    
        const nodeType = element.nodeType;
        
        switch (nodeType) {
          case Node.ELEMENT_NODE:
            return this.serializeElementNode(element, depth);
          case Node.TEXT_NODE:
            return this.serializeTextNode(element);
          case Node.COMMENT_NODE:
            return this.serializeCommentNode(element);
          case Node.DOCUMENT_FRAGMENT_NODE:
            return this.serializeDocumentFragment(element, depth);
          default:
            return null;
        }
      }
    
      /**
       * Serialize element node with attributes and children
       */
      serializeElementNode(element, depth) {
        const tagName = element.tagName.toLowerCase();
        
        // Skip script tags for security unless explicitly enabled
        if (tagName === 'script' && !this.options.includeScripts) {
          return { type: 'comment', content: '<!-- Script tag removed for security -->' };
        }
    
        const serialized = {
          type: 'element',
          tagName: tagName,
          attributes: this.serializeAttributes(element),
          children: [],
          shadowRoot: null
        };
    
        // Handle Shadow DOM
        if (this.options.includeShadowDOM && element.shadowRoot) {
          serialized.shadowRoot = this.serializeShadowRoot(element.shadowRoot, depth + 1);
        }
    
        // Handle special elements
        if (tagName === 'iframe' || tagName === 'frame') {
          serialized.frameData = this.serializeFrameElement(element);
        }
    
        // Serialize children
        for (const child of element.childNodes) {
          const serializedChild = this.serializeElement(child, depth + 1);
          if (serializedChild) {
            serialized.children.push(serializedChild);
          }
        }
    
        // Include computed styles if enabled
        if (this.options.includeStyles && element.nodeType === Node.ELEMENT_NODE) {
          serialized.computedStyle = this.serializeComputedStyle(element);
        }
    
        return serialized;
      }
    
      /**
       * Serialize element attributes
       */
      serializeAttributes(element) {
        const attributes = {};
        
        if (element.attributes) {
          for (const attr of element.attributes) {
            attributes[attr.name] = attr.value;
          }
        }
    
        return attributes;
      }
    
      /**
       * Serialize computed styles
       */
      serializeComputedStyle(element) {
        try {
          const computedStyle = window.getComputedStyle(element);
          const styles = {};
          
          // Only serialize non-default values to reduce size
          const importantStyles = [
            'display', 'position', 'width', 'height', 'margin', 'padding',
            'border', 'background', 'color', 'font-family', 'font-size',
            'text-align', 'visibility', 'z-index', 'transform'
          ];
    
          for (const prop of importantStyles) {
            const value = computedStyle.getPropertyValue(prop);
            if (value && value !== 'initial' && value !== 'normal') {
              styles[prop] = value;
            }
          }
    
          return styles;
        } catch (error) {
          return {};
        }
      }
    
      /**
       * Serialize text node
       */
      serializeTextNode(node) {
        return {
          type: 'text',
          content: node.textContent
        };
      }
    
      /**
       * Serialize comment node
       */
      serializeCommentNode(node) {
        return {
          type: 'comment',
          content: node.textContent
        };
      }
    
      /**
       * Serialize document fragment
       */
      serializeDocumentFragment(fragment, depth) {
        const serialized = {
          type: 'fragment',
          children: []
        };
    
        for (const child of fragment.childNodes) {
          const serializedChild = this.serializeElement(child, depth + 1);
          if (serializedChild) {
            serialized.children.push(serializedChild);
          }
        }
    
        return serialized;
      }
    
      /**
       * Serialize Shadow DOM
       */
      serializeShadowRoot(shadowRoot, depth) {
        const serialized = {
          type: 'shadowRoot',
          mode: shadowRoot.mode,
          children: []
        };
    
        for (const child of shadowRoot.childNodes) {
          const serializedChild = this.serializeElement(child, depth + 1);
          if (serializedChild) {
            serialized.children.push(serializedChild);
          }
        }
    
        return serialized;
      }
    
      /**
       * Serialize frame/iframe elements
       */
      serializeFrameElement(frameElement) {
        const frameData = {
          src: frameElement.src,
          name: frameElement.name,
          id: frameElement.id,
          sandbox: frameElement.sandbox?.toString() || '',
          allowfullscreen: frameElement.allowFullscreen
        };
    
        // Try to access frame content (may fail due to CORS)
        try {
          const frameDoc = frameElement.contentDocument;
          if (frameDoc && this.options.includeFrames) {
            frameData.content = this.serialize(frameDoc);
          }
        } catch (error) {
          frameData.accessError = 'Cross-origin frame content not accessible';
        }
    
        return frameData;
      }
    
      /**
       * Serialize all frames in document
       */
      serializeFrames(doc) {
        const frames = [];
        const frameElements = doc.querySelectorAll('iframe, frame');
    
        for (const frameElement of frameElements) {
          try {
            const frameDoc = frameElement.contentDocument;
            if (frameDoc) {
              frames.push({
                element: this.serializeElement(frameElement),
                content: this.serialize(frameDoc)
              });
            }
          } catch (error) {
            frames.push({
              element: this.serializeElement(frameElement),
              error: 'Frame content not accessible'
            });
          }
        }
    
        return frames;
      }
    
      /**
       * Deserialize serialized DOM data back to DOM nodes
       */
      deserialize(serializedData, targetDocument = document) {
        try {
          if (serializedData.type === 'document') {
            return this.deserializeDocument(serializedData, targetDocument);
          } else {
            return this.deserializeElement(serializedData, targetDocument);
          }
        } catch (error) {
          console.error('Deserialization error:', error);
          throw new Error(`DOM deserialization failed: ${error.message}`);
        }
      }
    
      /**
       * Deserialize complete document
       */
      deserializeDocument(serializedDoc, targetDoc) {
        // Create new document if needed
        const doc = targetDoc || document.implementation.createHTMLDocument();
    
        // Set doctype if present
        if (serializedDoc.doctype) {
          const doctype = document.implementation.createDocumentType(
            serializedDoc.doctype.name,
            serializedDoc.doctype.publicId,
            serializedDoc.doctype.systemId
          );
          doc.replaceChild(doctype, doc.doctype);
        }
    
        // Deserialize document element
        if (serializedDoc.documentElement) {
          const newDocElement = this.deserializeElement(serializedDoc.documentElement, doc);
          doc.replaceChild(newDocElement, doc.documentElement);
        }
    
        // Handle metadata
        if (serializedDoc.metadata) {
          doc.title = serializedDoc.metadata.title || '';
        }
    
        return doc;
      }
    
      /**
       * Deserialize individual element
       */
      deserializeElement(serializedNode, doc) {
        switch (serializedNode.type) {
          case 'element':
            return this.deserializeElementNode(serializedNode, doc);
          case 'text':
            return doc.createTextNode(serializedNode.content);
          case 'comment':
            return doc.createComment(serializedNode.content);
          case 'fragment':
            return this.deserializeDocumentFragment(serializedNode, doc);
          case 'shadowRoot':
            // Shadow roots are handled during element creation
            return null;
          default:
            return null;
        }
      }
    
      /**
       * Deserialize element node
       */
      deserializeElementNode(serializedElement, doc) {
        const element = doc.createElement(serializedElement.tagName);
    
        // Set attributes
        if (serializedElement.attributes) {
          for (const [name, value] of Object.entries(serializedElement.attributes)) {
            try {
              element.setAttribute(name, value);
            } catch (error) {
              console.warn(`Failed to set attribute ${name}:`, error);
            }
          }
        }
    
        // Apply computed styles if available
        if (serializedElement.computedStyle && this.options.includeStyles) {
          for (const [prop, value] of Object.entries(serializedElement.computedStyle)) {
            try {
              element.style.setProperty(prop, value);
            } catch (error) {
              console.warn(`Failed to set style ${prop}:`, error);
            }
          }
        }
    
        // Create shadow root if present
        if (serializedElement.shadowRoot && element.attachShadow) {
          try {
            const shadowRoot = element.attachShadow({ 
              mode: serializedElement.shadowRoot.mode || 'open' 
            });
            
            // Deserialize shadow root children
            for (const child of serializedElement.shadowRoot.children) {
              const childElement = this.deserializeElement(child, doc);
              if (childElement) {
                shadowRoot.appendChild(childElement);
              }
            }
          } catch (error) {
            console.warn('Failed to create shadow root:', error);
          }
        }
    
        // Deserialize children
        if (serializedElement.children) {
          for (const child of serializedElement.children) {
            const childElement = this.deserializeElement(child, doc);
            if (childElement) {
              element.appendChild(childElement);
            }
          }
        }
    
        // Handle frame content
        if (serializedElement.frameData && serializedElement.frameData.content) {
          // Frame content deserialization would happen after the frame loads
          element.addEventListener('load', () => {
            try {
              const frameDoc = element.contentDocument;
              if (frameDoc) {
                this.deserializeDocument(serializedElement.frameData.content, frameDoc);
              }
            } catch (error) {
              console.warn('Failed to deserialize frame content:', error);
            }
          });
        }
    
        return element;
      }
    
      /**
       * Deserialize document fragment
       */
      deserializeDocumentFragment(serializedFragment, doc) {
        const fragment = doc.createDocumentFragment();
    
        if (serializedFragment.children) {
          for (const child of serializedFragment.children) {
            const childElement = this.deserializeElement(child, doc);
            if (childElement) {
              fragment.appendChild(childElement);
            }
          }
        }
    
        return fragment;
      }
    }
    
    // Usage example and utility functions
    class DOMUtils {
      /**
       * Create serializer with common presets
       */
      static createSerializer(preset = 'default') {
        const presets = {
          default: {
            includeStyles: true,
            includeScripts: false,
            includeFrames: true,
            includeShadowDOM: true
          },
          minimal: {
            includeStyles: false,
            includeScripts: false,
            includeFrames: false,
            includeShadowDOM: false
          },
          complete: {
            includeStyles: true,
            includeScripts: true,
            includeFrames: true,
            includeShadowDOM: true
          },
          secure: {
            includeStyles: true,
            includeScripts: false,
            includeFrames: false,
            includeShadowDOM: true
          }
        };
    
        return new DOMSerializer(presets[preset] || presets.default);
      }
    
      /**
       * Serialize DOM to JSON string
       */
      static serializeToJSON(element, options) {
        const serializer = new DOMSerializer(options);
        const serialized = serializer.serialize(element);
        return JSON.stringify(serialized, null, 2);
      }
    
      /**
       * Deserialize from JSON string
       */
      static deserializeFromJSON(jsonString, targetDocument) {
        const serialized = JSON.parse(jsonString);
        const serializer = new DOMSerializer();
        return serializer.deserialize(serialized, targetDocument);
      }
    
      /**
       * Clone DOM with full fidelity including Shadow DOM
       */
      static deepClone(element, options) {
        const serializer = new DOMSerializer(options);
        const serialized = serializer.serialize(element);
        return serializer.deserialize(serialized, element.ownerDocument);
      }
    
      /**
       * Compare two DOM structures
       */
      static compare(element1, element2, options) {
        const serializer = new DOMSerializer(options);
        const serialized1 = serializer.serialize(element1);
        const serialized2 = serializer.serialize(element2);
        
        return JSON.stringify(serialized1) === JSON.stringify(serialized2);
      }
    }
    
    /*
    // Export for use
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = { DOMSerializer, DOMUtils };
    } else if (typeof window !== 'undefined') {
      window.DOMSerializer = DOMSerializer;
      window.DOMUtils = DOMUtils;
    }
    */

    /* Usage Examples:
    
    // Basic serialization
    const serializer = new DOMSerializer();
    const serialized = serializer.serialize(document);
    console.log(JSON.stringify(serialized, null, 2));
    
    // Deserialize back to DOM
    const clonedDoc = serializer.deserialize(serialized);
    
    // Using presets
    const minimalSerializer = DOMUtils.createSerializer('minimal');
    const secureSerializer = DOMUtils.createSerializer('secure');
    
    // Serialize specific element with Shadow DOM
    const customElement = document.querySelector('my-custom-element');
    const serializedElement = serializer.serialize(customElement);
    
    // JSON utilities
    const jsonString = DOMUtils.serializeToJSON(document.body);
    const restored = DOMUtils.deserializeFromJSON(jsonString);
    
    // Deep clone with Shadow DOM support
    const clone = DOMUtils.deepClone(document.body, { includeShadowDOM: true });
    
    */

    function serializeNodeToJSON(nodeElement) {
      return DOMUtils.serializeToJSON(nodeElement, {includeStyles: false});
    }

    function deserializeNodeFromJSON(jsonString) {
      return DOMUtils.deserializeFromJSON(jsonString);
    }

  /**
   * Checks if a point is inside a bounding box
   * 
   * @param point The point to check
   * @param box The bounding box
   * @returns boolean indicating if the point is inside the box
   */
  function isPointInsideBox(point, box) {
    return point.x >= box.x &&
          point.x <= box.x + box.width &&
          point.y >= box.y &&
          point.y <= box.y + box.height;
  }

  /**
   * Calculates the overlap area between two bounding boxes
   * 
   * @param box1 First bounding box
   * @param box2 Second bounding box
   * @returns The overlap area
   */
  function calculateOverlap(box1, box2) {
    const xOverlap = Math.max(0,
      Math.min(box1.x + box1.width, box2.x + box2.width) -
      Math.max(box1.x, box2.x)
    );
    const yOverlap = Math.max(0,
      Math.min(box1.y + box1.height, box2.y + box2.height) -
      Math.max(box1.y, box2.y)
    );
    return xOverlap * yOverlap;
  }

  /**
   * Finds an exact match between candidate elements and the actual interaction element
   * 
   * @param candidate_elements Array of candidate element infos
   * @param actualInteractionElementInfo The actual interaction element info
   * @returns The matching candidate element info, or null if no match is found
   */
  function findExactMatch(candidate_elements, actualInteractionElementInfo) {
    if (!actualInteractionElementInfo.element) {
      return null;
    }

    const exactMatch = candidate_elements.find(elementInfo => 
      elementInfo.element && elementInfo.element === actualInteractionElementInfo.element
    );
    
    if (exactMatch) {
      console.log('✅ Found exact element match:', {
        matchedElement: exactMatch.element?.tagName,
        matchedElementClass: exactMatch.element?.className,
        index: exactMatch.index
      });
      return exactMatch;
    }
    
    return null;
  }

  /**
   * Finds a match by traversing up the parent elements
   * 
   * @param candidate_elements Array of candidate element infos
   * @param actualInteractionElementInfo The actual interaction element info
   * @returns The matching candidate element info, or null if no match is found
   */
  function findParentMatch(candidate_elements, actualInteractionElementInfo) {
    if (!actualInteractionElementInfo.element) {
      return null;
    }

    let element = actualInteractionElementInfo.element;
    while (element.parentElement) {
      element = element.parentElement;
      const parentMatch = candidate_elements.find(candidate => 
        candidate.element && candidate.element === element
      );
      
      if (parentMatch) {
        console.log('✅ Found parent element match:', {
          matchedElement: parentMatch.element?.tagName,
          matchedElementClass: parentMatch.element?.className,
          index: parentMatch.index,
          depth: element.tagName
        });
        return parentMatch;
      }
      
      // Stop if we hit another candidate element
      if (candidate_elements.some(candidate => 
        candidate.element && candidate.element === element
      )) {
        console.log('⚠️ Stopped parent search - hit another candidate element:', element.tagName);
        break;
      }
    }
    
    return null;
  }

  /**
   * Finds a match based on spatial relationships between elements
   * 
   * @param candidate_elements Array of candidate element infos
   * @param actualInteractionElementInfo The actual interaction element info
   * @returns The matching candidate element info, or null if no match is found
   */
  function findSpatialMatch(candidate_elements, actualInteractionElementInfo) {
    if (!actualInteractionElementInfo.element || !actualInteractionElementInfo.bounding_box) {
      return null;
    }

    const actualBox = actualInteractionElementInfo.bounding_box;
    let bestMatch = null;
    let bestScore = 0;

    for (const candidateInfo of candidate_elements) {
      if (!candidateInfo.bounding_box) continue;
      
      const candidateBox = candidateInfo.bounding_box;
      let score = 0;

      // Check if actual element is contained within candidate
      if (isPointInsideBox({ x: actualBox.x, y: actualBox.y }, candidateBox) &&
          isPointInsideBox({ x: actualBox.x + actualBox.width, y: actualBox.y + actualBox.height }, candidateBox)) {
        score += 100; // High score for containment
      }

      // Calculate overlap area as a factor
      const overlap = calculateOverlap(actualBox, candidateBox);
      score += overlap;

      // Consider proximity if no containment
      if (score === 0) {
        const distance = Math.sqrt(
          Math.pow((actualBox.x + actualBox.width/2) - (candidateBox.x + candidateBox.width/2), 2) +
          Math.pow((actualBox.y + actualBox.height/2) - (candidateBox.y + candidateBox.height/2), 2)
        );
        // Convert distance to a score (closer = higher score)
        score = 1000 / (distance + 1);
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = candidateInfo;
        console.log('📏 New best spatial match:', {
          element: candidateInfo.element?.tagName,
          class: candidateInfo.element?.className,
          index: candidateInfo.index,
          score: score
        });
      }
    }

    if (bestMatch) {
      console.log('✅ Final spatial match selected:', {
      element: bestMatch.element?.tagName,
      class: bestMatch.element?.className,
      index: bestMatch.index,
      finalScore: bestScore
    });
    return bestMatch;
  }

  return null;
  }

  /**
   * Finds a matching candidate element for an actual interaction element
   * 
   * @param candidate_elements Array of candidate element infos
   * @param actualInteractionElementInfo The actual interaction element info
   * @returns The matching candidate element info, or null if no match is found
   */
  function findMatchingCandidateElementInfo(candidate_elements, actualInteractionElementInfo) {
    if (!actualInteractionElementInfo.element || !actualInteractionElementInfo.bounding_box) {
      console.error('❌ Missing required properties in actualInteractionElementInfo');
      return null;
    }

    console.log('🔍 Starting element matching for:', {
      clickedElement: actualInteractionElementInfo.element.tagName,
      clickedElementClass: actualInteractionElementInfo.element.className,
      totalCandidates: candidate_elements.length
    });

    // First try exact element match
    const exactMatch = findExactMatch(candidate_elements, actualInteractionElementInfo);
    if (exactMatch) {
      return exactMatch;
    }
    console.log('❌ No exact element match found, trying parent matching...');

    // Try finding closest clickable parent
    const parentMatch = findParentMatch(candidate_elements, actualInteractionElementInfo);
    if (parentMatch) {
      return parentMatch;
    }
    console.log('❌ No parent match found, falling back to spatial matching...');

    // If no exact or parent match, look for spatial relationships
    const spatialMatch = findSpatialMatch(candidate_elements, actualInteractionElementInfo);
    if (spatialMatch) {
      return spatialMatch;
    }

    console.error('❌ No matching element found for actual interaction element:', actualInteractionElementInfo);
    return null;
  }

  const highlight = {
    execute: async function(elementTypes, handleScroll=false) {
      const elements = await findElements(elementTypes);
      highlightElements(elements, handleScroll);
      return elements;
    },

    unexecute: function(handleScroll=false) {
      unhighlightElements(handleScroll);
    },

    generateJSON: async function() {
      const json = {};

     // Capture viewport dimensions
     const viewportData = {
      width: window.innerWidth,
      height: window.innerHeight,
      documentWidth: document.documentElement.clientWidth,
      documentHeight: document.documentElement.clientHeight,
      timestamp: new Date().toISOString()
    };

      // Add viewport data to the JSON output
      json.viewport = viewportData;


      await Promise.all(Object.values(ElementTag).map(async elementType => {
        const elements = await findElements(elementType);
        json[elementType] = elements;
      }));

      // Serialize the JSON object
      const jsonString = JSON.stringify(json, null, 4); // Pretty print with 4 spaces

      console.log(`JSON: ${jsonString}`);
      return jsonString;
    },

    getElementInfo
  };


  function unhighlightElements(handleScroll=false) {
    const documents = getAllFrames();
    documents.forEach(doc => {
      const overlay = doc.getElementById('highlight-overlay');
      if (overlay) {
        if (handleScroll) {
          // Remove event listeners
          doc.removeEventListener('scroll', overlay.scrollHandler, true);
          doc.removeEventListener('resize', overlay.resizeHandler);
        }
        overlay.remove();
      }
    });
  }




  async function findElements(elementTypes, verbose=true) {
    const typesArray = Array.isArray(elementTypes) ? elementTypes : [elementTypes];
    console.log('Starting element search for types:', typesArray);

    const elements = [];
    typesArray.forEach(elementType => {
      if (elementType === ElementTag.FILLABLE) {
        elements.push(...findFillables());
      }
      if (elementType === ElementTag.SELECTABLE) {
        elements.push(...findDropdowns());
      }
      if (elementType === ElementTag.CLICKABLE) {
        elements.push(...findClickables());
        elements.push(...findToggles());
        elements.push(...findCheckables());
      }
      if (elementType === ElementTag.NON_INTERACTIVE_ELEMENT) {
        elements.push(...findNonInteractiveElements());
      }
    });

    // console.log('Before uniquify:', elements.length);
    const elementsWithInfo = elements.map((element, index) => 
      getElementInfo(element, index)
    );

    
    
    const uniqueElements = uniquifyElements(elementsWithInfo);
    console.log(`Found ${uniqueElements.length} elements:`);
    
    // More comprehensive visibility check
    const visibleElements = uniqueElements.filter(elementInfo => {
      const el = elementInfo.element;
      const style = getComputedStyle(el);
      
      // Check various style properties that affect visibility
      if (style.display === 'none' || 
          style.visibility === 'hidden') {
        return false;
      }
      
      // Check if element has non-zero dimensions
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return false;
      }
      
      // Check if element is within viewport
      if (rect.bottom < 0 || 
          rect.top > window.innerHeight || 
          rect.right < 0 || 
          rect.left > window.innerWidth) {
        // Element is outside viewport, but still might be valid 
        // if user scrolls to it, so we'll include it
        return true;
      }
      
      return true;
    });
    
    console.log(`Out of which ${visibleElements.length} elements are visible:`);
    if (verbose) {
      visibleElements.forEach(info => {
        console.log(`Element ${info.index}:`, info);
      });
    }
    
    return visibleElements;
  }

  // elements is an array of objects with index, xpath
  function highlightElements(elements, handleScroll=false) {
    // console.log('[highlightElements] called with', elements.length, 'elements');
    // Create overlay if it doesn't exist and store it in a dictionary
    const documents = getAllFrames();  
    let overlays = {};
    documents.forEach(doc => {
      let overlay = doc.getElementById('highlight-overlay');
      if (!overlay) {
        overlay = doc.createElement('div');
        overlay.id = 'highlight-overlay';
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2147483647;
      `;
        doc.body.appendChild(overlay);
        // console.log('[highlightElements] Created overlay in document:', doc);
      }
      overlays[doc.documentURI] = overlay;
    });
    

    const updateHighlights = (doc = null) => {
      if (doc) {
        overlays[doc.documentURI].innerHTML = '';
      } else {
        Object.values(overlays).forEach(overlay => { overlay.innerHTML = ''; });
      }    
      elements.forEach((elementInfo, idx) => {
        //console.log(`[highlightElements] Processing element ${idx}:`, elementInfo.tag, elementInfo.css_selector, elementInfo.bounding_box);
        let element = elementInfo.element; //getElementByXPathOrCssSelector(elementInfo);
        if (!element) {
          element = getElementByXPathOrCssSelector(elementInfo);
          if (!element) {
            console.warn('[highlightElements] Could not find element for:', elementInfo);
            return;
          }
        }
        //if highlights requested for a specific doc, skip unrelated elements
        if (doc && element.ownerDocument !== doc) {
          console.log("[highlightElements] Skipped element since it doesn't belong to document", doc);
          return;
        }
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          console.warn('[highlightElements] Element has zero dimensions:', elementInfo);
          return;
        }
        // Create border highlight (red rectangle)
        // use ownerDocument to support iframes/frames
        const highlight = element.ownerDocument.createElement('div');
        highlight.style.cssText = `
        position: fixed;
        left: ${rect.x}px;
        top: ${rect.y}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        border: 1px solid rgb(255, 0, 0);
        transition: all 0.2s ease-in-out;
      `;
        // Create index label container - now positioned to the right and slightly up
        const labelContainer = element.ownerDocument.createElement('div');
        labelContainer.style.cssText = `
        position: absolute;
        right: -10px;     /* Offset to the right */
        top: -10px;       /* Offset upwards */
        padding: 4px;
        background-color: rgba(255, 255, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
      `;
        const text = element.ownerDocument.createElement('span');
        text.style.cssText = `
        color: rgb(0, 0, 0, 0.8);
        font-family: 'Courier New', Courier, monospace;
        font-size: 12px;
        font-weight: bold;
        line-height: 1;
      `;
        text.textContent = elementInfo.index;
        labelContainer.appendChild(text);
        highlight.appendChild(labelContainer);      
        overlays[element.ownerDocument.documentURI].appendChild(highlight);
        
      });
    };

    // Initial highlight
    updateHighlights();

    if (handleScroll) {
      documents.forEach(doc => {
        // Update highlights on scroll and resize
        console.log('registering scroll and resize handlers for document: ', doc);
        const scrollHandler = () => {
          requestAnimationFrame(() => updateHighlights(doc));
        };
        const resizeHandler = () => {
          updateHighlights(doc);
        };
        doc.addEventListener('scroll', scrollHandler, true);
        doc.addEventListener('resize', resizeHandler);
        // Store event handlers for cleanup
        overlays[doc.documentURI].scrollHandler = scrollHandler;
        overlays[doc.documentURI].resizeHandler = resizeHandler;
      });    
    }
  }

  // function unexecute() {
  //   unhighlightElements();
  // }

  // Make it available globally for both Extension and Playwright
  if (typeof window !== 'undefined') {
    function stripElementRefs(elementInfo) {
      if (!elementInfo) return null;
      const { element, ...rest } = elementInfo;
      return rest;
    }

    window.ProboLabs = window.ProboLabs || {};

    // --- Caching State ---
    window.ProboLabs.candidates = [];
    window.ProboLabs.actual = null;
    window.ProboLabs.matchingCandidate = null;

    // --- Methods ---
    /**
     * Find and cache candidate elements of a given type (e.g., 'CLICKABLE').
     * NOTE: This function is async and must be awaited from Playwright/Node.
     */
    window.ProboLabs.findAndCacheCandidateElements = async function(elementType) {
      //console.log('[ProboLabs] findAndCacheCandidateElements called with:', elementType);
      const found = await findElements(elementType);
      window.ProboLabs.candidates = found;
      // console.log('[ProboLabs] candidates set to:', found, 'type:', typeof found, 'isArray:', Array.isArray(found));
      return found.length;
    };

    window.ProboLabs.findAndCacheActualElement = function(cssSelector, iframeSelector, isHover=false) {
      // console.log('[ProboLabs] findAndCacheActualElement called with:', cssSelector, iframeSelector);
      let el = findElement(document, iframeSelector, cssSelector);
      if(isHover) {
        const visibleElement = findClosestVisibleElement(el);
        if (visibleElement) {
          el = visibleElement;
        }
      }
      if (!el) {
        window.ProboLabs.actual = null;
        // console.log('[ProboLabs] actual set to null');
        return false;
      }
      window.ProboLabs.actual = getElementInfo(el, -1);
      // console.log('[ProboLabs] actual set to:', window.ProboLabs.actual);
      return true;
    };

    window.ProboLabs.findAndCacheMatchingCandidate = function() {
      // console.log('[ProboLabs] findAndCacheMatchingCandidate called');
      if (!window.ProboLabs.candidates.length || !window.ProboLabs.actual) {
        window.ProboLabs.matchingCandidate = null;
        // console.log('[ProboLabs] matchingCandidate set to null');
        return false;
      }
      window.ProboLabs.matchingCandidate = findMatchingCandidateElementInfo(window.ProboLabs.candidates, window.ProboLabs.actual);
      // console.log('[ProboLabs] matchingCandidate set to:', window.ProboLabs.matchingCandidate);
      return !!window.ProboLabs.matchingCandidate;
    };

    window.ProboLabs.highlightCachedElements = function(which) {
      let elements = [];
      if (which === 'candidates') elements = window.ProboLabs.candidates;
      if (which === 'actual' && window.ProboLabs.actual) elements = [window.ProboLabs.actual];
      if (which === 'matching' && window.ProboLabs.matchingCandidate) elements = [window.ProboLabs.matchingCandidate];
      console.log(`[ProboLabs] highlightCachedElements ${which} with ${elements.length} elements`);
      highlightElements(elements);
    };

    window.ProboLabs.unhighlight = function() {
      // console.log('[ProboLabs] unhighlight called');
      unhighlightElements();
    };

    window.ProboLabs.reset = function() {
      console.log('[ProboLabs] reset called');
      window.ProboLabs.candidates = [];
      window.ProboLabs.actual = null;
      window.ProboLabs.matchingCandidate = null;
      unhighlightElements();
    };

    window.ProboLabs.getCandidates = function() {
      // console.log('[ProboLabs] getCandidates called. candidates:', window.ProboLabs.candidates, 'type:', typeof window.ProboLabs.candidates, 'isArray:', Array.isArray(window.ProboLabs.candidates));
      const arr = Array.isArray(window.ProboLabs.candidates) ? window.ProboLabs.candidates : [];
      return arr.map(stripElementRefs);
    };
    window.ProboLabs.getActual = function() {
      return stripElementRefs(window.ProboLabs.actual);
    };
    window.ProboLabs.getMatchingCandidate = function() {
      return stripElementRefs(window.ProboLabs.matchingCandidate);
    };

    // Retain existing API for backward compatibility
    window.ProboLabs.ElementTag = ElementTag;
    window.ProboLabs.highlightElements = highlightElements;
    window.ProboLabs.unhighlightElements = unhighlightElements;
    window.ProboLabs.findElements = findElements;
    window.ProboLabs.getElementInfo = getElementInfo;
    window.ProboLabs.highlight = window.ProboLabs.highlight;
    window.ProboLabs.unhighlight = window.ProboLabs.unhighlight;

    // --- Utility Functions ---
    function findClosestVisibleElement(element) {
      let current = element;
      while (current) {
        const style = window.getComputedStyle(current);
        if (
          style &&
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          current.offsetWidth > 0 &&
          current.offsetHeight > 0
        ) {
          return current;
        }
        if (!current.parentElement || current === document.body) break;
        current = current.parentElement;
      }
      return null;
    }
  }

  exports.ElementInfo = ElementInfo;
  exports.ElementTag = ElementTag;
  exports.deserializeNodeFromJSON = deserializeNodeFromJSON;
  exports.detectScrollableContainers = detectScrollableContainers;
  exports.findElement = findElement;
  exports.findElements = findElements;
  exports.generateCssPath = generateCssPath;
  exports.getAriaLabelledByText = getAriaLabelledByText;
  exports.getContainingIframe = getContainingIframe;
  exports.getElementInfo = getElementInfo;
  exports.getParentNode = getParentNode;
  exports.getRobustSelector = getRobustSelector;
  exports.highlight = highlight;
  exports.highlightElements = highlightElements;
  exports.isScrollableContainer = isScrollableContainer;
  exports.serializeNodeToJSON = serializeNodeToJSON;
  exports.unhighlightElements = unhighlightElements;

}));
//# sourceMappingURL=probolabs.umd.js.map
