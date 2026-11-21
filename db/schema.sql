CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

CREATE TABLE IF NOT EXISTS menu (
  id          SERIAL PRIMARY KEY,
  nama        TEXT NOT NULL,
  keterangan  TEXT NOT NULL DEFAULT '',
  harga       INTEGER NOT NULL CHECK (harga >= 0),
  habis       BOOLEAN NOT NULL DEFAULT FALSE,
  gambar      TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS transaksi (
  id           SERIAL PRIMARY KEY,
  pesanan      TEXT NOT NULL,
  nama         TEXT NOT NULL,
  no_telp      TEXT NOT NULL,
  alamat       TEXT NOT NULL,
  tanggal      TIMESTAMP NOT NULL,
  catatan      TEXT NOT NULL DEFAULT '',
  total_harga  INTEGER NOT NULL,
  dibuat       TIMESTAMP NOT NULL DEFAULT NOW()
);
