export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Titolare del Trattamento</h2>
              <p>
                Il titolare del trattamento dei dati personali è Luigifilippo Garrone, 
                Consigliere del Municipio I Centro Est, con sede in Genova.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Finalità del Trattamento</h2>
              <p>
                I dati personali raccolti tramite il form di segnalazione vengono utilizzati per:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Gestire e processare le segnalazioni dei cittadini</li>
                <li>Contattare il cittadino per aggiornamenti sulla segnalazione</li>
                <li>Mantenere un archivio delle segnalazioni per finalità statistiche e di miglioramento del servizio</li>
                <li>Contattare i cittadini per aggiornamenti generali sulle attività del consigliere</li>
                <li>Comunicare informazioni relative a elezioni o consultazioni pubbliche</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">3. Base Giuridica</h2>
              <p>
                Il trattamento dei dati personali si basa sul consenso dell'interessato (art. 6.1.a GDPR) 
                per tutte le finalità sopra indicate, compresi i contatti per aggiornamenti generali e 
                comunicazioni elettorali.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Categorie di Dati Trattati</h2>
              <p>Vengono raccolti i seguenti dati personali:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Nome e cognome</li>
                <li>Indirizzo email</li>
                <li>Numero di telefono (opzionale)</li>
                <li>Descrizione della segnalazione</li>
                <li>Immagini allegate</li>
                <li>Data e ora di invio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Durata di Conservazione</h2>
              <p>
                I dati personali vengono conservati per un periodo massimo di 10 anni dalla data di invio della segnalazione, 
                in conformità con le disposizioni normative per la conservazione della documentazione amministrativa.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Diritti dell'Interessato</h2>
              <p>L'interessato ha il diritto di:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Accedere ai propri dati personali</li>
                <li>Rettificare i dati inesatti o incompleti</li>
                <li>Cancellare i propri dati (diritto all'oblio)</li>
                <li>Limitare il trattamento dei propri dati</li>
                <li>Opporsi al trattamento</li>
                <li>Revocare il consenso in qualsiasi momento</li>
              </ul>
              <p className="mt-3">
                Per esercitare questi diritti, è possibile contattare il titolare del trattamento 
                all'indirizzo email: <a href="mailto:filippogarrone95@hotmail.com" className="text-blue-600 underline">filippogarrone95@hotmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">7. Sicurezza dei Dati</h2>
              <p>
                I dati personali vengono trattati con adeguate misure di sicurezza tecniche e organizzative 
                per proteggerli da accessi non autorizzati, alterazioni, divulgazioni o distruzioni.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">8. Comunicazione dei Dati</h2>
              <p>
                I dati personali non vengono comunicati a terzi, ad eccezione dei casi previsti dalla legge 
                o per l'espletamento delle funzioni istituzionali.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">9. Modifiche alla Privacy Policy</h2>
              <p>
                Questa Privacy Policy può essere modificata in qualsiasi momento. 
                Le modifiche saranno pubblicate su questa pagina e, se significative, 
                verranno comunicate agli interessati.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">10. Contatti</h2>
              <p>
                Per qualsiasi domanda relativa al trattamento dei dati personali, 
                è possibile contattare il titolare del trattamento:
              </p>
              <div className="mt-3 p-4 bg-slate-50 rounded-lg">
                <p><strong>Luigifilippo Garrone</strong></p>
                <p>Consigliere del Municipio I Centro Est</p>
                <p>Email: <a href="mailto:filippogarrone95@hotmail.com" className="text-blue-600 underline">filippogarrone95@hotmail.com</a></p>
              </div>
            </section>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Ultima modifica:</strong> {new Date().toLocaleDateString('it-IT')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
