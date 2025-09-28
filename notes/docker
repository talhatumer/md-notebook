# 🐳 Docker Temel Bilgiler - Hızlı Rehber

Bu dosya, Docker’a yeni başlayanlar için **temel kavramları** ve **en çok kullanılan komutları** sade bir dille açıklar.  
Amaç: Docker'ı hızlıca anlamak ve kullanmaya başlayabilmendir.

---

## 📌 1. Docker Nedir?

**Docker**, yazılımları çalıştırmak için kullanılan izole edilmiş küçük ortamlara (**container**) uygulamaları koymamızı sağlar.

- Normalde bir uygulamayı kurmak için sistem ayarlarını, bağımlılıkları tek tek yapman gerekir.  
- Docker sayesinde bu ayarları bir **container** içine koyar ve başka makinelerde de sorunsuz çalıştırırsın.

**Kısa tanım:**  
> 🧰 “Docker, uygulamaları ve onların çalışması için gereken her şeyi tek bir paket haline getirir.”

---

## 📦 2. Temel Kavramlar

| Kavram       | Açıklama                                                                 |
|-------------|--------------------------------------------------------------------------|
| **Image**   | Container'ın şablonu. Çalıştırmak istediğin yazılım ve ayarların bulunduğu dosya. |
| **Container** | Bir image'ten oluşturulan çalışan ortam. Uygulama burada çalışır.        |
| **Dockerfile** | Image oluşturmak için yazılan tarif dosyası.                           |
| **Volume**  | Verilerin container dışında saklandığı kalıcı depolama alanı.            |
| **Port**    | Container’ın dış dünyayla iletişim kurması için açılan ağ kapıları.       |
| **Docker Hub** | Resmî image’lerin bulunduğu merkezi depo.                              |

---

## 🧭 3. Kurulum Kontrolü

Docker’ın kurulu olup olmadığını kontrol et:

```bash
docker --version
```

Docker servisini başlatmak için:

```bash
sudo service docker start
# veya bazı sistemlerde:
sudo systemctl start docker
```

---

## 🏃 4. Temel Komutlar

### 🔹 Image İndirme

```bash
docker pull ubuntu
```

> 📥 Bu komut, `ubuntu` isimli resmi imajı indirir.

---

### 🔹 Container Çalıştırma

```bash
docker run ubuntu
```

> 🌀 `ubuntu` imajından yeni bir container başlatır.  

Arka planda (detached) çalıştırmak için:

```bash
docker run -d ubuntu
```

Port yönlendirmesiyle (örnek: 8080 → 80):

```bash
docker run -d -p 8080:80 nginx
```

---

### 🔹 Çalışan Container'ları Listeleme

```bash
docker ps
```

Tüm container’ları (duranlar dahil) görmek için:

```bash
docker ps -a
```

---

### 🔹 Container Durdurma / Silme

```bash
docker stop <container_id>
docker rm <container_id>
```

> 💡 `<container_id>` ilk birkaç karakteri yazman yeterli.

---

### 🔹 Image Listeleme ve Silme

```bash
docker images      # İmajları listele
docker rmi <image_id>   # İmaj sil
```

---

## 📝 5. Dockerfile Temelleri

`Dockerfile`, kendi özel imajını oluşturmak için yazdığın bir tarif dosyasıdır.

Örnek `Dockerfile`:

```dockerfile
# Temel imaj
FROM node:18

# Uygulama klasörünü oluştur
WORKDIR /app

# Dosyaları kopyala
COPY . .

# Bağımlılıkları yükle
RUN npm install

# Uygulamayı başlat
CMD ["npm", "start"]

# Port aç
EXPOSE 3000
```

Bu Dockerfile'dan image oluşturmak için:

```bash
docker build -t benim-uygulamam .
```

> 🧪 `-t` → image’e isim verir  
> `.` → Dockerfile’ın bulunduğu klasörü gösterir

---

## 🧰 6. Volume (Veri Saklama)

Container silindiğinde içindeki veriler de silinir.  
Verileri korumak için **volume** kullanılır:

```bash
docker run -v /host/path:/container/path ubuntu
```

Örnek:

```bash
docker run -d -v $(pwd)/veri:/data ubuntu
```

> 💾 Böylece container içindeki `/data` klasörü, senin bilgisayarındaki `veri` klasörüne bağlanır.

---

## 🌐 7. Port Yönlendirme

Container içinde çalışan bir servisi dışarı açmak için:

```bash
docker run -p 8080:80 nginx
```

> Burada:  
> - 8080 = senin bilgisayarındaki port  
> - 80 = container içindeki port

Artık `http://localhost:8080` adresinden nginx’e ulaşabilirsin.

---

## 🧼 8. Temizlik Komutları

Gereksiz container ve imajları silmek için:

```bash
docker system prune
```

Daha kapsamlı temizlik (dikkatli ol!):

```bash
docker system prune -a
```

---

## 🐙 9. Docker Compose (Kısa Tanıtım)

Birden fazla container’ı birlikte çalıştırmak için kullanılır.  
Bir `docker-compose.yml` dosyası hazırlanır:

```yaml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "8080:80"
  db:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
```

Başlatmak için:

```bash
docker compose up
```

---

## 🚀 10. Faydalı Komut Özeti

| Komut                              | Açıklama |
|------------------------------------|---------|
| `docker pull <image>`             | Image indirir |
| `docker run <image>`              | Container çalıştırır |
| `docker ps`                        | Çalışan container'ları gösterir |
| `docker stop <id>`                 | Container durdurur |
| `docker rm <id>`                   | Container siler |
| `docker images`                    | Image'leri listeler |
| `docker rmi <id>`                  | Image siler |
| `docker build -t <isim> .`         | Dockerfile’dan image oluşturur |
| `docker logs <id>`                 | Logları görüntüler |
| `docker exec -it <id> bash`        | Container içine terminal açar |

---

## 📚 11. İleri Konular (Kısa Notlar)

- **Network**: Container'lar arası haberleşme için özel ağlar oluşturabilirsin.  
- **Env Variables**: `-e` parametresiyle ortam değişkenleri verebilirsin.  
- **Multi-stage build**: İmaj boyutunu küçültmek için kullanılır.  
- **Healthcheck**: Container’ın sağlığını izlemek için kullanılır.

---

## 📝 Ek: Kaynaklar

- [Docker Resmî Sitesi](https://www.docker.com/)  
- [Docker Docs](https://docs.docker.com/)  
- [Docker Hub](https://hub.docker.com/)

---

## ✅ Özet

- 🧱 **Image** = Şablon  
- 📦 **Container** = Çalışan örnek  
- ✍️ **Dockerfile** = Image tarifi  
- 🔌 **Port** = Dış dünyaya erişim  
- 💾 **Volume** = Kalıcı veri  
- 🧼 **Prune** = Temizlik  

Docker, yazılım geliştirmeyi **taşınabilir**, **hızlı** ve **standart** hale getirir. 🚀

---
