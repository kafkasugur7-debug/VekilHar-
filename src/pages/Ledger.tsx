import { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatMoney, getPersonSummary } from '../utils/finance';
import { Search, UserPlus, Building, User, Trash2, X, Plus } from 'lucide-react';
import { PersonKind } from '../types';

export default function Ledger() {
  const people = useStore(state => state.people);
  const transactions = useStore(state => state.transactions);
  const deletePerson = useStore(state => state.deletePerson);
  const addPersonStore = useStore(state => state.addPerson);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newKind, setNewKind] = useState<PersonKind>('person');
  const [newNote, setNewNote] = useState('');

  const filteredPeople = people.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`${name} silinecek. Emin misiniz?`)) {
      deletePerson(id);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    addPersonStore({
      name: newName.trim(),
      kind: newKind,
      note: newNote.trim() || undefined
    });
    
    setNewName('');
    setNewKind('person');
    setNewNote('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="pt-6 pb-8 px-5">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-extrabold tracking-tight text-on-surface">Kişiler</h1>
        <p className="text-secondary text-sm mt-1">Bakiyeleri takip edin</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="İsim veya şirket ara..." 
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-outline-variant rounded-[24px] text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
        />
      </div>

      {filteredPeople.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-outline-variant p-8 text-center shadow-sm">
          <p className="text-secondary font-medium">Kişi bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPeople.map(person => {
            const summary = getPersonSummary(transactions, person.id);
            const isCompany = person.kind === 'company';
            const isDebt = summary.net < 0;

            return (
              <div key={person.id} className="bg-white rounded-[24px] p-5 border border-outline-variant shadow-sm flex flex-col gap-4 group hover:shadow-md transition-shadow cursor-default relative">
                <button 
                  onClick={() => handleDelete(person.id, person.name)}
                  className="absolute top-4 right-4 text-secondary/50 hover:text-error hover:bg-error/10 p-2 rounded-full transition-colors"
                  aria-label="Kişiyi Sil"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex items-center gap-3 pr-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isCompany ? 'bg-primary/10 text-primary' : 'bg-surface text-secondary'}`}>
                    {isCompany ? <Building size={20} /> : <User size={20} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-bold text-on-surface">{person.name}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-surface px-2 py-0.5 rounded-md mt-1 inline-block">
                      {isCompany ? 'Şirket' : 'Bireysel'}
                    </span>
                  </div>
                </div>

                <div className="flex bg-surface rounded-[16px] p-4 divide-x divide-outline-variant">
                  <div className="flex-1 px-2">
                    <p className="text-[10px] uppercase font-bold text-secondary tracking-widest">NET DURUM</p>
                    <p className={`font-display font-bold text-lg ${isDebt ? 'text-error' : 'text-tertiary'}`}>
                      {formatMoney(Math.abs(summary.net))}
                      <span className="text-xs ml-1 opacity-70 font-sans">{isDebt ? 'borç' : 'alacak'}</span>
                    </p>
                  </div>
                  <div className="flex-1 px-3 flex flex-col justify-center">
                     <p className="text-[10px] uppercase font-bold text-secondary tracking-widest mb-1">Gelen - Giden</p>
                     <div className="flex text-xs flex-col gap-0.5">
                       <span className="text-tertiary">+{formatMoney(summary.incoming)}</span>
                       <span className="text-error">-{formatMoney(summary.outgoing)}</span>
                     </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="my-6 w-full py-4 bg-primary/10 text-primary font-bold rounded-[24px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform border border-primary/20 hover:bg-primary/20"
      >
        <UserPlus size={20} />
        Yeni Kişi / Kurum Ekle
      </button>

      {/* Add Person Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-sm overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-outline-variant/50">
              <h3 className="font-display font-bold text-on-surface">Yeni Kayıt</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-secondary hover:text-on-surface bg-surface p-1 rounded-full border border-transparent hover:border-outline-variant transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-5 flex-1 flex flex-col gap-5">
              <div className="flex bg-surface p-1.5 rounded-[12px] border border-outline-variant">
                <button
                  type="button"
                  onClick={() => setNewKind('person')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${newKind === 'person' ? 'bg-white shadow-sm text-primary border border-outline-variant' : 'text-secondary hover:bg-white/50'}`}
                >
                  Bireysel
                </button>
                <button
                  type="button"
                  onClick={() => setNewKind('company')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${newKind === 'company' ? 'bg-white shadow-sm text-primary border border-outline-variant' : 'text-secondary hover:bg-white/50'}`}
                >
                  Şirket
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">İsim veya Ünvan</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Örn: Ahmet Yılmaz" 
                  className="w-full bg-surface border border-outline-variant rounded-[16px] py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">Not (İsteğe Bağlı)</label>
                <textarea 
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Açıklama..." 
                  rows={2}
                  className="w-full bg-surface border border-outline-variant rounded-[16px] py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-primary text-on-primary font-bold rounded-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-primary/20 mt-2"
              >
                <Plus size={20} />
                Oluştur
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
