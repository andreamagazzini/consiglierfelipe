import { NextRequest, NextResponse } from 'next/server';
import { getSegnalazioniRisolte } from '@/lib/airtable';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parametri di paginazione e ricerca
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const searchTerm = searchParams.get('search') || '';

    // Validazione parametri
    if (page < 1) {
      return NextResponse.json(
        { error: 'Numero di pagina non valido' },
        { status: 400 }
      );
    }

    if (pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: 'Dimensione pagina non valida (1-100)' },
        { status: 400 }
      );
    }

    // Carica le segnalazioni risolte
    const result = await getSegnalazioniRisolte(page, pageSize, searchTerm);

    // Calcola informazioni di paginazione
    const totalPages = Math.ceil(result.totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        records: result.records,
        pagination: {
          currentPage: page,
          pageSize: pageSize,
          totalCount: result.totalCount,
          totalPages: totalPages,
          hasNextPage: hasNextPage,
          hasPrevPage: hasPrevPage
        },
        search: {
          term: searchTerm,
          hasResults: result.records.length > 0
        }
      }
    });

  } catch (error) {
    console.error('Errore API segnalazioni risolte:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
