import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppBackupData, Category, StoreState } from '../types';

const DEFAULT_USER_NAME = 'Selim';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Maaş Ödemesi', type: 'income' },
  { id: 'c2', name: 'Proje Avansı', type: 'income' },
  { id: 'c3', name: 'Ödeme İadesi', type: 'income' },
  { id: 'c4', name: 'Market Alışverişi', type: 'expense' },
  { id: 'c5', name: 'Kira Ödemesi', type: 'payment' },
  { id: 'c6', name: 'Yemek', type: 'expense' },
  { id: 'c7', name: 'Ulaşım', type: 'expense' },
];

function getDefaultCategories(): Category[] {
  return DEFAULT_CATEGORIES.map((category) => ({ ...category }));
}

function createEmptyBackupData(): AppBackupData {
  return {
    transactions: [],
    people: [],
    categories: getDefaultCategories(),
    currency: 'TRY',
    userName: DEFAULT_USER_NAME,
  };
}

function parseBackupData(jsonData: string): AppBackupData | null {
  try {
    const data = JSON.parse(jsonData) as Partial<AppBackupData>;

    if (!Array.isArray(data.transactions) || !Array.isArray(data.people)) {
      return null;
    }

    return {
      transactions: data.transactions,
      people: data.people,
      categories: Array.isArray(data.categories) && data.categories.length > 0 ? data.categories : getDefaultCategories(),
      currency: 'TRY',
      userName: typeof data.userName === 'string' && data.userName.trim() ? data.userName.trim() : DEFAULT_USER_NAME,
    };
  } catch (error) {
    console.error('Failed to import data', error);
    return null;
  }
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      ...createEmptyBackupData(),

      updateUserName: (name) => set({ userName: name }),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [{ ...transaction, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...state.transactions],
        })),

      updateTransaction: (id, transaction) =>
        set((state) => ({
          transactions: state.transactions.map((currentTransaction) =>
            currentTransaction.id === id ? { ...currentTransaction, ...transaction } : currentTransaction,
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((transaction) => transaction.id !== id),
        })),

      addPerson: (person) =>
        set((state) => ({
          people: [{ ...person, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...state.people],
        })),

      deletePerson: (id) => {
        let deleted = false;

        set((state) => {
          if (state.transactions.some((transaction) => transaction.personId === id)) {
            return state;
          }

          deleted = true;
          return {
            people: state.people.filter((person) => person.id !== id),
          };
        });

        return deleted;
      },

      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, { ...category, id: crypto.randomUUID() }],
        })),

      deleteCategory: (id) => {
        let deleted = false;

        set((state) => {
          if (state.transactions.some((transaction) => transaction.category === id)) {
            return state;
          }

          deleted = true;
          return {
            categories: state.categories.filter((category) => category.id !== id),
          };
        });

        return deleted;
      },

      resetAllData: () => set(createEmptyBackupData()),

      importData: (jsonData) => {
        const parsedData = parseBackupData(jsonData);

        if (!parsedData) {
          alert('Geçersiz veri formatı!');
          return false;
        }

        set(parsedData);
        return true;
      },
    }),
    {
      name: 'vekilharc-storage',
    },
  ),
);
