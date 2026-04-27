import { AppBackupData } from '../types';

function escapeCsvValue(value: string | number): string {
  const stringValue = String(value);
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function createCsvSection(title: string, rows: Array<Record<string, string | number>>): string[] {
  if (rows.length === 0) {
    return [title, 'Kayıt bulunamadı'];
  }

  const headers = Object.keys(rows[0]);
  const dataRows = rows.map((row) => headers.map((header) => escapeCsvValue(row[header] ?? '')).join(','));

  return [
    title,
    headers.map((header) => escapeCsvValue(header)).join(','),
    ...dataRows,
  ];
}

function downloadTextFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = downloadUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

export function downloadSpreadsheetCsv(data: AppBackupData): void {
  const transactionRows = data.transactions.map((transaction) => {
    const person = data.people.find((currentPerson) => currentPerson.id === transaction.personId);
    const category = data.categories.find((currentCategory) => currentCategory.id === transaction.category);

    return {
      Tarih: transaction.date,
      'İşlem Türü': transaction.type === 'income' ? 'Gelir' : transaction.type === 'expense' ? 'Gider' : 'Ödeme',
      Başlık: transaction.title,
      Tutar: transaction.amount,
      Kategori: category ? category.name : transaction.category,
      'Kişi veya Kurum': person ? person.name : '',
      Açıklama: transaction.note || '',
    };
  });

  const peopleRows = data.people.map((person) => ({
    İsim: person.name,
    Tür: person.kind === 'person' ? 'Bireysel' : 'Kurumsal',
    'Eklenme Tarihi': new Date(person.createdAt).toLocaleDateString('tr-TR'),
    Not: person.note || '',
  }));

  const categoryRows = data.categories.map((category) => ({
    İsim: category.name,
    'İşlem Türü': category.type === 'income' ? 'Gelir' : category.type === 'expense' ? 'Gider' : 'Ödeme',
  }));

  const lines = [
    ...createCsvSection('İşlemler', transactionRows),
    '',
    ...createCsvSection('Kişiler ve Kurumlar', peopleRows),
    '',
    ...createCsvSection('Kategoriler', categoryRows),
  ];

  downloadTextFile('VekilHarc_Yedek.csv', `\uFEFF${lines.join('\n')}`, 'text/csv;charset=utf-8;');
}
