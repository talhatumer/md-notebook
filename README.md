## ⚛️ **React Projeleri Nasıl Yayınlanır?**

React, Next.js gibi değil → build ettiğinde tamamen statik dosyalar üretir.  
Yani GitHub Pages için **mükemmel uyumludur** 👌

### 🪜 Örnek: React Projesi Yayınlama

#### 1️⃣ Proje oluştur

`npx create-react-app my-app cd my-app`

---

#### 2️⃣ `package.json` içine homepage alanı ekle

`"homepage":  "https://<kullanıcı-adı>.github.io/<repo-adi>"`

📌 Bu alan, React build çıktısındaki yolları doğru ayarlaması için şarttır.

---

#### 3️⃣ GitHub Pages paketi ekle

`npm install gh-pages --save-dev`

---

#### 4️⃣ `package.json` script’lerine ekle

`"scripts":  {  "predeploy":  "npm run build",  "deploy":  "gh-pages -d build",  "start":  "react-scripts start",  "build":  "react-scripts build"  }`

---

#### 5️⃣ GitHub’da boş bir repo oluştur (`my-app` vs.)

Sonra terminalde:

`git remote add origin https://github.com/<kullanıcı-adı>/<repo-adi>.git
git branch -M main
git push -u origin main`

---

#### 6️⃣ Deploy et 🚀

`npm run deploy`

Bu komut:

- `build/` klasörünü oluşturur
- `gh-pages` adında özel bir branch’a atar
- GitHub Pages bu branch’tan siteyi yayına alır 🌐

---

#### 7️⃣ GitHub Pages ayarlarını yap

- Repo → **Settings → Pages**
- Source → `gh-pages` branch, `/ (root)` seç
- Kaydet.

👉 Artık React siten şu adreste yayında:

`https://<kullanıcı-adı>.github.io/<repo-adi>/`

✅ İşte bu kadar!
