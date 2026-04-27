import * as XLSX from 'xlsx';
import { Transaction, Person, Category } from '../types';

export function exportToExcel(transactions: Transaction[], people: Person[], categories: Category[]): XLSX.WorkBook {
  // Map transactions
  const txData = transactions.map(t => {
    const person = people.find(p => p.id === t.personId);
    const category = categories.find(c => c.id === t.category);
    
    return {
      'Tarih': t.date,
      'İşlem Türü': t.type === 'income' ? 'Gelir' : t.type === 'expense' ? 'Gider' : 'Ödeme',
      'Başlık': t.title,
      'Tutar (₺)': t.amount,
      'Kategori': category ? category.name : t.category,
      'Kişi/Kurum': person ? person.name : '',
      'Açıklama': t.note || ''
    };
  });

  // Map people
  const peopleData = people.map(p => ({
    'İsim': p.name,
    'Tür': p.kind === 'person' ? 'Bireysel' : 'Kurumsal',
    'Eklenme Tarihi': new Date(p.createdAt).toLocaleDateString('tr-TR'),
    'Not': p.note || ''
  }));

  const wb = XLSX.utils.book_new();
  
  const wsTx = XLSX.utils.json_to_sheet(txData);
  const wsPeople = XLSX.utils.json_to_sheet(peopleData);

  // Column widths
  wsTx['!cols'] = [
    { wch: 12 }, // Tarih
    { wch: 12 }, // İşlem Türü
    { wch: 25 }, // Başlık
    { wch: 12 }, // Tutar
    { wch: 20 }, // Kategori
    { wch: 25 }, // Kişi/Kurum
    { wch: 40 }, // Açıklama
  ];

  wsPeople['!cols'] = [
    { wch: 25 }, // İsim
    { wch: 12 }, // Tür
    { wch: 15 }, // Eklenme Tarihi
    { wch: 40 }, // Not
  ];

  XLSX.utils.book_append_sheet(wb, wsTx, "İşlemler");
  XLSX.utils.book_append_sheet(wb, wsPeople, "Kişiler ve Kurumlar");

  return wb;
}

export function downloadExcel(transactions: Transaction[], people: Person[], categories: Category[]) {
  const wb = exportToExcel(transactions, people, categories);
  XLSX.writeFile(wb, "VekilHarc_Yedek.xlsx");
}

export function generateExcelBlob(transactions: Transaction[], people: Person[], categories: Category[]): Blob {
  const wb = exportToExcel(transactions, people, categories);
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
