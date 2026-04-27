import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreState, Transaction, Person, Category } from '../types';

const INITIAL_PEOPLE: Person[] = [
  { id: '1', name: 'Ahmet Yılmaz', kind: 'person', createdAt: new Date().toISOString() },
  { id: '2', name: 'Zeynep Kaya', kind: 'person', createdAt: new Date().toISOString() },
  { id: '3', name: 'Aras Teknoloji A.Ş.', kind: 'company', createdAt: new Date().toISOString() },
  { id: '4', name: 'Mehmet Can', kind: 'person', createdAt: new Date().toISOString() },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Maaş Ödemesi', type: 'income' },
  { id: 'c2', name: 'Proje Avansı', type: 'income' },
  { id: 'c3', name: 'Ödeme İadesi', type: 'income' },
  { id: 'c4', name: 'Market Alışverişi', type: 'expense' },
  { id: 'c5', name: 'Kira Ödemesi', type: 'payment' },
  { id: 'c6', name: 'Yemek', type: 'expense' },
  { id: 'c7', name: 'Ulaşım', type: 'expense' },
];

const now = new Date();
const todayISO = now.toISOString().split('T')[0];
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayISO = yesterday.toISOString().split('T')[0];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'expense', amount: 1240, title: 'Market Alışverişi', category: 'c4', personId: '1', date: todayISO, createdAt: new Date().toISOString() },
  { id: 't2', type: 'income', amount: 4500, title: 'Ödeme İadesi', category: 'c3', personId: '2', date: todayISO, createdAt: new Date().toISOString() },
  { id: 't3', type: 'expense', amount: 850, title: 'Akşam Yemeği', category: 'c6', personId: '4', date: yesterdayISO, createdAt: new Date().toISOString() },
  { id: 't4', type: 'income', amount: 12000, title: 'Proje Avansı', category: 'c2', personId: '3', date: yesterdayISO, createdAt: new Date().toISOString() },
  { id: 't5', type: 'expense', amount: 120, title: 'Ulaşım', category: 'c7', date: yesterdayISO, createdAt: new Date().toISOString() },
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      transactions: INITIAL_TRANSACTIONS,
      people: INITIAL_PEOPLE,
      categories: INITIAL_CATEGORIES,
      currency: 'TRY', // Fixed as requested
      userName: 'Selim',

      updateUserName: (name) => set({ userName: name }),

      addTransaction: (t) => set((state) => ({
        transactions: [{ ...t, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...state.transactions]
      })),

      updateTransaction: (id, updatedFields) => set((state) => ({
        transactions: state.transactions.map(t => t.id === id ? { ...t, ...updatedFields } : t)
      })),

      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),

      addPerson: (p) => set((state) => ({
        people: [{ ...p, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...state.people]
      })),

      deletePerson: (id) => set((state) => ({
        people: state.people.filter(p => p.id !== id)
      })),

      addCategory: (c) => set((state) => ({
        categories: [...state.categories, { ...c, id: crypto.randomUUID() }]
      })),

      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
      })),

      resetAllData: () => set({
        transactions: [],
        people: [],
      }),

      importData: (jsonData) => {
        try {
          const data = JSON.parse(jsonData);
          if (data.transactions && data.people) {
            set({ transactions: data.transactions, people: data.people });
          }
        } catch (e) {
          console.error("Failed to import data", e);
          alert("Geçersiz veri formatı!");
        }
      }
    }),
    {
      name: 'vekilharc-storage',
    }
  )
);
