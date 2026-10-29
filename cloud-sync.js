/* AP FUTSAL — sincronización en la nube
   Rama de pruebas: sync-prep
*/
(() => {
  'use strict';

  const AP_CLOUD_URL = '__SUPABASE_URL__';
  const AP_CLOUD_KEY = '__SUPABASE_PUBLISHABLE_KEY__';
  const AP_CLOUD_SESSION = 'ap-futsal-cloud-session-v1';
  const AP_CLOUD_TEAM = 'ap-futsal-cloud-team-v1';

  function cloudSession() {
    try {
      return JSON.parse(localStorage.getItem(AP_CLOUD_SESSION) || 'null');
    } catch (_) {
      return null;
    }
  }

  function cloudTeam() {
    try {
      return JSON.parse(localStorage.getItem(AP_CLOUD_TEAM) || 'null');
    } catch (_) {
      return null;
    }
  }

  function cloudStatus(id, message) {
    const element = document.getElementById(id);
    if (element) element.textContent = message;
  }

  function cloudHeaders(extra = {}) {
    const session = cloudSession();
    return Object.assign({
      apikey: AP_CLOUD_KEY,
      'Content-Type': 'application/json'
    }, session && session.access_token
      ? { Authorization: 'Bearer ' + session.access_token }
      : {}, extra);
  }

  async function cloudRequest(path, options = {}) {
    if (
      !AP_CLOUD_URL ||
      AP_CLOUD_URL.startsWith('__') ||
      !AP_CLOUD_KEY ||
      AP_CLOUD_KEY.startsWith('__')
    ) {
      throw new Error('Falta configurar Supabase.');
    }

    const response = await fetch(
      AP_CLOUD_URL.replace(/\/$/, '') + path,
      Object.assign({ headers: cloudHeaders() }, options)
    );

    const raw = await response.text();
    let data;

    try {
      data = raw ? JSON.parse(raw) : null;
    } catch (_) {
      data = raw;
    }

    if (!response.ok) {
      throw new Error(
        data && (data.message || data.msg || data.error_description)
          ? (data.message || data.msg || data.error_description)
          : 'Error HTTP ' + response.status
      );
    }

    return data;
  }

  function cloudRequireSession() {
    const session = cloudSession();
    if (!session || !session.access_token) {
      throw new Error('Inicia sesión primero.');
    }
    return session;
  }

  // El resto de las funciones se añadirá después de comprobar
  // que el archivo se ha creado correctamente.
})();
