'use strict';

const form = document.querySelector('#brief-form');
const preview = document.querySelector('#brief-preview');
const copyStatus = document.querySelector('#copy-status');

form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get('name').trim();
  const company = data.get('company').trim();
  const challenge = data.get('challenge').trim();
  const status = document.querySelector('#form-status');
  if (!name || !company || challenge.length < 10) {
    status.textContent = 'Inserisci nome, azienda e almeno 10 caratteri per descrivere la sfida.';
    return;
  }
  status.textContent = '';
  copyStatus.textContent = '';
  preview.textContent = [
    'SAMERA — Design. Make. Connect.', 'BRIEF DI PROGETTO', '',
    'Nome: ' + name, 'Azienda: ' + company, 'Ambito: ' + data.get('interest'), '',
    'LA SFIDA', challenge, '', 'PROSSIMO PASSO',
    'Condividere questo riepilogo con il team Samera per un primo confronto su esigenze, fattibilità e obiettivi.', '',
    'Documento preparato nel browser. Nessun dato è stato inviato automaticamente.'
  ].join('\n');
  document.querySelector('#brief-dialog').showModal();
});

document.querySelector('#download-brief').addEventListener('click', () => {
  const blob = new Blob([preview.textContent], {type: 'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Samera-brief-progetto.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

document.querySelector('#copy-brief').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(preview.textContent);
    copyStatus.textContent = 'Testo copiato.';
  } catch {
    copyStatus.textContent = 'Copia non disponibile: usa “Scarica il brief”.';
  }
});
form.hidden = false;
