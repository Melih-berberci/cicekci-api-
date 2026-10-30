# Çiçekçi Katalog Sistemi

Florist ürünlerinin yönetildiği modern bir React + MongoDB Atlas + Cloudinary tabanlı katalog uygulaması.

## Özellikler

- ✅ Ürün yönetimi (ekleme, düzenleme, silme)
- ✅ Kategori yönetimi
- ✅ Resim yükleme (Cloudinary)
- ✅ Admin paneli
- ✅ JWT Authentication
- ✅ Public katalog görüntüleme
- ✅ Responsive tasarım
- ✅ Loading ve error states
- ✅ Form validasyonları

## Teknolojiler

- **Frontend**: React 19.2.8
- **Routing**: React Router DOM 6.20.2
- **Backend**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (jsonwebtoken)
- **Storage**: Cloudinary
- **ORM**: Mongoose

## Kurulum

### 1. Depoyu Klonlayın

```bash
git clone https://github.com/Melih-berberci/cicekci-api-.git
cd cicekci-api-
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. MongoDB Atlas Kurulumu

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)'ta ücretsiz bir hesap oluşturun
2. New Cluster oluşturun (M0 Free tier)
3. Database Access'te yeni bir kullanıcı oluşturun
4. Network Access'te IP adresinizi ekleyin (veya 0.0.0.0/0 - tüm IP'ler)
5. "Connect" > "Connect your application" seçin
6. Connection string'i kopyalayın (mongodb+srv://...)

### 4. Cloudinary Kurulumu

1. [Cloudinary](https://cloudinary.com)'da ücretsiz bir hesap oluşturun
2. Dashboard'dan Cloud Name, API Key ve API Secret'i alın

### 5. Environment Değişkenlerini Ayarlayın

`.env.local` dosyası oluşturun ve bilgilerinizi ekleyin:

```env
REACT_APP_API_URL=http://localhost:5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/florist-catalog?retryWrites=true&w=majority
JWT_SECRET=güçlü-bir-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 6. Uygulamayı Başlatın

Development modunda (hem backend hem frontend):

```bash
npm run dev
```

Sadece backend:
```bash
npm run server
```

Sadece frontend:
```bash
npm start
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) açılacak.

## İlk Kullanım

### 1. Admin Hesabı Oluşturun

İlk admin hesabını oluşturmak için Postman veya benzeri bir tool kullanın:

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your-password"
}
```

### 2. Giriş Yapın

1. [http://localhost:3000/admin/login](http://localhost:3000/admin/login) adresine gidin
2. Email ve şifrenizle giriş yapın

### 3. Kategoriler Ekleyin

1. Admin panelinde **"Kategoriler"** sekmesine gidin
2. Yeni kategoriler ekleyin (örn: "Aile buketleri", "Doğum günü")

### 4. Ürün Ekleyin

1. **"Ürünler"** sekmesine gidin
2. **"Yeni Ürün"** butonuna tıklayın
3. Ürün bilgilerini doldurun
4. Resim yükleyin (Cloudinary'e otomatik yüklenir)
5. Kategorileri seçin
6. Kaydedin

## Kullanım

### Public Katalog
- Ana sayfada yayınlanmış ürünleri görüntüleyebilirsiniz
- Ürün detaylarını (resim, fiyat, açıklama) görebilirsiniz

### Admin Paneli
1. `/admin/login` sayfasına gidin
2. Email ve şifre ile giriş yapın
3. **Ürünler** sekmesinde:
   - Yeni ürün ekleyin
   - Mevcut ürünleri düzenleyin
   - Ürünleri silin
   - Kategori atayın
   - Resim yükleyin
4. **Kategoriler** sekmesinde:
   - Yeni kategori ekleyin
   - Kategorileri düzenleyin
   - Kategorileri silin

## API Endpoint'leri

### Authentication
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Giriş
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi

### Products
- `GET /api/products` - Tüm yayınlanmış ürünler (public)
- `GET /api/products/admin` - Tüm ürünler (admin)
- `GET /api/products/:id` - Tek ürün
- `POST /api/products` - Ürün ekle (admin)
- `PUT /api/products/:id` - Ürün güncelle (admin)
- `DELETE /api/products/:id` - Ürün sil (admin)

### Categories
- `GET /api/categories` - Tüm kategoriler
- `GET /api/categories/:id` - Tek kategori
- `POST /api/categories` - Kategori ekle (admin)
- `PUT /api/categories/:id` - Kategori güncelle (admin)
- `DELETE /api/categories/:id` - Kategori sil (admin)

### Upload
- `POST /api/upload` - Resim yükle (admin)
- `DELETE /api/upload/:publicId` - Resim sil (admin)

## Proje Yapısı

```
florist-catalog/
├── models/              # Mongoose modelleri
│   ├── User.js
│   ├── Product.js
│   └── Category.js
├── routes/              # Express route'ları
│   ├── auth.js
│   ├── products.js
│   ├── categories.js
│   └── upload.js
├── middleware/          # Express middleware
│   └── auth.js
├── src/
│   ├── components/      # React bileşenleri
│   │   └── ProductForm.js
│   ├── pages/           # Sayfa bileşenleri
│   │   ├── AdminDashboard.js
│   │   ├── AdminCategories.js
│   │   ├── AdminLogin.js
│   │   └── PublicCatalog.js
│   ├── api.js          # API client
│   └── App.js
├── server.js           # Express server
└── package.json
```

## MongoDB Schema

### User
- email (unique)
- password (hashed)
- role (admin/user)

### Product
- name
- price
- description
- published (boolean)
- image (Cloudinary URL)
- categories (array of Category IDs)

### Category
- name (unique)
- slug (auto-generated)

## Deployment

### Backend (Render / Railway / Heroku)

1. `.env.local` dosyasındaki değişkenleri platforma ekleyin
2. MongoDB Atlas IP whitelist'a platformun IP adresini ekleyin
3. Build command: `npm install`
4. Start command: `node server.js`

### Frontend (Vercel / Netlify)

1. Build command: `npm run build`
2. Output directory: `build`
3. Environment variables ekleyin:
   - `REACT_APP_API_URL` (Backend URL)

## Lisans

MIT

## Destek

Sorularınız için GitHub Issues kullanabilirsiniz.
