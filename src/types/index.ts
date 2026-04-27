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

export interface StoreState {
  transactions: Transaction[];
  people: Person[];
  categories: Category[];
  currency: string;
  userName: string;
  
  // Actions
  updateUserName: (name: string) => void;
  addTransaction: (t: Omit<Transaction, "id" | "createdAt">) => void;
  updateTransaction: (id: string, t: Partial<Omit<Transaction, "id" | "createdAt">>) => void;
  deleteTransaction: (id: string) => void;
  addPerson: (p: Omit<Person, "id" | "createdAt">) => void;
  deletePerson: (id: string) => void;
  addCategory: (c: Omit<Category, "id">) => void;
  deleteCategory: (id: string) => void;
  resetAllData: () => void;
  importData: (jsonData: string) => void;
}
