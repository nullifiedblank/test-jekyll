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

document.addEventListener('DOMContentLoaded', function (e) {
  //Open / Close Navigation
  const mainNav = document.querySelector('nav');
  const menuTrigger = document.querySelector('.mobile-menu-trigger');
  menuTrigger.addEventListener('click', () => {
    mainNav.classList.toggle('mob-menu-is-active');
  });

  //Start Testimonial Carousel
  const testimonials = document.querySelector('.testimonials');
  setTimeout(() => {
    testimonials.classList.add('is-running');
  }, 4000);

  //Open / Close Modals
  const modalWrapper = document.querySelector('.modal-wrapper');
  const modalTriggers = modalWrapper.querySelectorAll('.modal-trigger');
  modalWrapper.addEventListener('click', e => {
    const target = e.target;
    if (target.matches('.modal-trigger')) {
      modalTriggers.forEach(btn => {
        //Prevent modal trigger flashing
        if (btn !== target && !btn.classList.contains('is-clicked')) {
          btn.classList.add('not-clicked');
        }
      });
      target.classList.toggle('is-clicked');
      target.classList.remove('not-clicked');
    } else if (target.matches('.modal-overlay')) {
      document.querySelector('.modal-trigger.is-clicked').classList.remove('is-clicked');
    }
  });

  //Close the item when clicking outside
  clickOutside();
});

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

