//Calculate windows width and height
function viewport() {
  return { width: window.innerWidth, height: window.innerHeight };
}

//Find biggest element
function getBiggestHeight(array) {
  let maxHeight = 0;

  array.forEach(target => {
    const targetHeight = target.offsetHeight;
    if (targetHeight > maxHeight) {
      maxHeight = targetHeight;
    }
  });

  return maxHeight;
}

//Remove class
function replaceCSSClass(element, oldClassName, newClassName) {
  // Iterate through all classes of the element
  element.classList.forEach(className => {
    // If the class starts with oldClassName, remove it
    if (className.startsWith(oldClassName)) {
      element.classList.remove(className);
      element.classList.add(newClassName);
    }
  });
}

//Close the item when clicking outside
function clickOutside() {
  /*
    
    Attach attribute data-close-container="identifier" to the element outside which you want to the click to register
    attach attribute data-close-target="identifier" to the element you want to close, attach data-close-class="class-name" to the [data-close-container] element and define the class you want to remove from [data-close-target] element upon clicking outside the [data-close-container]. Class name defaults to 'is-visible'
  */
  'use strict';

  // Add event listener to the whole body
  document.body.addEventListener('click', function (event) {
    // Select all elements with the attribute `data-close-container`
    document.querySelectorAll('[data-close-container]').forEach(function (closeContainer) {
      const closeTargetAttr = closeContainer.getAttribute('data-close-container');
      const closeTarget = document.querySelector(`[data-close-target="${closeTargetAttr}"]`);
      const closeClass = closeContainer.getAttribute('data-close-class') || 'is-visible';

      // Check if the click is outside of the closeContainer
      if (!closeContainer.contains(event.target) && closeContainer !== event.target) {
        closeTarget.classList.remove(closeClass);
      }
    });
  });
}

//Reset animation
function resetAnimation(img) {
  const newImg = new Image();
  newImg.src = img.src;
  newImg.onload = () => (img.src = newImg.src);
}

function resetAnimationSafari(img) {
  fetch(img.src)
    .then(response => response.blob())
    .then(blob => {
      const objectURL = URL.createObjectURL(blob);
      img.src = '';
      void img.offsetWidth;
      img.src = objectURL;
    });
}

function isSafari() {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('safari') && !userAgent.includes('chrome');
}
