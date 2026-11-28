'use strict';

(() => {
  const cookieName = 'samera_cookie_consent';
  const policyVersion = '2026-10-29.2';
  const fontsUrl = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;650;700;750;800&family=Space+Grotesk:wght@400;500;600;700&display=swap';
  let sessionChoice = null;
  let returnFocus = null;
  let expiryTimer;

  document.body.insertAdjacentHTML('beforeend', `
    <section id="cookie-banner" class="cookie-banner" aria-labelledby="cookie-banner-title" hidden>
      <div class="cookie-banner-copy">
        <p class="cookie-eyebrow">LA TUA PRIVACY</p>
        <h2 id="cookie-banner-title">Scegli come navigare.</h2>
        <p>Usiamo un cookie tecnico per ricordare la tua scelta. Con il tuo consenso carichiamo i caratteri da Google Fonts: il tuo browser si collega a Google, che riceve l’indirizzo IP e dati tecnici. Non usiamo strumenti di analisi o pubblicità. Puoi rifiutare e usare comunque tutto il sito.</p>
        <a href="cookie-policy.html">Leggi la cookie policy</a>
      </div>
      <div class="cookie-banner-actions">
        <button type="button" class="consent-button" data-cookie-reject>Rifiuta non necessari</button>
        <button type="button" class="consent-button" data-cookie-preferences>Personalizza</button>
        <button type="button" class="consent-button" data-cookie-accept>Accetta tutti</button>
      </div>
      <button type="button" class="cookie-banner-close" data-cookie-reject aria-label="Chiudi e continua senza servizi facoltativi">×</button>
    </section>
    <dialog id="cookie-preferences" class="consent-dialog" data-cookie-dialog aria-labelledby="cookie-preferences-title" aria-describedby="cookie-preferences-description">
      <button type="button" class="dialog-close" data-cookie-close aria-label="Chiudi le preferenze senza modificare la scelta">×</button>
      <p class="cookie-eyebrow">LE TUE SCELTE</p>
      <h2 id="cookie-preferences-title" tabindex="-1">Preferenze cookie</h2>
      <p id="cookie-preferences-description">I servizi facoltativi sono disattivati fino al tuo consenso. Puoi cambiare idea o revocarlo in ogni momento da “Preferenze cookie” nel footer.</p>
      <div class="consent-category">
        <div class="consent-category-heading"><h3>Cookie tecnico delle preferenze</h3><span class="consent-required">Sempre necessario</span></div>
        <p>Ricorda accettazione o rifiuto per sei mesi. Non serve a seguirti durante la navigazione e non richiede consenso.</p>
      </div>
      <form id="cookie-preferences-form">
        <div class="consent-category">
          <label class="consent-option" for="cookie-external-fonts"><span>Caratteri esterni · Google Fonts</span><input id="cookie-external-fonts" type="checkbox" name="externalFonts"></label>
          <p>Se attivi questa opzione, Google riceve il tuo indirizzo IP e informazioni tecniche per fornire Manrope e Space Grotesk. Senza consenso usiamo i caratteri disponibili sul dispositivo. Nessuna funzione del sito viene limitata.</p>
          <p><a href="https://policies.google.com/privacy?hl=it">Privacy di Google</a> · <a href="cookie-policy.html#servizi-esterni">Dettagli sul servizio</a></p>
        </div>
        <p class="consent-current" id="cookie-current-choice"></p>
        <div class="consent-actions">
          <button type="button" class="consent-button" data-cookie-reject>Rifiuta non necessari</button>
          <button type="button" class="consent-button" data-cookie-accept>Accetta tutti</button>
          <button type="submit" class="consent-button">Salva preferenze</button>
        </div>
      </form>
      <a class="consent-policy-link" href="cookie-policy.html">Leggi la cookie policy completa</a>
    </dialog>
    <p id="cookie-choice-status" class="consent-announcement" role="status" aria-live="polite"></p>
  `);

  const banner = document.querySelector('#cookie-banner');
  const dialog = document.querySelector('#cookie-preferences');
  const fontsCheckbox = document.querySelector('#cookie-external-fonts');
  const currentChoice = document.querySelector('#cookie-current-choice');
  const status = document.querySelector('#cookie-choice-status');

  function sixMonthsAfter(date) {
    const expiry = new Date(date);
    expiry.setUTCMonth(expiry.getUTCMonth() + 6);
    return expiry;
  }

  function isValid(choice) {
    if (!choice || choice.version !== policyVersion || choice.necessary !== true || typeof choice.externalFonts !== 'boolean') return false;
    const savedAt = Date.parse(choice.savedAt);
    const expiresAt = Date.parse(choice.expiresAt);
    return Number.isFinite(savedAt) && savedAt <= Date.now() && expiresAt > Date.now() && expiresAt > savedAt && expiresAt <= sixMonthsAfter(savedAt).getTime();
  }

  function readCookie() {
    try {
      const entry = document.cookie.split(';').map(part => part.trim()).find(part => part.startsWith(cookieName + '='));
      const choice = entry ? JSON.parse(decodeURIComponent(entry.slice(cookieName.length + 1))) : null;
      return isValid(choice) ? choice : null;
    } catch {
      return null;
    }
  }

  function getChoice() {
    return (isValid(sessionChoice) ? sessionChoice : null) || readCookie();
  }

  function applyChoice(choice) {
    const existingFonts = document.querySelector('#consent-google-fonts');
    if (choice?.externalFonts && !existingFonts) {
      const link = document.createElement('link');
      link.id = 'consent-google-fonts';
      link.rel = 'stylesheet';
      link.href = fontsUrl;
      document.head.append(link);
    } else if (!choice?.externalFonts && existingFonts) {
      existingFonts.remove();
    }
    fontsCheckbox.checked = choice?.externalFonts === true;
    currentChoice.textContent = choice
      ? 'Scelta attuale: ' + (choice.externalFonts ? 'Google Fonts consentito.' : 'solo cookie tecnico; Google Fonts disattivato.') + ' Salvata il ' + new Date(choice.savedAt).toLocaleDateString('it-IT') + '.'
      : 'Non hai ancora espresso una scelta. Google Fonts è disattivato.';
    document.querySelectorAll('[data-cookie-preferences]').forEach(button => {
      button.hidden = false;
      button.setAttribute('aria-controls', 'cookie-preferences');
      button.setAttribute('aria-haspopup', 'dialog');
    });
    clearTimeout(expiryTimer);
    if (choice) {
      expiryTimer = setTimeout(syncChoice, Math.min(Date.parse(choice.expiresAt) - Date.now(), 2147483647));
    }
  }

  function syncChoice() {
    const choice = getChoice();
    applyChoice(choice);
    banner.hidden = Boolean(choice);
  }

  function openPreferences(event) {
    returnFocus = event.currentTarget;
    applyChoice(getChoice());
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    document.querySelector('#cookie-preferences-title').focus();
  }

  function saveChoice(externalFonts) {
    const now = new Date();
    const choice = {
      version: policyVersion,
      necessary: true,
      externalFonts,
      savedAt: now.toISOString(),
      expiresAt: sixMonthsAfter(now).toISOString()
    };
    try {
      document.cookie = cookieName + '=' + encodeURIComponent(JSON.stringify(choice)) + '; Path=/; Expires=' + new Date(choice.expiresAt).toUTCString() + '; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
    } catch {
      // A blocked cookie must not prevent navigation or the current choice.
    }
    const stored = readCookie();
    const remembered = stored && stored.savedAt === choice.savedAt && stored.externalFonts === choice.externalFonts;
    sessionChoice = remembered ? null : choice;
    applyChoice(choice);
    const focusWasInBanner = banner.contains(document.activeElement);
    banner.hidden = true;
    if (dialog.open) dialog.close();
    if (focusWasInBanner) document.querySelector('.footer-legal [data-cookie-preferences]')?.focus({ preventScroll: true });
    status.textContent = (externalFonts ? 'Preferenze applicate: Google Fonts consentito.' : 'Preferenze applicate: servizi facoltativi disattivati.') + (remembered ? '' : ' Il browser non consente di memorizzare la scelta: sarà richiesta di nuovo alla prossima pagina.');
    channel?.postMessage('updated');
  }

  document.querySelectorAll('[data-cookie-accept]').forEach(button => button.addEventListener('click', () => saveChoice(true)));
  document.querySelectorAll('[data-cookie-reject]').forEach(button => button.addEventListener('click', () => saveChoice(false)));
  document.querySelectorAll('[data-cookie-preferences]').forEach(button => button.addEventListener('click', openPreferences));
  document.querySelector('[data-cookie-close]').addEventListener('click', () => dialog.close());
  document.querySelector('#cookie-preferences-form').addEventListener('submit', event => {
    event.preventDefault();
    saveChoice(fontsCheckbox.checked);
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = document.querySelector('dialog[open]') ? 'hidden' : '';
    if (returnFocus && !returnFocus.closest('[hidden]')) returnFocus.focus({ preventScroll: true });
    else document.querySelector('.footer-legal [data-cookie-preferences]')?.focus({ preventScroll: true });
    returnFocus = null;
  });

  // Synchronize other open pages and pages restored from the browser history.
  let channel = null;
  try {
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel('samera-cookie-preferences');
      channel.addEventListener('message', () => {
        sessionChoice = null;
        syncChoice();
      });
    }
  } catch {
    // Focus and pageshow still synchronize when this API is unavailable.
  }
  window.addEventListener('pageshow', syncChoice);
  window.addEventListener('focus', syncChoice);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') syncChoice();
  });
  syncChoice();
})();
