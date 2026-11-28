# Samera — Design. Make. Connect.

Sito in italiano realizzato con HTML, CSS e JavaScript, senza dipendenze di compilazione.

## Avvio locale

Dalla cartella `dist`: `python3 -m http.server 4173`.

## Contenuti e interazioni

Navigazione responsive, filtri degli ambiti applicativi, approfondimenti accessibili in dialog, creazione e download di un brief di progetto. I moduli non inviano dati e non usano archiviazione persistente. La sezione Contatti e il footer includono email e telefono cliccabili: info@samera.tech, +39 350 027 3037. I collegamenti aprono il client email o l’app telefonica del visitatore. Gli ambiti illustrati sono possibilità da valutare, non prodotti già a catalogo.

La cookie policy è disponibile in `dist/cookie-policy.html` e collegata dal footer. Il titolare indicato è Ste.Mar. S.r.l., con i dati societari tratti dalla nota legale di stemarweb.com; l’hosting pubblico è IONOS, come confermato dal committente. La pagina è consultabile anche senza JavaScript.

`dist/cookie-consent.js`, condiviso dalle due pagine, presenta accettazione, rifiuto e personalizzazione. Google Fonts è l’unico servizio facoltativo: nessun foglio di stile o preconnect verso Google viene caricato prima del consenso. Il rifiuto mantiene tutte le funzioni del sito e usa i caratteri del dispositivo. Il cookie tecnico `samera_cookie_consent` ricorda scelta, versione dell’informativa e data per sei mesi; il footer permette di modificare o revocare la scelta. La X del banner salva il rifiuto. La chiusura del pannello delle preferenze non modifica le scelte. Con JavaScript disattivato i servizi esterni rimangono bloccati.

La versione del consenso (`2026-10-29.2`) è riportata nello script e nell’informativa: va aggiornata quando cambiano sostanzialmente servizi, finalità o destinatari. Non sono presenti analytics, marketing o altre categorie facoltative. Prima di aggiungere altri servizi occorre includerli nel blocco preventivo, nel pannello e nella policy. I log, la conservazione e gli eventuali servizi aggiunti dalla configurazione IONOS devono essere verificati sul servizio pubblico: non sono controllati da questo codice statico.

## Direzione grafica

Il sito è articolato in Studio, Soluzioni, Metodo e Contatti. La direzione editoriale abbina fotografia industriale, titoli serif, antracite e carta da zucchero. La galleria di apertura si sfoglia manualmente. Le schede delle soluzioni si aprono in pagina e collegano al brief con l’ambito preselezionato.

Le immagini editoriali sono generate con ImageGen e non documentano impianti o prodotti reali di Samera. Prompt in `ASSETS.md`.
