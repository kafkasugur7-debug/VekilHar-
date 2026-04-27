export type TransactionType = "income" | "expense" | "payment";
export type PersonKind = "person" | "company";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  title: string;
  category: string;
  personId?: string;
  date: string; // ISO date format YYYY-MM-DD
  note?: string;
  createdAt: string; // ISO string
}

export interface Person {
  id: string;
  name: string;
  kind: PersonKind;
  note?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

export interface AppBackupData {
  transactions: Transaction[];
  people: Person[];
  categories: Category[];
  currency: string;
  userName: string;
}

export interface StoreState {
  transactions: Transaction[];
  people: Person[];
  categories: Category[];
  currency: string;
  userName: string;
  
  // Actions
  updateUserName: (name: string) => void;
  addTransaction: (t: Omit<Transaction, "id" | "createdAt">) => void;
  updateTransaction: (id: string, t: Omit<Transaction, "id" | "createdAt">) => void;
  deleteTransaction: (id: string) => void;
  addPerson: (p: Omit<Person, "id" | "createdAt">) => void;
  deletePerson: (id: string) => boolean;
  addCategory: (c: Omit<Category, "id">) => void;
  deleteCategory: (id: string) => boolean;
  resetAllData: () => void;
  importData: (jsonData: string) => boolean;
}
