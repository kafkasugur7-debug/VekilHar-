import { useStore } from '../store/useStore';
import { Download, Upload, AlertCircle, Trash2, FileSpreadsheet } from 'lucide-react';
import { useRef, type ChangeEvent } from 'react';
import { AppBackupData } from '../types';
import { downloadSpreadsheetCsv } from '../utils/spreadsheet';

export default function Settings() {
  const resetAllData = useStore(state => state.resetAllData);
  const importData = useStore(state => state.importData);
  const userName = useStore(state => state.userName);
  const updateUserName = useStore(state => state.updateUserName);
  
  const transactions = useStore(state => state.transactions);
  const people = useStore(state => state.people);
  const categories = useStore(state => state.categories);
  const currency = useStore(state => state.currency);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    if (window.confirm("Tüm veri silinecek. Emin misiniz?")) {
      resetAllData();
      alert("Uygulama temiz başlangıç durumuna döndürüldü.");
    }
  };

  const handleExportData = () => {
    const dataObj: AppBackupData = { transactions, people, categories, currency, userName };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObj));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "vekilharc-backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportSpreadsheet = () => {
    try {
      downloadSpreadsheetCsv({ transactions, people, categories, currency, userName });
    } catch (error) {
      console.error(error);
      alert("CSV dosyası oluşturulurken hata oluştu.");
    }
  };

  const handleImportData = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (window.confirm("İçe aktarılan yedek mevcut verilerinizin yerine geçecek. Devam edilsin mi?")) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result as string;
        const imported = importData(result);
        if (imported) {
          alert("Yedek başarıyla yüklendi.");
        }
        if(fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsText(file);
    } else {
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="pt-6 pb-8 px-5">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-extrabold tracking-tight text-on-surface">Ayarlar</h1>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-[24px] p-6 border border-outline-variant shadow-sm">
          <h2 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-4">Kullanıcı Profili</h2>
          <div className="space-y-1 mt-2">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">Adınız / Ünvanınız</label>
            <input 
              type="text" 
              value={userName}
              onChange={(e) => updateUserName(e.target.value)}
              placeholder="İsminizi girin..."
              className="w-full bg-surface border border-outline-variant rounded-[16px] py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </section>

        <section className="bg-white rounded-[24px] p-6 border border-outline-variant shadow-sm">
          <h2 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-4">Dışa Aktarım ve Yedekleme</h2>

          <div className="space-y-3">
            <button 
              onClick={handleExportSpreadsheet}
              className="w-full flex items-center justify-between p-4 rounded-[16px] bg-[#E9FBE9] hover:bg-[#D4F6D4] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tertiary-container text-tertiary flex items-center justify-center">
                  <FileSpreadsheet size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-tertiary text-sm">CSV İndir</p>
                  <p className="text-xs text-tertiary/80 mt-0.5">Excel'in açabildiği tablo yedeğini cihazınıza indirin</p>
                </div>
              </div>
            </button>
          </div>
        </section>

        <section className="bg-white rounded-[24px] p-6 border border-outline-variant shadow-sm">
          <h2 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-4">Veri Yönetimi (Gelişmiş)</h2>
          
          <div className="space-y-3">
            <button 
              onClick={handleExportData}
              className="w-full flex items-center justify-between p-4 rounded-[16px] bg-surface hover:bg-outline-variant transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Download size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">JSON Yedeği İndir</p>
                  <p className="text-xs text-secondary mt-0.5">Sisteme geri yüklemek için JSON formatında dışa aktarın</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between p-4 rounded-[16px] bg-surface hover:bg-outline-variant transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Upload size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">JSON Yedeği Yükle</p>
                  <p className="text-xs text-secondary mt-0.5">JSON dosyasından verilerinizi geri yükleyin</p>
                </div>
              </div>
            </button>
            <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImportData} />

            <div className="pt-4 border-t border-outline-variant mt-4">
              <button 
                onClick={handleReset}
                className="w-full flex items-center justify-between p-4 rounded-[16px] bg-error-container hover:bg-[#FFE0E0] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/50 text-error flex items-center justify-center">
                    <Trash2 size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-error text-sm">Verileri Sıfırla</p>
                    <p className="text-xs text-error/80 mt-0.5">Geri alınamaz işlem</p>
                  </div>
                </div>
              </button>
            </div>

          </div>
        </section>

        <section className="bg-white rounded-[24px] p-6 border border-outline-variant shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-surface rounded-[16px] flex items-center justify-center text-secondary">
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-sm">VekilHarç</h4>
            <p className="text-xs text-secondary mt-0.5">v1.0.0 • Prototype MVP</p>
            <p className="text-[10px] text-secondary mt-1">Geliştirici: Cepera Yazılım ve Veri Madenciliği</p>
            <p className="text-[10px] text-secondary mt-0.5">Veriler cihazınızda tutulur; harici API veya bulut senkronizasyonu yoktur.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
