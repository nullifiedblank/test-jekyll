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
