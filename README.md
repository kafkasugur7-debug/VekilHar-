# VekilHarç

VekilHarç, iPhone üzerinde kişisel veya küçük ölçekli işletme kullanımı için geliştirilen local-first bir finans ve kasa takip uygulamasıdır. Uygulama React ile yazılmış, Capacitor ile iOS projesine dönüştürülmüştür. Harici backend, API anahtarı, bulut veri tabanı veya sunucu bağımlılığı yoktur.

Bu dosya ürün tanıtımından çok proje dokümantasyonu ve çalışma notu olarak tutulur. Amaç, daha sonra projeye geri dönüldüğünde mevcut durumu, teknik kararları ve nerede kalındığını hızlıca anlayabilmektir.

## Durum Özeti

Bu repo için mevcut durum tarihi: `2026-04-27`

Şu anda:

- React uygulaması çalışır durumda
- TypeScript kontrolü geçiyor
- Production build geçiyor
- Capacitor iOS projesi oluşturuldu
- Xcode üzerinden cihazda çalıştırılabiliyor
- Uygulama local-first çalışıyor
- Demo veri kaldırıldı
- JSON yedekleme ve geri yükleme çalışıyor
- CSV dışa aktarımı var
- İşlem düzenleme ve silme UI akışı var
- Ağ bağımlılıkları kaldırıldı

## Temel Ürün Kararı

Bu uygulama özellikle şu prensiplerle tutuluyor:

1. Veri cihazda kalacak
2. Uygulama internet olmadan kullanılabilecek
3. Harici servis entegrasyonları şu aşamada olmayacak
4. iOS üzerinde Xcode ile kolayca derlenip yüklenebilecek
5. Kod tabanı küçük, sade ve bakım yapılabilir kalacak

Bu nedenle aşağıdakiler bilinçli olarak kaldırılmış veya eklenmemiştir:

- Gemini / AI entegrasyonu
- Express / backend katmanı
- Google Drive yedekleme
- Bulut senkronizasyonu
- Sunucudan veri çekme
- API key gereksinimi

## Teknoloji Yığını

- `React 19`
- `TypeScript`
- `Vite`
- `Zustand`
- `Zustand persist`
- `Tailwind CSS v4`
- `date-fns`
- `lucide-react`
- `Capacitor 8`
- `Xcode`

## Proje Yapısı

### Kök dizin

- `package.json`
  Çalıştırma komutları ve bağımlılıklar

- `capacitor.config.ts`
  Capacitor uygulama kimliği ve web build klasörü

- `vite.config.ts`
  Vite yapılandırması

- `index.html`
  Web giriş HTML dosyası

- `README.md`
  Bu dokümantasyon dosyası

### Uygulama kaynak kodu

`src/` altında uygulamanın tamamı bulunur.

- `src/main.tsx`
  React giriş noktası

- `src/App.tsx`
  Router tanımı

- `src/index.css`
  Tema token'ları ve temel stil ayarları

- `src/types/index.ts`
  TypeScript veri tipleri

- `src/store/useStore.ts`
  Zustand store, veri kalıcılığı, import/export kuralları

- `src/utils/finance.ts`
  Finans hesaplama yardımcıları

- `src/utils/spreadsheet.ts`
  CSV dışa aktarma yardımcıları

- `src/components/layout/AppLayout.tsx`
  Genel uygulama kabuğu

- `src/components/layout/BottomNav.tsx`
  Alt navigasyon

- `src/pages/Dashboard.tsx`
  Özet ekranı

- `src/pages/AddTransaction.tsx`
  Yeni işlem ekleme ekranı

- `src/pages/Transactions.tsx`
  Tüm işlemler listesi

- `src/pages/Ledger.tsx`
  Kişi / kurum yönetimi

- `src/pages/Settings.tsx`
  Yedekleme, profil ve sıfırlama ekranı

### Üretilen build çıktıları

- `dist/`
  Vite production build çıktısı

Bu klasör manuel düzenlenmez. `npm run build` ile yeniden üretilir.

### iOS projesi

- `ios/App/App.xcodeproj`
  Xcode tarafından açılan proje

- `ios/App/App/`
  Native iOS dosyaları

- `ios/App/App/public/`
  Web build'in Capacitor tarafından iOS içine kopyalanmış hali

- `ios/App/CapApp-SPM/`
  Capacitor Swift Package Manager tarafı

Not:

- `ios/` klasörü oluşturulduktan sonra Xcode tarafı buradan yönetilir
- Web UI tarafındaki değişiklikler doğrudan `ios/App/App/public` içinde yapılmaz
- Kaynak gerçek kod her zaman `src/` içindedir

## Navigasyon ve Ekranlar

Uygulama `HashRouter` kullanır. Bu tercih özellikle WebView içinde rota yönetimini daha güvenli yapmak için seçilmiştir.

Rotalar:

