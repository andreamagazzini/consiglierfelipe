import { NextRequest, NextResponse } from 'next/server';
import { saveSegnalazione, SegnalazioneData } from '@/lib/airtable';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validazione dei dati
    const { nome, cognome, email, telefono, descrizione, immagini, consensoPrivacy } = body;
    
    console.log('Dati ricevuti dal form:', {
      nome, cognome, email, telefono, descrizione, 
      immagini: typeof immagini, 
      consensoPrivacy
    });
    
    if (!nome || !cognome || !email || !descrizione) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti' },
        { status: 400 }
      );
    }

    if (!consensoPrivacy) {
      return NextResponse.json(
        { error: 'È necessario accettare la Privacy Policy per procedere' },
        { status: 400 }
      );
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      );
    }

    // Preparazione dati per Airtable
    const segnalazioneData: SegnalazioneData = {
      nome: nome.trim(),
      cognome: cognome.trim(),
      email: email.trim().toLowerCase(),
      telefono: telefono?.trim() || '',
      descrizione: descrizione.trim(),
      immagini: Array.isArray(immagini) ? immagini : [],
      dataInvio: new Date().toISOString(),
      consensoPrivacy: consensoPrivacy
    };

    // Salvataggio su Airtable
    console.log('Dati da salvare:', JSON.stringify(segnalazioneData, null, 2));
    const result = await saveSegnalazione(segnalazioneData);

    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Segnalazione inviata con successo!',
          recordId: result.recordId 
        },
        { status: 200 }
      );
    } else {
      console.error('Errore dettagliato:', result.error);
      return NextResponse.json(
        { error: 'Errore nel salvataggio della segnalazione', details: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Errore API:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
