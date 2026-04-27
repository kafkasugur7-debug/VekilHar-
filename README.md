# VekilHarç - Finans ve Kasa Takip Uygulaması

VekilHarç, bireysel kullanıcılar ve küçük işletmeler için tasarlanmış modern, "mobile-first" (öncelikle mobil) bir borç/alacak ve gelir/gider takip uygulamasıdır. İnternet bağlantısı gerektirmeyen (local-first) yapısı, modern "Bento Grid" tasarım dili ve iOS uygulamalarına benzeyen akıcı arayüzü ile günlük finansal takibi kolaylaştırır.

---

## 🚀 Mevcut Özellikler (Neler Yaptık?)

Şu ana kadar uygulamanın MVP (Minimum Viable Product) ve ileri düzey özelliklerini tamamladık:

### 1. Modern ve Akıcı Kullanıcı Arayüzü (UI/UX)
*   **Bento Grid Tasarımı:** Bilgileri yuvarlatılmış şık kartlar içinde (Apple/iOS tarzı) sunan modern görünüm.
*   **Mobile-First Yapı:** Tamamen mobil ekran boyutlarına optimize edilmiş düzen ve alt navigasyon barı (Bottom Nav).
*   **Dinamik Renkler:** Gelir (Yeşil), Gider/Borç (Kırmızı), ve Nötr (Mavi/Gri) renk kodlamaları ile finansal durumun bir bakışta anlaşılması.

### 2. Dashboard (Özet Ekranı)
*   **Kümülatif Bakiye:** Tüm zamanların toplam net nakit durumu.
*   **Aylık Görünüm:** Ay seçici ile geçmiş ve gelecek ayların durumunu inceleyebilme.
*   **Aylık Net Durum:** Seçili aydaki toplam gelen ve toplam giden hesaplaması.
*   **Hızlı İşlemler:** Son eklenen işlemlerin ana ekranda kısa bir özeti.

### 3. İşlem Yönetimi (Transactions & Add)
*   Gelir, Gider ve Ödeme olarak 3 farklı işlem tipi.
*   İşlemleri tarihe göre gruplama (Bugün, Dün, geçmiş tarihler).
*   **Kişi/Kurum İlişkilendirme:** Bir harcamayı veya geliri belirli bir kişiyle veya şirketle eşleştirme.
*   **Dinamik Kategori Yönetimi:** Kullanıcının kendi kategorilerini ekleyip silebilmesi.

### 4. Kişiler ve Kurumlar (Ledger)
*   Kişi (Bireysel) veya Şirket (Kurumsal) cari hesapları oluşturma listeleme.
*   Kişi bazlı finansal analiz: "Bu kişiden ne kadar geldi, ne kadar gitti, şu anki net alacağımız/borcumuz nedir?"
*   Güvenli silme işlemleri.

### 5. Veri Yönetimi ve Güvenlik (Settings)
*   **İsim Değiştirme:** Kullanıcının arayüzdeki adını değiştirebilmesi.
*   **Local Storage:** Tüm verilerin cihaz hafızasında güvenle saklanması (Zustand Persist).
*   **Excel (XLSX) Çıktısı:** Verilerin Excel tablosu olarak indirilmesi.
*   **Google Drive Yedekleme:** Kullanıcının kendi Google hesabına giriş yaparak Excel yedeğini doğrudan Drive'a atabilmesi.
*   **JSON Import/Export:** Teknik yedekleme için JSON formatında verileri indirip geri yükleyebilme.
*   Tüm verileri sıfırlama seçeneği (Onaylı).

---

## 🔮 Gelecek Yol Haritası (Bundan Sonra Yapılabilecekler)

Proje şu anki haliyle App Store'a çıkmaya hazır bir MVP'dir. Ancak ileride şu özellikler eklenebilir:

1.  **Gelişmiş Grafikler:** Recharts veya Chart.js kullanılarak harcama dağılımlarını gösteren pasta grafikler (Pie Charts).
2.  **Çoklu Para Birimi (Multi-Currency):** Döviz kurlarının bir API (örn: TCMB) ile çekilip TL'ye çevrilmesi veya cüzdanların döviz bazlı ayrılması.
3.  **Hatırlatıcılar ve Bildirimler (Push Notifications):** Capacitor Local Notifications eklentisi ile "Bugün Ahmet'e ödeme yapılacak" gibi bildirimlerin cihaza gönderilmesi.
4.  **Biyometrik Güvenlik:** Uygulama açılışına FaceID / TouchID kilidi eklenmesi.
5.  **Karanlık Mod (Dark Mode):** Sadece açık tema yerine, kullanıcının telefon ayarlarına duyarlı tam koyu tema desteği.
6.  **Bulut Senkronizasyonu (Cloud Sync):** Local tabandan çıkılıp Firebase (Firestore) veya Supabase'e geçilerek verilerin birden çok cihazda eşzamanlı çalışması.

---

## 🍏 Xcode ile Uygulamayı Canlıya (App Store) Alma Rehberi

VekilHarç, React tabanlı bir web projesi olarak yazılmış olup **Capacitor** ile doğrudan bir iOS (ve istenirse Android) uygulamasına çevrilecek şekilde ayarlanmıştır. Uygulamanızı Apple cihazlarda çalıştırmak ve yayınlamak için aşağıdaki adımları izleyin.

