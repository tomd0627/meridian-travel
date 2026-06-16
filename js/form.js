document.addEventListener('DOMContentLoaded', () => {
  var form = document.getElementById('inquiry-form');
  var step1 = document.getElementById('form-step-1');
  var step2 = document.getElementById('form-step-2');
  var nextBtn = document.getElementById('step-1-next');
  var backBtn = document.getElementById('step-2-back');
  var confirmation = document.getElementById('form-confirmation');
  var confirmationHeading = document.getElementById('form-confirmation-heading');
  var progressStep1 = document.querySelector('.form-progress__step[data-step="1"]');
  var progressStep2 = document.querySelector('.form-progress__step[data-step="2"]');

  var destination = document.getElementById('destination');
  var dateDeparture = document.getElementById('date-departure');
  var dateReturn = document.getElementById('date-return');
  var nameInput = document.getElementById('name');
  var emailInput = document.getElementById('email');
  var groupSize = document.getElementById('group-size');

  if (!form) return;

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function showError(inputEl, message) {
    var errorEl = document.getElementById(inputEl.getAttribute('aria-describedby'));
    if (errorEl) errorEl.textContent = message;
    inputEl.classList.add('has-error');
  }

  function clearError(inputEl) {
    var errorEl = document.getElementById(inputEl.getAttribute('aria-describedby'));
    if (errorEl) errorEl.textContent = '';
    inputEl.classList.remove('has-error');
  }

  // ── Validation ───────────────────────────────────────────────────────────────
  function validateStep1() {
    var valid = true;

    if (!destination.value) {
      showError(destination, 'Please select a destination.');
      valid = false;
    }

    if (!dateDeparture.value) {
      showError(dateDeparture, 'Please select a departure date.');
      valid = false;
    }

    if (!dateReturn.value) {
      showError(dateReturn, 'Please select a return date.');
      valid = false;
    } else if (dateDeparture.value && dateReturn.value <= dateDeparture.value) {
      showError(dateReturn, 'Return date must be after the departure date.');
      valid = false;
    }

    return valid;
  }

  function validateStep2() {
    var valid = true;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var groupVal = Number(groupSize.value);

    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please enter your full name.');
      valid = false;
    }

    if (!emailInput.value.trim()) {
      showError(emailInput, 'Please enter your email address.');
      valid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address.');
      valid = false;
    }

    if (!groupSize.value) {
      showError(groupSize, 'Please enter your group size.');
      valid = false;
    } else if (!Number.isInteger(groupVal) || groupVal < 1 || groupVal > 50) {
      showError(groupSize, 'Group size must be a whole number between 1 and 50.');
      valid = false;
    }

    return valid;
  }

  // ── Clear errors on correction ────────────────────────────────────────────────
  destination.addEventListener('change', () => {
    clearError(destination);
  });
  dateDeparture.addEventListener('change', () => {
    clearError(dateDeparture);
  });
  dateReturn.addEventListener('change', () => {
    clearError(dateReturn);
  });
  nameInput.addEventListener('input', () => {
    clearError(nameInput);
  });
  emailInput.addEventListener('input', () => {
    clearError(emailInput);
  });
  groupSize.addEventListener('input', () => {
    clearError(groupSize);
  });

  // ── Step 1 → Step 2 ──────────────────────────────────────────────────────────
  nextBtn.addEventListener('click', () => {
    if (!validateStep1()) return;

    step1.hidden = true;
    step1.classList.remove('is-active');
    step2.hidden = false;
    step2.classList.add('is-active');

    progressStep1.classList.remove('is-active');
    progressStep1.classList.add('is-done');
    progressStep2.classList.add('is-active');

    nameInput.focus();
  });

  // ── Step 2 → Step 1 ──────────────────────────────────────────────────────────
  backBtn.addEventListener('click', () => {
    step2.hidden = true;
    step2.classList.remove('is-active');
    step1.hidden = false;
    step1.classList.add('is-active');

    progressStep2.classList.remove('is-active');
    progressStep1.classList.remove('is-done');
    progressStep1.classList.add('is-active');
  });

  // ── Submit ───────────────────────────────────────────────────────────────────
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateStep2()) return;

    form.hidden = true;
    confirmation.hidden = false;
    confirmationHeading.focus();
  });
});
