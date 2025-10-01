import { NextRequest, NextResponse } from 'next/server';
import { uploadMultipleImages } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nessuna immagine fornita' },
        { status: 400 }
      );
    }

    // Upload delle immagini su Cloudinary
    const uploadResults = await uploadMultipleImages(files);
    
    return NextResponse.json({
      success: true,
      images: uploadResults
    });

  } catch (error) {
    console.error('Errore upload API:', error);
    return NextResponse.json(
      { error: 'Errore nel caricamento delle immagini' },
      { status: 500 }
    );
  }
}
