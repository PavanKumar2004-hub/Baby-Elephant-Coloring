import { createClient } from '@supabase/supabase-js';
import { ColoringSheet } from '../types';
import { ColoringBookData } from '../data/books';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://rfelxotjqmxiladnbllq.supabase.co';
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_h9-9EtQuCrm1HFkdV8bMrA_eWJ51RWR';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper: Convert Database Row (snake_case) to ColoringSheet (camelCase)
export function mapRowToSheet(row: any): ColoringSheet {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    slug: row.slug || row.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    age: row.age || 'Preschool (3-5)',
    difficulty: row.difficulty || 'Easy',
    outline: row.outline,
    colorGuide: row.color_guide || row.colorGuide,
    description: row.description || '',
    tags: Array.isArray(row.tags) ? row.tags : typeof row.tags === 'string' ? JSON.parse(row.tags) : [],
    isExclusive: Boolean(row.is_exclusive ?? row.isExclusive),
    isFeatured: Boolean(row.is_featured ?? row.isFeatured),
    views: Number(row.views || 0),
    downloads: Number(row.downloads || 0),
    coloredOnlineCount: Number(row.colored_online_count ?? row.coloredOnlineCount ?? 0),
    crayonGuide: Array.isArray(row.crayon_guide)
      ? row.crayon_guide
      : Array.isArray(row.crayonGuide)
      ? row.crayonGuide
      : []
  };
}

// Helper: Convert ColoringSheet (camelCase) to Database Row (snake_case)
export function mapSheetToRow(sheet: ColoringSheet): any {
  return {
    id: sheet.id,
    title: sheet.title,
    category: sheet.category,
    slug: sheet.slug,
    age: sheet.age,
    difficulty: sheet.difficulty,
    outline: sheet.outline,
    color_guide: sheet.colorGuide,
    description: sheet.description,
    tags: sheet.tags || [],
    is_exclusive: Boolean(sheet.isExclusive),
    is_featured: Boolean(sheet.isFeatured),
    views: sheet.views || 0,
    downloads: sheet.downloads || 0,
    colored_online_count: sheet.coloredOnlineCount || 0,
    crayon_guide: sheet.crayonGuide || []
  };
}

// Helper: Convert Database Row to ColoringBookData
export function mapRowToBook(row: any): ColoringBookData {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    coverImage: row.cover_image || row.coverImage,
    description: row.description || '',
    pageCount: Number(row.page_count ?? row.pageCount ?? 1),
    isFeatured: Boolean(row.is_featured ?? row.isFeatured),
    category: row.category,
    pdfUrl: row.pdf_url || row.pdfUrl || '',
    downloadCount: Number(row.download_count ?? row.downloadCount ?? 0),
    sheets: Array.isArray(row.sheets) ? row.sheets : []
  };
}

// Helper: Convert ColoringBookData to Database Row
export function mapBookToRow(book: ColoringBookData): any {
  return {
    id: book.id,
    title: book.title,
    subtitle: book.subtitle,
    cover_image: book.coverImage,
    description: book.description,
    page_count: book.pageCount,
    is_featured: Boolean(book.isFeatured),
    category: book.category,
    pdf_url: book.pdfUrl,
    download_count: book.downloadCount || 0,
    sheets: book.sheets || []
  };
}

// ==========================================
// CLOUD API: COLORING SHEETS
// ==========================================

export async function fetchSheetsFromCloud(): Promise<ColoringSheet[] | null> {
  try {
    const { data, error } = await supabase
      .from('sheets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchSheets error:', error.message);
      return null;
    }
    if (!data) return null;
    return data.map(mapRowToSheet);
  } catch (err) {
    console.warn('Supabase network error fetching sheets:', err);
    return null;
  }
}

export async function saveSheetToCloud(sheet: ColoringSheet): Promise<boolean> {
  try {
    const row = mapSheetToRow(sheet);
    const { error } = await supabase.from('sheets').upsert(row);
    if (error) {
      console.error('Supabase saveSheet error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase network error saving sheet:', err);
    return false;
  }
}

export async function deleteSheetFromCloud(sheetId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('sheets').delete().eq('id', sheetId);
    if (error) {
      console.error('Supabase deleteSheet error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase network error deleting sheet:', err);
    return false;
  }
}

// ==========================================
// CLOUD API: COLORING BOOKS
// ==========================================

export async function fetchBooksFromCloud(): Promise<ColoringBookData[] | null> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchBooks error:', error.message);
      return null;
    }
    if (!data) return null;
    return data.map(mapRowToBook);
  } catch (err) {
    console.warn('Supabase network error fetching books:', err);
    return null;
  }
}

export async function saveBookToCloud(book: ColoringBookData): Promise<boolean> {
  try {
    const row = mapBookToRow(book);
    const { error } = await supabase.from('books').upsert(row);
    if (error) {
      console.error('Supabase saveBook error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase network error saving book:', err);
    return false;
  }
}

export async function deleteBookFromCloud(bookId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('books').delete().eq('id', bookId);
    if (error) {
      console.error('Supabase deleteBook error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase network error deleting book:', err);
    return false;
  }
}

// ==========================================
// INITIAL DATABASE SEEDING (If Cloud is Empty)
// ==========================================

export async function seedInitialCloudDataIfNeeded(
  initialSheets: ColoringSheet[],
  initialBooks: ColoringBookData[]
) {
  try {
    const { count: sheetCount, error: countErr } = await supabase
      .from('sheets')
      .select('*', { count: 'exact', head: true });

    if (!countErr && (sheetCount === 0 || sheetCount === null)) {
      console.log('Seeding initial coloring sheets into Supabase cloud...');
      const rows = initialSheets.map(mapSheetToRow);
      // Batch insert
      await supabase.from('sheets').insert(rows);
    }

    const { count: bookCount, error: bookCountErr } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true });

    if (!bookCountErr && (bookCount === 0 || bookCount === null)) {
      console.log('Seeding initial coloring books into Supabase cloud...');
      const rows = initialBooks.map(mapBookToRow);
      await supabase.from('books').insert(rows);
    }
  } catch (err) {
    console.warn('Supabase initial seed error (safe to ignore if tables not yet created):', err);
  }
}
