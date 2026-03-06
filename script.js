const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const yearSpan = document.getElementById("year");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

const visitsInput = document.getElementById("visits");
const spendInput = document.getElementById("spend");
const calcBtn = document.getElementById("calc-btn");
const pointsMonthSpan = document.getElementById("points-month");
const creditMonthSpan = document.getElementById("credit-month");

function calculateRewards() {
  if (!visitsInput || !spendInput || !pointsMonthSpan || !creditMonthSpan) {
    return;
  }

  const visits = Math.max(0, Number(visitsInput.value) || 0);
  const spend = Math.max(0, Number(spendInput.value) || 0);

  const points = Math.round(visits * spend);
  const credit = Math.floor(points / 75) * 5;

  pointsMonthSpan.textContent = points.toString();
  creditMonthSpan.textContent = credit.toString();
}

if (calcBtn) {
  calcBtn.addEventListener("click", calculateRewards);
  calculateRewards();
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const successMessage = document.getElementById('formSuccessMessage');
  const livePlayersEl = document.getElementById('livePlayers');

  function setFieldError(name, message) {
    const errorEl = document.querySelector(`.field-error[data-for="${name}"]`);
    if (!errorEl) return;
    errorEl.textContent = message || '';
  }

  function clearErrors() {
    document.querySelectorAll('.field-error').forEach((el) => {
      el.textContent = '';
    });
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      clearErrors();
      successMessage?.classList.remove('visible');

      const data = new FormData(form);
      const payload = {
        firstName: data.get('firstName')?.toString().trim() || '',
        lastName: data.get('lastName')?.toString().trim() || '',
        email: data.get('email')?.toString().trim() || '',
        country: data.get('country')?.toString() || '',
        username: data.get('username')?.toString().trim() || '',
        promoCode: data.get('promoCode')?.toString().trim() || '',
        ageConfirm: data.get('ageConfirm') === 'on',
        marketingOptIn: data.get('marketingOptIn') === 'on',
        submittedAt: new Date().toISOString(),
      };

      let hasError = false;

      if (!payload.firstName) {
        setFieldError('firstName', 'First name is required.');
        hasError = true;
      }

      if (!payload.lastName) {
        setFieldError('lastName', 'Last name is required.');
        hasError = true;
      }

      if (!payload.email) {
        setFieldError('email', 'Email address is required.');
        hasError = true;
      } else if (!validateEmail(payload.email)) {
        setFieldError('email', 'Enter a valid email address.');
        hasError = true;
      }

      if (!payload.country) {
        setFieldError('country', 'Please select your country.');
        hasError = true;
      }

      if (!payload.username || payload.username.length < 4) {
        setFieldError('username', 'Username must be at least 4 characters.');
        hasError = true;
      }

      if (!payload.ageConfirm) {
        setFieldError('ageConfirm', 'You must confirm your age to continue.');
        hasError = true;
      }

      if (hasError) {
        return;
      }

      console.group('OrionStar signup demo payload');
      console.info(
        'Form submissions are only logged in the browser for now. Connect this handler to your backend or email service to capture real data.'
      );
      console.log(payload);
      console.groupEnd();

      form.reset();
      successMessage?.classList.add('visible');

      setTimeout(() => {
        successMessage?.classList.remove('visible');
      }, 6000);
    });
  }

  if (livePlayersEl) {
    const base = parseInt(livePlayersEl.textContent || '0', 10) || 2100;

    setInterval(() => {
      const jitter = Math.round((Math.random() - 0.5) * 80);
      const value = Math.max(500, base + jitter);
      livePlayersEl.textContent = value.toLocaleString('en-US');
    }, 3200);
  }

  const dealsSlider = document.querySelector('.deals-slider');
  if (dealsSlider) {
    const dayButtons = Array.from(dealsSlider.querySelectorAll('.deal-day'));
    const slides = Array.from(dealsSlider.querySelectorAll('.deal-slide'));

    if (dayButtons.length && slides.length) {
      const jsDay = new Date().getDay(); // 0 = Sun ... 6 = Sat
      const jsToIndexMap = [6, 0, 1, 2, 3, 4, 5]; // map JS day to our Mon–Sun index
      const todayIndex = jsToIndexMap[jsDay] ?? 0;

      let currentIndex = todayIndex >= 0 && todayIndex < slides.length ? todayIndex : 0;
      let rotationId;

      const applyHighlightTag = () => {
        slides.forEach((slide, idx) => {
          const tag = slide.querySelector('.deal-highlight');
          if (tag) {
            tag.style.display = idx === todayIndex ? 'inline-flex' : 'none';
          }
        });
      };

      const applyActive = (index) => {
        dayButtons.forEach((btn, i) => {
          btn.classList.toggle('active', i === index);
        });
        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === index);
        });
      };

      const startRotation = () => {
        if (rotationId) {
          clearInterval(rotationId);
        }
        rotationId = setInterval(() => {
          currentIndex = (currentIndex + 1) % slides.length;
          applyActive(currentIndex);
        }, 9000);
      };

      dayButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.index || '0');
          if (!Number.isNaN(idx)) {
            currentIndex = idx;
            applyActive(currentIndex);
            startRotation();
          }
        });
      });

      applyHighlightTag();
      applyActive(currentIndex);
      startRotation();
    }
  }
});

