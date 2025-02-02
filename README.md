# Regis Absensi

Regis Absensi adalah sistem registrasi dan absensi digital untuk seminar atau acara lainnya. Sistem ini menggunakan QR code untuk memudahkan proses absensi.

QR Code sudah terenkripsi dengan secret key yang hanya diketahui oleh sistem. Peserta yang ingin melakukan absensi harus memindai QR code yang ditampilkan oleh sistem.

## Fitur

- **Absensi dengan QR Code**: Peserta dapat melakukan absensi dengan memindai QR code.
- **Board Realtime Kehadiran**: Menampilkan jumlah peserta yang hadir secara realtime.
- **Export Data**: Data absensi dapat diekspor ke dalam format CSV.

## Teknologi
- Express.js
- Prisma
- MariaDB
- EJS (extended ejs-mate)
- qrcode
- socket.io
- canvas
- moment
- csv-parser
- xlsx

## Instalasi

1. Clone repositori ini
    ```sh
    git clone https://github.com/KatowProject/kehadiran-digital
    cd kehadiran-digital
    ```

2. Install dependencies
    ```sh
    npm install
    ```

3. Buat file [.env](http://_vscodecontentref_/19) dan tambahkan variabel lingkungan yang diperlukan
    ```env
    PORT=3000
    DATABASE_URL=mysql://user:password@localhost:3306/database
    QR_SECRET=your_secret_key
    ```

4. Jalankan migrasi Prisma
    ```sh
    npx prisma migrate db push
    ```

5. Seed database
    ```sh
    npm run seed
    ```

### Fake Data
Untuk menghasilkan data acak, jalankan perintah berikut:
```sh
npm run faker
```

## Menjalankan Project

Mode Development:
```sh
npm run dev
```

Mode Production:
```sh
npm run start
```

## Scripts
Ada beberapa script yang dapat dijalankan untuk utility
### Generate QR Code Peserta
```sh
npm run generate:qruser
```
### Generate Sertifikat Peserta
```sh
npm run generate:certificate
```
### Import Data Peserta [CSV/Excel]
```sh
npm run import:users
```

## Lisensi
Cek [LICENSE](LICENSE) untuk informasi lebih lanjut.
