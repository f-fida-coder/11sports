import { authApi } from '../api/client.js';

function setFieldError(input, message) {
  const hint = input.parentElement?.querySelector('[data-error]');
  if (!hint) return;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  hint.textContent = message;
}

function clearFieldError(input) {
  setFieldError(input, '');
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePassword(value) {
  return value.length >= 8;
}

function setStatus(form, message, ok = false) {
  const status = form.querySelector('[data-status]');
  if (!status) return;

  status.textContent = message || '';
  status.className = ok ? 'mt-3 text-sm text-emerald-300' : 'mt-3 text-sm text-rose-300';
}

export function initAuthForm(form) {
  if (!form) return;

  const email = form.querySelector('input[name="email"]');
  const password = form.querySelector('input[name="password"]');
  const confirm = form.querySelector('input[name="confirmPassword"]');
  const acceptTerms = form.querySelector('input[type="checkbox"]');
  const submitButton = form.querySelector('button[type="submit"]');
  const status = form.querySelector('[data-status]');
  const fields = [email, password, confirm].filter((field) => field instanceof HTMLInputElement);

  if (status instanceof HTMLElement) {
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
  }

  fields.forEach((input) => {
    input.setAttribute('aria-invalid', 'false');
    const hint = input.parentElement?.querySelector('[data-error]');
    if (!(hint instanceof HTMLElement)) return;

    const errorId = `${input.name || 'field'}-error`;
    hint.id = errorId;
    input.setAttribute('aria-describedby', errorId);
  });

  function validateField(input) {
    if (!(input instanceof HTMLInputElement)) return true;

    if (input.name === 'email') {
      if (!validateEmail(input.value.trim())) {
        setFieldError(input, 'Enter a valid email address.');
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input.name === 'password') {
      if (!validatePassword(input.value)) {
        setFieldError(input, 'Password must be at least 8 characters.');
        return false;
      }
      clearFieldError(input);
      return true;
    }

    if (input.name === 'confirmPassword' && password instanceof HTMLInputElement) {
      if (input.value !== password.value) {
        setFieldError(input, 'Passwords do not match.');
        return false;
      }
      clearFieldError(input);
      return true;
    }

    return true;
  }

  fields.forEach((input) => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let isValid = true;

    isValid = validateField(email) && isValid;
    isValid = validateField(password) && isValid;
    isValid = validateField(confirm) && isValid;

    if (acceptTerms instanceof HTMLInputElement && !acceptTerms.checked) {
      isValid = false;
      setStatus(form, 'You must confirm age 18+ and accept terms to continue.');
      acceptTerms.focus();
    }

    if (!isValid || !(email instanceof HTMLInputElement) || !(password instanceof HTMLInputElement)) {
      if (!(acceptTerms instanceof HTMLInputElement) || acceptTerms.checked) {
        setStatus(form, 'Fix form errors and try again.');
      }
      return;
    }

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.classList.add('opacity-60', 'cursor-not-allowed');
    }

    setStatus(form, 'Submitting...');

    try {
      if (confirm instanceof HTMLInputElement) {
        const result = await authApi.signUp({
          email: email.value.trim(),
          password: password.value,
          confirmPassword: confirm.value,
          acceptTerms: acceptTerms instanceof HTMLInputElement ? acceptTerms.checked : false
        });
        setStatus(form, `Account created for ${result.user.email}.`, true);
      } else {
        const result = await authApi.signIn({
          email: email.value.trim(),
          password: password.value
        });
        setStatus(form, `Welcome back, ${result.user.email}.`, true);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed. Try again.';
      setStatus(form, message);
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-60', 'cursor-not-allowed');
      }
    }
  });
}