- `#/` -> Dashboard
- `#/add` -> Yeni işlem
- `#/transactions` -> İşlem listesi
- `#/ledger` -> Kişiler
- `#/settings` -> Ayarlar

### 1. Dashboard

Amaç:

- Aylık finans durumunu hızlı göstermek
- Seçilen aya kadar kümülatif bakiyeyi göstermek
- Son işlemleri özetlemek

Gösterilen veriler:

- Aylık gelir
- Aylık gider
- Aylık net durum
- Kümülatif bakiye
- Son 3 işlem

### 2. AddTransaction

Amaç:

- Yeni gelir, harcama veya ödeme eklemek
- Var olan gelir, harcama veya ödeme işlemini düzenlemek

Desteklenen işlem tipleri:

- `income`
- `expense`
- `payment`

Form alanları:

- Tutar
- Başlık
- Kategori
- Kişi / Kurum
- Tarih
- Not

Ek davranışlar:

- Kategori listesi işlem tipine göre filtrelenir
- Yeni kategori eklenebilir
- Kullanımda olan kategori silinemez

### 3. Transactions

Amaç:

- Tüm işlem geçmişini tarih bazlı göstermek

Özellikler:

- Arama
- Tarihe göre gruplama
- İşlem düzenleme
- İşlem silme
- `BUGÜN` / `DÜN` etiketleri
- Tür filtreleri:
  - Hepsi
  - Harcamalar
  - Gelenler
  - Ödemeler

### 4. Ledger

Amaç:

- Kişi ve kurum bazında bakiye takibi

Özellikler:

- Bireysel ve şirket kaydı ekleme
- Arama
- Her kişi için:
  - Toplam gelen
  - Toplam giden
  - Net durum

Koruma kuralı:

- Herhangi bir işlemde kullanılan kişi / kurum silinemez

### 5. Settings

Amaç:

- Uygulama verilerini yönetmek
- Kullanıcı adını güncellemek
- Yedekleme almak

Özellikler:

- Kullanıcı adı güncelleme
- JSON backup export
- JSON backup import
- CSV export
- Tüm veriyi sıfırlama

## Veri Modeli

Veri modeli `src/types/index.ts` içinde tanımlı.

### Transaction

Alanlar:

- `id`
- `type`
- `amount`
- `title`
- `category`
- `personId`
- `date`
- `note`
- `createdAt`

### Person

Alanlar:

- `id`
- `name`
- `kind`
- `note`
- `createdAt`

### Category

Alanlar:

- `id`
- `name`
- `type`

### AppBackupData

JSON yedekleme için kullanılan yapı:

- `transactions`
- `people`
- `categories`
- `currency`
- `userName`

## Zustand Store Davranışı

Ana store dosyası: `src/store/useStore.ts`

Store state:

- `transactions`
- `people`
- `categories`
- `currency`
- `userName`

Actions:

- `updateUserName`
- `addTransaction`
- `updateTransaction`
- `deleteTransaction`
- `addPerson`
- `deletePerson`
- `addCategory`
- `deleteCategory`
- `resetAllData`
- `importData`

Önemli davranışlar:

- Store `persist` ile `localStorage` içinde tutulur
- Uygulama ilk açılışta demo işlem yüklemez
- Varsayılan kategori listesi hazır gelir
- `currency` sabit `TRY`
- JSON import mevcut verinin yerine geçer
- Hatalı JSON import reddedilir
- İlişkili kişi/kategori silme işlemleri engellenir

## Finans Hesaplama Mantığı

Finans yardımcıları `src/utils/finance.ts` içinde.

Ana fonksiyonlar:

- `formatMoney`
- `getTransactionsByMonth`
- `getMonthlyIncome`
- `getMonthlyExpense`
- `getMonthlyNet`
- `getCumulativeBalance`
- `getPersonSummary`

İş mantığı:

- `income` pozitif
- `expense` ve `payment` negatif etki oluşturur
- Kümülatif bakiye seçilen aya kadar hesaplanır
- Kişi özeti gelen - giden mantığıyla hesaplanır

## Yedekleme ve Dışa Aktarma

### JSON Export

Amaç:

- Tam uygulama durumunu geri yüklenebilir biçimde saklamak

İçerik:

- işlemler
- kişiler
- kategoriler
- kullanıcı adı
- para birimi

### JSON Import

Davranış:

- Mevcut verinin yerine geçer
- Geçersiz format reddedilir
- Eksik kategori listesi varsa varsayılan kategorilerle tamamlanır

### CSV Export

Amaç:

- Excel ile açılabilen basit taşınabilir çıktı almak

Neden CSV seçildi:

- `xlsx` paketindeki güvenlik riskini kaldırmak
- Kod tabanını küçültmek
- Sunucusuz ve yerel kullanımda daha basit çözüm sağlamak

CSV dosyasında bölümler:

- İşlemler
- Kişiler ve Kurumlar
- Kategoriler

## Stil ve Arayüz Kararları

Genel tasarım yaklaşımı:

