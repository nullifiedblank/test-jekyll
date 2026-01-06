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