document.addEventListener('DOMContentLoaded', function (e) {
  //Initialize quiz
  function initializeQuiz() {
    let vpWidth = viewport().width;
    const q2AImg = document.querySelector('.figure-q-to-a');
    const q2A2qImg = document.querySelector('.figure-q-to-a-to-q');
    const quiz = document.querySelector('#section-quiz');
    const quizContent = document.querySelector('#section-quiz .content');
    const quizContentSubtitle = quizContent.querySelector('.subtitle');
    const quizContentSubtitleMarginBtm = quizContentSubtitle ? parseInt(getComputedStyle(quizContentSubtitle).marginBottom) : 0;
    const quizContentTitle = quizContent.querySelector('h2');
    const quizDialogContainer = document.querySelector('.quiz-dialog-container');
    const stepTriggers = document.querySelectorAll('[data-step-trigger]');
    const lastStepTrigger = stepTriggers[stepTriggers.length - 1].dataset.stepTrigger;
    const secondToLastStepTrigger = stepTriggers[stepTriggers.length - 2].dataset.stepTrigger;
    const stepTargets = document.querySelectorAll('.quiz-step');
    const quizSteps = document.querySelector('.quiz-steps');
    const firstQuestion = document.querySelector('.quiz-question-step-1');
    const startQuestionMarginBottomMobile = 150;
    const startQuestionPaddingTopMobile = 24;
    const questionMarginBottom = 26;
    const questionPadding = 40;
    const resultField = document.querySelector('#result');
    let customTerm = '';
    let customTitle = '';
    let customLead = '';
    const questionCustomTerm = document.querySelector('.custom-term');
    const downloadBoxTitle = document.querySelector('.download-box-title');
    const downloadBoxLead = document.querySelector('.download-box-lead');
    const isSaf = isSafari();

    // Initialize shield variables with initial values of 0
    let noPersonalShield = 0;
    let level2Shield = 0;
    let level2ShieldWithFocusing = 0;
    let level3Shield = 0;
    let level3ShieldWithFocusing = 0;
    let level4Shield = 0;
    let level4ShieldWithFocusing = 0;
    let highestScore;
    let highestScoringVariable;

    // Function to update the shield values based on the selected answer
    const updateShieldValues = answer => {
      switch (answer) {
        case 'q-1-a':
        case 'q-2-a':
        case 'q-3-a':
        case 'q-4-a':
        case 'q-5-a':
        case 'q-6-a':
        case 'q-9-a':
          noPersonalShield += 5;
          level2Shield += 3;
          level2ShieldWithFocusing += 3;
          break;

        case 'q-1-b':
        case 'q-2-b':
        case 'q-3-b':
        case 'q-4-b':
        case 'q-5-b':
        case 'q-6-b':
        case 'q-9-b':
          level2Shield += 5;
          level2ShieldWithFocusing += 5;
          level3Shield += 5;
          level3ShieldWithFocusing += 5;
          break;

        case 'q-1-c':
        case 'q-2-c':
        case 'q-3-c':
        case 'q-4-c':
        case 'q-5-c':
        case 'q-6-c':
        case 'q-9-c':
          level3Shield += 10;
          level3ShieldWithFocusing += 10;
          break;

        case 'q-1-d':
        case 'q-2-d':
        case 'q-3-d':
        case 'q-4-d':
        case 'q-5-d':
        case 'q-6-d':
        case 'q-9-d':
          level3Shield += 10;
          level3ShieldWithFocusing += 10;
          level4Shield += 10;
          level4ShieldWithFocusing += 10;
          break;

        case 'q-7-a':
        case 'q-7-b':
        case 'q-7-c':
        case 'q-7-d':
          noPersonalShield += 0;
          break;

        case 'q-8-a':
        case 'q-8-b':
        case 'q-8-d':
        case 'q-8-f':
          level3Shield += 10;
          level3ShieldWithFocusing += 10;
          level4Shield += 10;
          level4ShieldWithFocusing += 10;
          break;

        case 'q-8-c':
          level2Shield += 4;
          level2ShieldWithFocusing += 4;
          level3Shield += 10;
          level3ShieldWithFocusing += 10;
          level4Shield += 10;
          level4ShieldWithFocusing += 10;
          break;

        case 'q-8-e':
          level2Shield += 5;
          level2ShieldWithFocusing += 5;
          level3Shield += 10;
          level3ShieldWithFocusing += 10;
          level4Shield += 10;
          level4ShieldWithFocusing += 10;
          break;

        case 'q-9-a':
          noPersonalShield += 5;
          level2Shield += 2;
          level2ShieldWithFocusing += 2;
          break;

        case 'q-10-a':
          level2ShieldWithFocusing += 10;
          level3ShieldWithFocusing += 10;
          level4ShieldWithFocusing += 10;
          break;

        case 'q-10-b':
          level2ShieldWithFocusing -= 1;
          level3ShieldWithFocusing -= 1;
          level4ShieldWithFocusing -= 1;
          break;

        default:
          break;
      }
    };

    if (stepTriggers && stepTargets && quizSteps) {
      //Calculate Quiz height based on biggest quiz step
      function setQuizHeight() {
        const biggestHeight = getBiggestHeight(stepTargets);
        quizSteps.style.height = `${biggestHeight}px`;
      }

      document.fonts.ready.then(function () {
        //Position first Question
        const firstQuestionHeight = firstQuestion.querySelector('p').offsetHeight + firstQuestion.querySelector('span').offsetHeight + questionPadding;
        const initialFirstQuestionPosition = firstQuestion ? (firstQuestionHeight + questionMarginBottom) / 2 : 0;
        quizDialogContainer.style.paddingTop = `${initialFirstQuestionPosition}px`;
        stepTargets.forEach(step => {
          if (!step.classList.contains('quiz-start')) {
            step.querySelector('.content').style.paddingTop = `${initialFirstQuestionPosition * 2}px`;
          }
        });

        //Calculate quiz height
        if (vpWidth < 640) {
          if (quizSteps.dataset.step === 'step-0') {
            quizSteps.style.height = `${document.querySelector('.quiz-start .button-wrapper').offsetHeight + document.querySelector('.quiz-start .speech-bubble p').offsetHeight + questionPadding + startQuestionMarginBottomMobile + startQuestionPaddingTopMobile}px`;
            quizContent.style.height = `${quizContentSubtitle.offsetHeight + quizContentTitle.offsetHeight + quizContentSubtitleMarginBtm}px`;
          }
        } else {
          setQuizHeight();
        }
      });

      window.addEventListener('resize', () => {
        vpWidth = viewport().width;
        if (vpWidth < 640) {
          if (quizSteps.dataset.step === 'step-0') {
            quizSteps.style.height = `${document.querySelector('.quiz-start').offsetHeight}px`;
            quizContent.style.height = `${quizContentSubtitle.offsetHeight + quizContentTitle.offsetHeight + quizContentSubtitleMarginBtm}px`;
          } else {
            quizContent.style.height = 0;
          }
        } else {
          quizContent.style.height = 'auto';
          setQuizHeight();
        }
      });

      //Initial values
      const quizData = {};

      stepTargets.forEach((step, index) => {
        // Create dynamic step keys
        const stepNumber = `step-${index}`;

        // Determine if the step contains radio buttons or checkboxes
        const isRadio = step.querySelector('input[type="radio"]') !== null;
        const isCheckbox = step.querySelector('input[type="checkbox"]') !== null;

        // If the step contains radio buttons, values and labels will be strings
        if (isRadio) {
          quizData[stepNumber] = {
            value: '',
            label: ''
          };
        }

        // If the step contains checkboxes, values and labels will be arrays
        if (isCheckbox) {
          quizData[stepNumber] = {
            values: [],
            labels: []
          };
        }
      });

      //Create an array of animated steps
      const animatedSteps = Object.keys(quizData).filter(step => step !== 'step-1');

      //Handle Clicks
      quizSteps.addEventListener('click', e => {
        e.stopPropagation();

        if (e.target.matches('[data-step-trigger]')) {
          //Handle Quiz Step Transitions
          e.preventDefault();
          const trigger = e.target;
          const triggerTarget = document.querySelector(`[data-step]`);
          const targetIdentifier = trigger.dataset.stepTrigger;
          const currentStep = triggerTarget.dataset.step;
          const nextTrigger = document.querySelector(`.quiz-${targetIdentifier} [data-step-trigger]`);

          //Calculate quiz height based on next step height on mobile devices
          if (vpWidth < 640) {
            quizSteps.style.height = `${document.querySelector(`.quiz-${targetIdentifier}`).offsetHeight}px`;
          }

          // Retrieve margin and positions
          const currentPosition = firstQuestion ? parseInt(getComputedStyle(firstQuestion).marginTop) * -1 : 0;

          // Find the step-related DOM elements
          const stepAnswer = document.querySelector(`.quiz-answer-${currentStep}`);
          const currentQuestion = document.querySelector(`.quiz-question-${currentStep}`);
          const nextQuestion = document.querySelector(`.quiz-question-${targetIdentifier}`);

          // Calculate movement distances
          const initialMovementDistance = stepAnswer ? stepAnswer.offsetHeight + questionMarginBottom : 0;
          const secondMovementDistance = nextQuestion ? nextQuestion.offsetHeight + questionMarginBottom : 0;

          // Update the current step in the dataset
          triggerTarget.dataset.step = targetIdentifier;

          // Replace CSS class for step transition
          replaceCSSClass(quiz, 'is-step', `is-${targetIdentifier}`);

          //Shrink quiz content on mobile devices
          if (vpWidth < 640 && targetIdentifier == 'step-1') {
            quizContent.style.height = '0px';
          }

          // Apply additional movement only if `answer` exists
          if (stepAnswer) {
            firstQuestion.style.marginTop = `-${initialMovementDistance + currentPosition}px`;

            //Control Animated Figures
            if ([...animatedSteps, secondToLastStepTrigger].includes(targetIdentifier)) {
              quiz.classList.remove('show-q');

              if (isSaf) {
                resetAnimationSafari(q2A2qImg);
              } else {
                resetAnimation(q2A2qImg);
              }
              quiz.classList.add('show-q-to-a-to-q');
              setTimeout(() => {
                quiz.classList.add('show-q');
              }, 1100);

              //Activate button
              setTimeout(() => {
                nextTrigger.style.pointerEvents = 'auto';
              }, 1200);
            } else if (targetIdentifier == lastStepTrigger) {
              quiz.classList.remove('show-q-to-a-to-q');
              quiz.classList.remove('show-q');
              if (isSaf) {
                resetAnimationSafari(q2AImg);
              } else {
                resetAnimation(q2AImg);
              }
              quiz.classList.add('show-q-to-a');
              setTimeout(() => {
                quiz.classList.remove('show-q-to-a');
                quiz.classList.add('show-a');
              }, 500);
            }

            // Use setTimeout to delay transition to the next question
            setTimeout(() => {
              const sum = initialMovementDistance + secondMovementDistance + currentPosition;
              firstQuestion.style.marginTop = `-${sum}px`;
              currentQuestion.classList.add('is-blurred');
              stepAnswer.classList.add('is-blurred');
            }, 500);

            //Handle variable content
            if (targetIdentifier == secondToLastStepTrigger) {
              // Update shield values
              Object.keys(quizData).forEach(stepNumber => {
                const stepData = quizData[stepNumber];

                // Handle radio button (single answer)
                if (stepData.value) {
                  updateShieldValues(stepData.value);
                }

                // Handle checkboxes (multiple answers)
                if (stepData.values && stepData.values.length > 0) {
                  stepData.values.forEach(value => {
                    updateShieldValues(value);
                  });
                }
              });

              // Find the variable with the highest score
              highestScoringVariable = (() => {
                // Apply tie-breaking logic for level priorities
                if (level3Shield === level4Shield) {
                  level4Shield = Math.max(level3Shield, level4Shield);
                }

                if (level3ShieldWithFocusing === level4ShieldWithFocusing) {
                  level4ShieldWithFocusing = Math.max(level3ShieldWithFocusing, level4ShieldWithFocusing);
                }

                if (level2Shield === level3Shield) {
                  level3Shield = Math.max(level2Shield, level3Shield);
                }

                if (level2ShieldWithFocusing === level3ShieldWithFocusing) {
                  level3ShieldWithFocusing = Math.max(level2ShieldWithFocusing, level3ShieldWithFocusing);
                }

                //Find the highest score after prioritizing levels
                highestScore = Math.max(noPersonalShield, level2Shield, level2ShieldWithFocusing, level3Shield, level3ShieldWithFocusing, level4Shield, level4ShieldWithFocusing);

                // Return the shield with the highest score
                switch (highestScore) {
                  case noPersonalShield:
                    return 'No Personal Shield';

                  case level4Shield:
                    return 'Level 4 Shield';

                  case level4ShieldWithFocusing:
                    return 'Level 4 Shield with Focusing';

                  case level3Shield:
                    return 'Level 3 Shield';

                  case level3ShieldWithFocusing:
                    return 'Level 3 Shield with Focusing';

                  case level2Shield:
                    return 'Level 2 Shield';

                  case level2ShieldWithFocusing:
                    return 'Level 2 Shield with Focusing';

                  default:
                    return 'No highest scoring shield';
                }
              })();

              //Change text in the question 11
              customTerm = (() => {
                switch (highestScore) {
                  case noPersonalShield:
                    return 'XYZ ABC';

                  case level4Shield:
                    return 'XYZ ABC';

                  case level4ShieldWithFocusing:
                    return 'XYZ ABC';

                  case level3Shield:
                    return 'XYZ ABC';

                  case level3ShieldWithFocusing:
                    return 'XYZ ABC';

                  case level2Shield:
                    return 'XYZ ABC';

                  case level2ShieldWithFocusing:
                    return 'XYZ ABC';
                }
              })();
              questionCustomTerm.innerText = customTerm;
            } else if (targetIdentifier == lastStepTrigger) {
              //Change title of the download box
              customTitle = (() => {
                switch (highestScore) {
                  case noPersonalShield:
                    return 'Title of this document based on their entries/inputs here';

                  case level4Shield:
                    return 'Title of this document based on their entries/inputs here';

                  case level4ShieldWithFocusing:
                    return 'Title of this document based on their entries/inputs here';

                  case level3Shield:
                    return 'Title of this document based on their entries/inputs here';

                  case level3ShieldWithFocusing:
                    return 'Title of this document based on their entries/inputs here';

                  case level2Shield:
                    return 'Title of this document based on their entries/inputs here';

                  case level2ShieldWithFocusing:
                    return 'Title of this document based on their entries/inputs here';
                }
              })();
              downloadBoxTitle.innerText = customTitle;

              //Change lead paragraph text of the download box
              customLead = (() => {
                switch (highestScore) {
                  case noPersonalShield:
                    return 'Learn how to ABC without XYZ with this downloadable guide, selected specifically for people who experience challenges like you described. Words to that effect anyway.';

                  case level4Shield:
                    return 'Learn how to ABC without XYZ with this downloadable guide, selected specifically for people who experience challenges like you described. Words to that effect anyway.';

                  case level4ShieldWithFocusing:
                    return 'Learn how to ABC without XYZ with this downloadable guide, selected specifically for people who experience challenges like you described. Words to that effect anyway.';

                  case level3Shield:
                    return 'Learn how to ABC without XYZ with this downloadable guide, selected specifically for people who experience challenges like you described. Words to that effect anyway.';

                  case level3ShieldWithFocusing:
                    return 'Learn how to ABC without XYZ with this downloadable guide, selected specifically for people who experience challenges like you described. Words to that effect anyway.';

                  case level2Shield:
                    return 'Learn how to ABC without XYZ with this downloadable guide, selected specifically for people who experience challenges like you described. Words to that effect anyway.';

                  case level2ShieldWithFocusing:
                    return 'Learn how to ABC without XYZ with this downloadable guide, selected specifically for people who experience challenges like you described. Words to that effect anyway.';
                }
              })();
              downloadBoxLead.innerText = customLead;

              //Populate result input field
              resultField.value = highestScoringVariable;

              //Recalculcate last step height
              quizSteps.style.height = `${document.querySelector(`.quiz-${targetIdentifier}`).offsetHeight}px`;
            }
          } else {
            firstQuestion.style.marginTop = `-${(secondMovementDistance + currentPosition) / 2}px`;
          }
        } else if (e.target.tagName === 'INPUT' && (e.target.type === 'radio' || e.target.type === 'checkbox')) {
          //Handle Quiz Choices
          const target = e.target;
          const step = target.name;
          const value = target.value;
          const label = document.querySelector(`label[for="${target.id}"] .choice-title`).innerText;
          const continueButton = document.querySelector(`.quiz-${step} .button`);
          const stepAnswer = document.querySelector(`.quiz-answer-${step}`);

          if (target.type === 'radio') {
            quizData[step].value = value;
            quizData[step].label = label;
            if (stepAnswer) {
              stepAnswer.innerText = label;
            }
          } else {
            const i = quizData[step].values.indexOf(value);
            const j = quizData[step].labels.indexOf(label);

            if (i === -1) {
              quizData[step].values.push(value);
            } else {
              quizData[step].values.splice(i, 1);
            }

            if (j === -1) {
              quizData[step].labels.push(label);
            } else {
              quizData[step].labels.splice(i, 1);
            }

            if (stepAnswer) {
              stepAnswer.innerText = quizData[step].labels.join(', ');
            }
          }

          if (continueButton) {
            continueButton.disabled = !(quizData[step].value || quizData[step].values.length > 0);
          }
        }
      });
    }
  }

  initializeQuiz();
});
