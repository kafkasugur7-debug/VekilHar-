import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { TransactionType } from '../types';
import { ArrowLeft, Save, Plus, Trash2, X } from 'lucide-react';

export default function AddTransaction() {
  const navigate = useNavigate();
  const addTransaction = useStore(state => state.addTransaction);
  const people = useStore(state => state.people);
  const categories = useStore(state => state.categories);
  const addCategory = useStore(state => state.addCategory);
  const deleteCategory = useStore(state => state.deleteCategory);

  const [type, setType] = useState<TransactionType>('income');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [personId, setPersonId] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const typeLabels: Record<TransactionType, string> = {
    income: 'Gelen Para',
    expense: 'Harcama',
    payment: 'Ödeme'
  };

  const filteredCategories = categories.filter(c => c.type === type);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory({ name: newCategoryName.trim(), type });
    setNewCategoryName('');
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Kategoriyi silmek istediğinize emin misiniz?")) {
      deleteCategory(id);
      if (category === id) setCategory('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !title || !category || !date) {
      alert("Lütfen gerekli alanları doldurun.");
      return;
    }

    addTransaction({
      type,
      amount: Number(amount),
      title,
      category,
      personId: personId || undefined,
      date,
      note: note || undefined
    });

    navigate('/'); // go to home after adding
  };

  return (
    <div className="pt-2 pb-6 px-4">
      {/* Header */}
      <header className="flex items-center gap-3 py-4 mb-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-display font-semibold text-primary">Yeni İşlem</h1>
      </header>

      {/* Type Tabs */}
      <div className="bg-surface p-1.5 rounded-[16px] flex items-center gap-1 mb-6 border border-outline-variant">
        {(['income', 'expense', 'payment'] as TransactionType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setType(t);
              setCategory(''); // Reset category when type changes
            }}
            className={`flex-1 py-3 px-2 rounded-xl text-sm font-semibold transition-all ${
              type === t 
                ? 'bg-white shadow-sm text-primary border border-outline-variant' 
                : 'text-secondary hover:bg-white/50'
            }`}
          >
            {typeLabels[t]}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Entry Form */}
        <div className="bg-white border border-outline-variant rounded-[24px] p-5 shadow-sm space-y-5">
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">Tutar</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 font-display font-bold text-xl text-primary">₺</span>
              <input 
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-[16px] py-4 pl-10 pr-4 font-display text-2xl font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">Başlık</label>
            <input 
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-[16px] py-4 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Örn: Market, Maaş..."
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-end px-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Kategori</label>
              <button 
                type="button" 
                onClick={() => setIsCategoryModalOpen(true)}
                className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-md"
              >
                DÜZENLE
              </button>
            </div>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-[16px] py-4 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
              required
            >
              <option value="" disabled>Kategori seçin...</option>
              {filteredCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">Kişi / Kurum (İsteğe Bağlı)</label>
            <select
              value={personId}
              onChange={e => setPersonId(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-[16px] py-4 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
            >
              <option value="">Seçiniz...</option>
              {people.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">Tarih</label>
            <input 
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-[16px] py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">Not / Açıklama</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              className="w-full bg-surface border border-outline-variant rounded-[16px] py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              placeholder="İşlem notu..."
            />
          </div>

        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-primary text-on-primary font-bold rounded-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-primary/20"
        >
          <Save size={20} />
          Kaydet
        </button>
      </form>

      {/* Category Manager Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh] shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-outline-variant/50">
              <h3 className="font-display font-bold text-on-surface">Kategori Düzenle</h3>
              <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="text-secondary hover:text-on-surface bg-surface p-1 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto">
              <p className="text-xs text-secondary mb-4">
                <strong>{typeLabels[type]}</strong> işlemleri için kendi kategorilerinizi ekleyip silebilirsiniz.
              </p>
              
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={newCategoryName} 
                  onChange={e => setNewCategoryName(e.target.value)}
                  placeholder="Yeni kategori adı..." 
                  className="flex-1 bg-surface border border-outline-variant rounded-[16px] px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                />
                <button 
                  type="button" 
                  onClick={handleAddCategory}
                  className="bg-primary text-on-primary p-3 rounded-[16px] disabled:opacity-50"
                  disabled={!newCategoryName.trim()}
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-2">
                {filteredCategories.length === 0 ? (
                  <p className="text-center text-secondary text-sm py-4">Bu türe ait kategori bulunmuyor.</p>
                ) : (
                  filteredCategories.map(c => (
                    <div key={c.id} className="flex justify-between items-center p-3 rounded-[12px] bg-surface border border-outline-variant/50">
                      <span className="text-sm font-medium text-on-surface">{c.name}</span>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteCategory(c.id)} 
                        className="text-error/70 hover:text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
