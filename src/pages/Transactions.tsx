import { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatMoney } from '../utils/finance';
import { Search, X, Trash2, Edit2 } from 'lucide-react';
import { TransactionType, Transaction } from '../types';

export default function Transactions() {
  const transactions = useStore(state => state.transactions);
  const categories = useStore(state => state.categories);
  const people = useStore(state => state.people);
  const deleteTransaction = useStore(state => state.deleteTransaction);
  const updateTransaction = useStore(state => state.updateTransaction);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [editAmount, setEditAmount] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPersonId, setEditPersonId] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNote, setEditNote] = useState('');

  const openEditModal = (tx: Transaction) => {
    setEditingTx(tx);
    setEditAmount(tx.amount.toString());
    setEditTitle(tx.title);
    setEditCategory(tx.category);
    setEditPersonId(tx.personId || '');
    setEditDate(tx.date);
    setEditNote(tx.note || '');
  };

  const closeEditModal = () => {
    setEditingTx(null);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;
    
    if (!editAmount || Number(editAmount) <= 0 || !editTitle || !editCategory || !editDate) {
      alert("Lütfen zorunlu alanları doldurun.");
      return;
    }

    updateTransaction(editingTx.id, {
      amount: Number(editAmount),
      title: editTitle.trim(),
      category: editCategory,
      personId: editPersonId || undefined,
      date: editDate,
      note: editNote.trim() || undefined
    });

    closeEditModal();
  };

  const handleDelete = () => {
    if (!editingTx) return;
    if (window.confirm('Bu işlemi silmek istediğinize emin misiniz?')) {
      deleteTransaction(editingTx.id);
      closeEditModal();
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
      </div>

      <div className="space-y-6 mt-6">
        {sortedDates.length === 0 ? (
          <div className="bg-white rounded-[24px] border border-outline-variant p-8 text-center shadow-sm">
            <p className="text-secondary font-medium">İşlem bulunamadı.</p>
          </div>
        ) : (
          sortedDates.map(dateStr => {
            const dateObj = new Date(dateStr);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            const isYesterday = (() => {
              const d = new Date();
              d.setDate(d.getDate() - 1);
              return d.toISOString().split('T')[0] === dateStr;
            })();

            const label = isToday ? 'BUGÜN' : isYesterday ? 'DÜN' : new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric'}).format(dateObj);

            return (
              <section key={dateStr}>
                <h3 className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-3 ml-2">{label}</h3>
                <div className="bg-white rounded-[24px] border border-outline-variant shadow-sm overflow-hidden divide-y divide-surface">
                  {grouped[dateStr].map(tx => {
                    const isIncome = tx.type === 'income';
                    const personName = people.find(p => p.id === tx.personId)?.name;
                    
                    return (
                      <div 
                        key={tx.id} 
                        onClick={() => openEditModal(tx)}
                        className="p-4 flex items-center justify-between hover:bg-surface transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${isIncome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {tx.title.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-on-surface line-clamp-1">{tx.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                              {personName || categories.find(c => c.id === tx.category)?.name || ''}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`font-display font-bold block ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                            {isIncome ? '+' : '-'}{formatMoney(tx.amount)}
                          </span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mt-1 inline-block ${isIncome ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {isIncome ? 'Gelen' : 'Giden'}
                          </span>
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

      {editingTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center">
          <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/50">
              <h2 className="text-xl font-display font-bold text-on-surface flex items-center gap-2">
                <Edit2 size={24} className="text-primary" />
                İşlemi Düzenle
              </h2>
              <button onClick={closeEditModal} className="p-2 rounded-full hover:bg-surface text-secondary transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 overflow-y-auto space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">Tutar (₺)</label>
                <input 
                  type="number" 
                  value={editAmount}
                  onChange={e => setEditAmount(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-surface border border-outline-variant rounded-[16px] py-3.5 px-4 text-lg font-bold font-display focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">Başlık</label>
                <input 
                  type="text" 
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="Örn: Market Alışverişi" 
                  className="w-full bg-surface border border-outline-variant rounded-[16px] py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">Kategori</label>
                <select
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-[16px] py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                  required
                >
                  <option value="" disabled>Seçiniz...</option>
                  {categories.filter(c => c.type === editingTx.type).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">İlişkili Kişi/Kurum (Opsiyonel)</label>
                <select
                  value={editPersonId}
                  onChange={e => setEditPersonId(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-[16px] py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                >
                  <option value="">Yok</option>
                  {people.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">Tarih</label>
                <input 
                  type="date" 
                  value={editDate}
                  onChange={e => setEditDate(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-[16px] py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">Açıklama / Not</label>
                <textarea 
                  value={editNote}
                  onChange={e => setEditNote(e.target.value)}
                  placeholder="İsteğe bağlı notlar..." 
                  rows={2}
                  className="w-full bg-surface border border-outline-variant rounded-[16px] py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
              </div>
              
              <div className="flex gap-3 pt-2 pb-6">
                <button 
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 py-4 bg-error/10 text-error font-bold rounded-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  <Trash2 size={20} />
                  Sil
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-4 bg-primary text-on-primary font-bold rounded-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-primary/20"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
