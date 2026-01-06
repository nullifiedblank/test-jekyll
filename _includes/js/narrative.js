document.addEventListener('DOMContentLoaded', function (e) {
  const figWomanContainer = document.querySelector('.fig-woman');
  let scrollDirection;
  let oldScrollY = window.scrollY;
  let onLoad = true;
  let vpHeight = viewport().height;
  const pi2ProbImg = document.querySelector('.pi-to-prob-fig');
  const prob2SolImg = document.querySelector('.prob-to-sol-fig');
  const prob2PiImg = document.querySelector('.prob-to-pi-fig');
  const sol2ProbImg = document.querySelector('.sol-to-prob-fig');
  const isSaf = isSafari();

  //Remove transition on load
  if (onLoad) {
    document.body.classList.add('on-load');
    onLoad = false;
    setTimeout(() => {
      document.body.classList.remove('on-load');
    }, 700);
  }

  //Check scroll direction
  window.onscroll = function (e) {
    scrollDirection = oldScrollY < window.scrollY ? 'down' : 'up';
    oldScrollY = window.scrollY;
  };

  //Handle woman figure visibility
  function handleIntersection(entries) {
    const homeHero = document.querySelector('#home-hero');
    const homeProblem = document.querySelector('#home-problem');
    const homeSolution = document.querySelector('#home-solution');

    const showTransition = (className, delay = 1000) => {
      figWomanContainer.classList.add(className);
      setTimeout(() => {
        figWomanContainer.classList.remove(className);
      }, delay);
    };

    const handleScrollDown = () => {
      if (homeHero.classList.contains('is-visible') && homeProblem.classList.contains('is-visible')) {
        // Show pi to prob;
        if (isSaf) {
          resetAnimationSafari(pi2ProbImg);
        } else {
          resetAnimation(pi2ProbImg);
        }
        showTransition('show-pi-to-prob');
      } else if (homeProblem.classList.contains('is-visible') && homeSolution.classList.contains('is-visible')) {
        // Show prob to sol
        if (isSaf) {
          resetAnimationSafari(prob2SolImg);
        } else {
          resetAnimation(prob2SolImg);
        }
        showTransition('show-prob-to-sol', 1100);
      }
    };

    const handleScrollUp = () => {
      if (homeHero.classList.contains('is-visible') && !homeProblem.classList.contains('is-visible') && oldScrollY !== 0) {
        // Show prob to pi
        if (isSaf) {
          resetAnimationSafari(prob2PiImg);
        } else {
          resetAnimation(prob2PiImg);
        }
        showTransition('show-prob-to-pi');
      } else if (homeProblem.classList.contains('is-visible') && !homeSolution.classList.contains('is-visible')) {
        // Show sol to prob
        if (isSaf) {
          resetAnimationSafari(sol2ProbImg);
        } else {
          resetAnimation(sol2ProbImg);
        }
        showTransition('show-sol-to-prob', 1500);
      }
    };

    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        target.classList.add('is-visible');
        if (scrollDirection === 'down') {
          handleScrollDown();
        }
      } else {
        target.classList.remove('is-visible');
        if (scrollDirection === 'up') {
          handleScrollUp();
        }
      }
    });
  }

  const thresholdValue = vpHeight <= 800 ? 0.1 : 0.3;
  const observerOptions = { threshold: thresholdValue };
  const observer = new IntersectionObserver(handleIntersection, observerOptions);

  document.querySelectorAll('.group').forEach(section => {
    observer.observe(section);
  });

  //Handle figure woman top position
  function getElementDistanceFromTop(elementID) {
    const element = document.getElementById(elementID);
    return element ? element.offsetTop : 0;
  }

  // Create or update the <style> tag
  let style =
    document.querySelector('#fixed-styles') ||
    (() => {
      let s = document.createElement('style');
      s.id = 'fixed-styles';
      document.head.appendChild(s);
      return s;
    })();

  function updateFixedStyles() {
    const problemDistance = getElementDistanceFromTop('home-problem');
    const solutionDistance = getElementDistanceFromTop('home-solution');

    // Define CSS rules with dynamic values
    const css = `
        body:has(#home-problem.is-visible):not(:has(#home-solution.is-visible)) .fig-woman {
          top: calc(${problemDistance}px + 200px);
        }
        body:has(#home-solution.is-visible):not(:has(#home-product.is-visible)) .fig-woman,
        body:has(#home-product.is-visible) .fig-woman {
          top: calc(${solutionDistance}px + 90px);
        }
      `;

    style.textContent = css;
  }

  // Initial update of styles
  setTimeout(updateFixedStyles, 400);
  updateFixedStyles();

  // Update styles if the window is resized
  window.addEventListener('resize', updateFixedStyles);

  //Handle content visibility
  function handleContentIntersection(entries) {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        target.classList.add('is-visible');
      } else {
        target.classList.remove('is-visible');
      }
    });
  }
  const contentObserverOptions = { threshold: 0.2 };
  const contentObserver = new IntersectionObserver(handleContentIntersection, contentObserverOptions);
  document.querySelectorAll('.group .container').forEach(container => {
    contentObserver.observe(container);
  });
});
