import { useState } from 'react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { formatMoney } from '../utils/finance';
import { Pencil, Search, Trash2 } from 'lucide-react';
import { TransactionType } from '../types';

export default function Transactions() {
  const navigate = useNavigate();
  const transactions = useStore(state => state.transactions);
  const categories = useStore(state => state.categories);
  const people = useStore(state => state.people);
  const deleteTransaction = useStore(state => state.deleteTransaction);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');

  const transactionTypeLabels: Record<TransactionType, string> = {
    income: 'Gelen',
    expense: 'Harcama',
    payment: 'Ödeme',
  };

  const handleDeleteTransaction = (id: string, title: string) => {
    if (window.confirm(`"${title}" işlemini silmek istediğinize emin misiniz?`)) {
      deleteTransaction(id);
    }
  };

  const filtered = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    const searchLow = searchTerm.toLowerCase();
    const catName = categories.find(c => c.id === t.category)?.name || '';
    const personName = people.find(p => p.id === t.personId)?.name || '';
    return (
      t.title.toLowerCase().includes(searchLow) ||
      catName.toLowerCase().includes(searchLow) ||
      personName.toLowerCase().includes(searchLow)
    );
  });

  // Group by date
  const grouped = filtered.reduce((groups, t) => {
    const key = t.date;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
    return groups;
  }, {} as Record<string, typeof transactions>);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="pt-6 pb-8 px-5">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-extrabold text-on-surface">İşlemler</h1>
        <p className="text-slate-500 text-sm mt-1">Tüm borç ve alacak geçmişiniz</p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="İsim veya kategori ara..." 
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-outline-variant rounded-[24px] text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-4">
        <button 
          onClick={() => setFilterType('all')}
          className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap active:scale-95 transition-all ${filterType === 'all' ? 'bg-primary text-on-primary shadow-md' : 'bg-surface border border-outline-variant text-secondary'}`}
        >
          Hepsi
        </button>
        <button 
          onClick={() => setFilterType('expense')}
          className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap active:scale-95 transition-all ${filterType === 'expense' ? 'bg-primary text-on-primary shadow-md' : 'bg-surface border border-outline-variant text-secondary'}`}
        >
          Harcamalar
        </button>
        <button
          onClick={() => setFilterType('income')}
          className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap active:scale-95 transition-all ${filterType === 'income' ? 'bg-primary text-on-primary shadow-md' : 'bg-surface border border-outline-variant text-secondary'}`}
        >
          Gelenler
        </button>
        <button
          onClick={() => setFilterType('payment')}
          className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap active:scale-95 transition-all ${filterType === 'payment' ? 'bg-primary text-on-primary shadow-md' : 'bg-surface border border-outline-variant text-secondary'}`}
        >
          Ödemeler
        </button>
      </div>

      <div className="space-y-6 mt-6">
        {sortedDates.length === 0 ? (
          <div className="bg-white rounded-[24px] border border-outline-variant p-8 text-center shadow-sm">
            <p className="text-secondary font-medium">İşlem bulunamadı.</p>
          </div>
        ) : (
          sortedDates.map(dateStr => {
            const dateObj = parseISO(dateStr);
            const label = isToday(dateObj) ? 'BUGÜN' : isYesterday(dateObj) ? 'DÜN' : format(dateObj, 'd MMMM yyyy', { locale: tr });

            return (
              <section key={dateStr}>
                <h3 className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-3 ml-2">{label}</h3>
                <div className="bg-white rounded-[24px] border border-outline-variant shadow-sm overflow-hidden divide-y divide-surface">
                  {grouped[dateStr].map(tx => {
                    const isIncome = tx.type === 'income';
                    const personName = people.find(p => p.id === tx.personId)?.name;
                    const categoryName = categories.find(c => c.id === tx.category)?.name;
                    
                    return (
                      <div key={tx.id} className="p-4 flex items-center justify-between gap-3 hover:bg-surface transition-colors">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${isIncome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {tx.title.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-on-surface line-clamp-1">{tx.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                              {personName || categoryName || ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className={`font-display font-bold block ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                              {isIncome ? '+' : '-'}{formatMoney(tx.amount)}
                            </span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mt-1 inline-block ${isIncome ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {transactionTypeLabels[tx.type]}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => navigate(`/transactions/${tx.id}/edit`)}
                              className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
                              aria-label={`${tx.title} işlemini düzenle`}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTransaction(tx.id, tx.title)}
                              className="p-1.5 rounded-lg text-error/70 hover:text-error hover:bg-error/10 transition-colors"
                              aria-label={`${tx.title} işlemini sil`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
