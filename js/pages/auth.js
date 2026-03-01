import { initAuthForm } from '../modules/forms.js';

export function initAuthPage() {
  initAuthForm(document.getElementById('auth-form'));
}
