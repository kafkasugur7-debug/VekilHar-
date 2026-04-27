import { Transaction } from '../types';
import { isBefore, isSameMonth, parseISO, startOfMonth } from 'date-fns';

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount);
}

export function getTransactionsByMonth(transactions: Transaction[], date: Date): Transaction[] {
  return transactions.filter(t => isSameMonth(parseISO(t.date), date));
}

export function getMonthlyIncome(transactions: Transaction[], date: Date): number {
  const monthTxs = getTransactionsByMonth(transactions, date);
  return monthTxs
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getMonthlyExpense(transactions: Transaction[], date: Date): number {
  const monthTxs = getTransactionsByMonth(transactions, date);
  return monthTxs
    .filter(t => t.type === 'expense' || t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getMonthlyNet(transactions: Transaction[], date: Date): number {
  return getMonthlyIncome(transactions, date) - getMonthlyExpense(transactions, date);
}

// Calculate cumulative balance up to (and including) the specified month
export function getCumulativeBalance(transactions: Transaction[], upToDate: Date): number {
  // We need all transactions that happened ON OR BEFORE the end of the specified month.
  // Using start of next month to find everything strictly before it
  // Wait, the requirement says "across all previous months" and current month.
  // Easiest way: filter transactions where Date <= upToDate month end
  // But upToDate might be some day in the month. Let's compare month start.

  const currentMonthStart = startOfMonth(upToDate);
  
  return transactions.reduce((acc, t) => {
    const txDate = parseISO(t.date);
    // If the transaction is before the current month, or inside the current month
    if (isBefore(txDate, currentMonthStart) || isSameMonth(txDate, currentMonthStart)) {
      if (t.type === 'income') return acc + t.amount;
      return acc - t.amount;
    }
    return acc;
  }, 0);
}

export function getPersonSummary(transactions: Transaction[], personId: string) {
  const personTxs = transactions.filter(t => t.personId === personId);
  
  const incoming = personTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const outgoing = personTxs.filter(t => t.type !== 'income').reduce((sum, t) => sum + t.amount, 0);
  const lastTransaction = personTxs.length > 0 
    ? personTxs.sort((a, b) => b.date.localeCompare(a.date))[0] 
    : null;

  return { incoming, outgoing, net: incoming - outgoing, lastTransaction };
}