### Gereksinimler
*   **Mac Bilgisayar:** iOS geliştirmesi için şarttır.
*   **Xcode:** Mac App Store'dan ücretsiz olarak indirebilirsiniz.
*   **Apple Developer Hesabı:** App Store'a yüklemek için ücretli bir Apple Geliştirici hesabına ihtiyacınız vardır (Sadece kendi telefonunuzda test etmek için ücretsiz hesap yeterlidir).
*   **CocoaPods:** Terminalde `sudo gem install cocoapods` yazarak kurmalısınız (iOS bağımlılıkları için).

### Geliştirme ve Test Döngüsü (Development Loop)

Kod tarafında (UI, renkler, yeni özellik vb.) bir değişiklik yaptığınızda, bu değişikliğin Xcode projesine yansıması için her seferinde şu iki komutu sırasıyla çalıştırmalısınız:

```bash
# 1. Web projesini derle (React kodunu 'dist' klasörüne statik HTML/JS olarak çevirir)
npm run build

# 2. Derlenen bu web kodunu Capacitor ile iOS projesinin içine kopyala / senkronize et
npx cap sync ios
```

### Xcode'u Başlatma ve Karşılama Ayarları

Web uygulamasını iOS projesi ile senkronize ettikten sonra Xcode'u açın:

```bash
npx cap open ios
```

Bu komut, projenin içindeki `ios/App/App.xcworkspace` dosyasını Xcode ile açacaktır.

#### 1. İmzalama (Signing) Ayarları
1. Xcode sol menüsünden en üstteki **App** klasörüne tıklayın.
2. Ortadaki ekranda hedeflerin listelendiği (Targets) bölümden **App**'i seçin.
3. Üst sekmelerden **Signing & Capabilities** sekmesine geçin.
4. **Automatically manage signing** kutucuğunun işaretli olduğundan emin olun.
5. **Team** açılır menüsünden kendi Apple ID / Developer ekibinizi seçin.
6. *Bundle Identifier* kısmının `com.cepera.vekilharc` olduğundan emin olun.

#### 2. Uygulama İkonu ve Açılış Ekranı (Splash Screen)
1. Xcode sol menüsünden `App > App > Assets.xcassets` dizinine gidin.
2. **AppIcon** seçeneğine tıklayın. Burada uygulamanızın logo görsellerini (1024x1024 boyutundan başlayıp küçülen çeşitli boyutlarda) sürükleyip bırakabilirsiniz.
3. Eğer @capacitor/splash-screen kullanılıyorsa, açılış görselini de buradan güncelleyebilirsiniz.

### Kendi Telefonunuzda Test Etme
1. iPhone'unuzu bilgisayarınıza kablo ile bağlayın.
2. Telefonunuzda *Geliştirici Modu* açık değilse ayarlardan açın (Ayarlar > Gizlilik ve Güvenlik > Geliştirici Modu).
3. Xcode'un en tepe-orta kısmındaki hedef cihaz seçicisine tıklayıp bağladığınız iPhone'u seçin.
4. Sol üstteki ▶️ (Play - Run) butonuna basın (`Cmd + R`). Uygulama derlenip telefonunuza yüklenecek ve açılacaktır.

### App Store'a Yükleme (Archive & Publish)
Uygulama hazır, test ettiniz ve App Store'a göndermek istiyorsunuz:

1. Xcode'un en tepesindeki cihaz seçicisine tıklayın ve fiziksel cihazınız *yerine* **Any iOS Device (arm64)** seçeneğini (veya bir cihaza bağlı değilse bunu) seçin.
2. Üst menü barından **Product > Archive** seçeneğine tıklayın.
3. Xcode uygulamanızı derleyecektir (Bu işlem bilgisayarınızın hızına göre birkaç dakika sürebilir).
4. İşlem bittiğinde *Archives Organizer* penceresi açılacaktır.
5. Sağ taraftaki **Distribute App** butonuna tıklayın.
6. **App Store Connect**'i seçerek adımları takip edin. Bu işlem, uygulamanızı test kullanıcılarına dağıtmak (TestFlight) ve Apple'ın onayına sunmak üzere sunuculara yükleyecektir.
7. Yükleme tamamlandıktan sonra [App Store Connect](https://appstoreconnect.apple.com/) adresine giderek uygulamanızın mağaza içi metinlerini, ekran görüntülerini ve diğer bilgilerini doldurup Apple'a inceleme için gönderebilirsiniz (Submit for Review).

### Özetle Dikkat Edilmesi Gerekenler
* `ios/` klasörü içindeki dosyaları (Xcode zorunlu kılmadıkça) VS Code veya bu platform üzerinden *manuel olarak elinizle değiştirmeyin.* Bu dosyalar Xcode ve Capacitor tarafından yönetilir.
* Ön yüz değişikliği yaparsanız kural şudur: **Kodla -> `npm run build` -> `npx cap sync ios` -> Xcode üzerinden Play'e bas.**
* Apple, "basit web sitelerinin paketlenmiş hali" olan uygulamaları reddedebilir. Ancak bu uygulama tamamen cihazın özelliklerini kullanan, internete ihtiyaç duymadan da çalışabilen akıcı bir SPA (Single Page Application) olduğu için mağaza onayı alma ihtimali yüksektir.
