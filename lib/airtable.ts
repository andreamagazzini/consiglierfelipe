import Airtable from 'airtable';

// Configurazione Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID!);

export interface SegnalazioneData {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  descrizione: string;
  immagini?: Array<{url: string, filename: string}>; // Array di oggetti allegato per Airtable
  dataInvio: string;
  consensoPrivacy: boolean;
}

export async function saveSegnalazione(data: SegnalazioneData) {
  try {
    console.log('Tentativo di salvataggio su Airtable...');
    console.log('Nome tabella:', process.env.AIRTABLE_TABLE_NAME);
    console.log('Base ID:', process.env.AIRTABLE_BASE_ID);
    
    const recordData = {
      'Nome': data.nome,
      'Cognome': data.cognome,
      'Email': data.email,
      'Telefono': data.telefono,
      'Descrizione': data.descrizione,
      'Immagini': data.immagini?.map(img => ({ url: img.url })) || [],
      'Data Invio': new Date(data.dataInvio).toISOString().split('T')[0], // Solo la data YYYY-MM-DD
      'Consenso Privacy': data.consensoPrivacy,
      'Stato': 'Nuova'
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const record = await base(process.env.AIRTABLE_TABLE_NAME!).create(recordData as any);

    console.log('Record salvato con successo:', record.id);
    return { success: true, recordId: record.id };
  } catch (error) {
    console.error('Errore nel salvataggio su Airtable:', error);
    return { success: false, error: error };
  }
}

export interface SegnalazioneRisolta {
  id: string;
  titolo: string;
  luogo: string;
  dataRisoluzione: string;
  numeroSegnalazioni: number;
}

export async function getSegnalazioniRisolte(
  page: number = 1,
  pageSize: number = 10,
  searchTerm: string = ''
): Promise<{records: SegnalazioneRisolta[], totalCount: number}> {
  try {
    console.log('Caricamento segnalazioni risolte...');
    
    // Costruisci il filtro per la ricerca (titolo e luogo) - case insensitive
    let filterFormula = '';
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filterFormula = `OR(
        SEARCH("${searchTermLower}", LOWER({Titolo})),
        SEARCH("${searchTermLower}", LOWER({Luogo}))
      )`;
    }

    // Calcola l'offset per la paginazione
    const offset = (page - 1) * pageSize;

    // Query per ottenere i record
    const query = base(process.env.AIRTABLE_TABLE_RISOLTE || 'Risolte').select({
      filterByFormula: filterFormula,
      pageSize: pageSize,
      offset: offset,
      sort: [{ field: 'Data Risoluzione', direction: 'desc' }]
    });

    const records = await query.all();
    
    // Per ottenere il conteggio totale, facciamo una query separata
    const countQuery = base(process.env.AIRTABLE_TABLE_RISOLTE || 'Risolte').select({
      filterByFormula: filterFormula,
      fields: ['ID'] // Solo l'ID per contare
    });
    
    const allRecords = await countQuery.all();
    const totalCount = allRecords.length;

    const segnalazioni: SegnalazioneRisolta[] = records.map(record => ({
      id: record.id,
      titolo: record.get('Titolo') as string || 'Segnalazione',
      luogo: record.get('Luogo') as string || '',
      dataRisoluzione: record.get('Data Risoluzione') as string || '',
      numeroSegnalazioni: record.get('Numero Segnalazioni') as number || 1
    }));

    console.log(`Trovate ${segnalazioni.length} segnalazioni risolte`);
    return { records: segnalazioni, totalCount };
  } catch (error) {
    console.error('Errore nel caricamento segnalazioni risolte:', error);
    return { records: [], totalCount: 0 };
  }
}