- Mobile-first
- iOS benzeri açık tema
- Yumuşak kartlar
- Alt navigasyon
- Tek ekranlı SPA hissi

Renk mantığı:

- Mavi: ana aksiyonlar
- Yeşil: pozitif durum
- Kırmızı: negatif durum
- Açık gri: yüzey rengi

Font tercihi:

- Harici Google Font kaldırıldı
- Sistem font stack kullanılıyor

Bu tercih neden yapıldı:

- Ağ bağımsızlığı
- Daha hızlı açılış
- iOS üzerinde yerel görünüm

## iOS Tarafı

### Mevcut durum

Şu anda iOS projesi oluşturulmuş durumda.

Önemli dosya:

- `ios/App/App.xcodeproj`

### iOS akışı

Kod değişikliği yaptıktan sonra:

```bash
npm run build
npm run ios:sync
npm run ios:open
```

İlk kez iOS projesi oluşturmak gerekirse:

```bash
npm run build
npm run ios:add
```

### Xcode içinde

Yapılacaklar:

1. `App` target'ını seç
2. `Signing & Capabilities` sekmesine gir
3. `Automatically manage signing` açık olsun
4. `Team` olarak kendi Apple hesabını seç
5. Gerekirse `Bundle Identifier` benzersiz olacak şekilde değiştir
6. Cihazı seç
7. `Run` ile telefona yükle

### Bundle identifier

Mevcut değer:

- `com.cepera.vekilharc`

Gerekirse örnek alternatif:

- `com.ugurkafkas.vekilharc`

## Çalıştırma Komutları

### Geliştirme

```bash
npm install
npm run dev
```

### Kontrol

```bash
npm run lint
npm run build
```

### iOS

```bash
npm run ios:add
npm run ios:sync
npm run ios:open
```

## Mevcut Sınırlamalar

Şu anda bilinen sınırlar:

- Veri `localStorage` içinde tutuluyor
- Uygulama silinirse veriler de silinebilir
- Çok büyük veri hacmi için ayrı optimizasyon yok
- iOS dosya paylaşımı ve indirme davranışı WebView ortamına göre değişebilir
- Veriler cihazlar arasında senkronize edilmez
- Şifreleme / biyometrik kilit yok
- Grafik ekranı yok

## Bilinçli Olarak Yapılmayanlar

Bu aşamada özellikle eklenmemiş özellikler:

- Kullanıcı girişi
- Sunucu tarafı veri saklama
- Firebase / Supabase
- Google Drive yedekleme
- Push notification
- Face ID / Touch ID kilidi
- Çoklu para birimi
- Gelişmiş raporlama ve grafikler

## Nerede Kaldık?

Bu proje için son önemli teknik temizlikler:

- API bağımlılıkları kaldırıldı
- Gizli anahtar ihtiyacı kaldırıldı
- `HashRouter` kullanıldı
- `bundledWebRuntime` gibi eski Capacitor alanları temizlendi
- `xlsx` kaldırılıp CSV export'a geçildi
- Demo veri kaldırıldı
- İlişkili kişi/kategori silme koruması eklendi
- İşlem düzenleme ve silme akışı eklendi
- JSON import/export veri yapısı tutarlı hale getirildi
- iOS projesi üretildi ve Xcode ile açılabilir duruma getirildi

Yani şu anki proje seviyesi:

- Kullanılabilir MVP
- Local-first
- iPhone'a yüklenebilir
- Kod tabanı sade ve bakımı kolay

## Sonraki Mantıklı Adımlar

Bir sonraki geliştirme turunda mantıklı adaylar:

1. Dashboard için grafikler
2. iOS üzerinde daha güvenilir dosya export/import deneyimi
3. Uygulama açılış kilidi
4. Basit aylık rapor ekranı
5. Local veri için daha sağlam migration stratejisi

## Dikkat Edilecek Kurallar

- `src/` dışındaki üretim çıktıları elle düzenlenmez
- `dist/` sadece build çıktısıdır
- `ios/App/App/public` içine manuel müdahale edilmez
- Native tarafa geçmeden önce her zaman `npm run build` çalıştırılır
- Web kodu değişince mutlaka `npm run ios:sync` yapılır

## Hızlı Devam Rehberi

Projeye daha sonra geri dönüldüğünde şu sırayla devam edilebilir:

1. `npm install`
2. `npm run lint`
3. `npm run build`
4. UI geliştirmesi yapılacaksa `src/` altından ilerle
5. iPhone'a tekrar yüklemek için:
   - `npm run ios:sync`
   - `npm run ios:open`
   - Xcode içinde `Run`

## Kapanış Notu

Bu repo şu anda bilinçli olarak küçük tutulmuş bir iOS finans uygulamasıdır. En önemli karar, sistemi yerel, bağımsız ve sürdürülebilir tutmaktır. Eğer ileride kapsam büyütülecekse, bu dosya önce güncellenmeli; böylece proje hafızası korunmuş olur.
