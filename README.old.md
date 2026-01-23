# 🍸 DrinkAdvisor

> **Społeczność smakoszy w Twojej kieszeni.**
> Aplikacja webowa typu Fullstack (MERN) do oceniania, recenzowania i odkrywania trunków.

![Project Status](https://img.shields.io/badge/Status-Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🧾 Opis Projektu

**DrinkAdvisor** to platforma społecznościowa umożliwiająca użytkownikom przeglądanie bazy napojów alkoholowych i bezalkoholowych, dodawanie własnych opinii oraz tworzenie list ulubionych trunków.

Projekt został zrealizowany zgodnie z nowoczesnymi standardami inżynierii oprogramowania, kładąc nacisk na:
- **Architekturę warstwową** (Separation of Concerns: Controllers vs Services).
- **Skalowalność** (Docker, konteneryzacja).
- **Asynchroniczność** (Kolejkowanie zadań w tle z RabbitMQ).
- **Design System** (Spójny interfejs użytkownika zgodny z projektem Figma).

---

## 🚀 Funkcjonalności

Zgodnie z projektem UI i wymaganiami systemowymi:

### 👤 Strefa Użytkownika
- **Uwierzytelnianie:** Logowanie i rejestracja oparte o **JWT** (JSON Web Token) z bezpiecznym haszowaniem haseł (**bcrypt**).
- **Profil:** Podgląd wystawionych ocen, edycja danych, lista ulubionych trunków.
- **Interakcje:** Dodawanie ocen (skala 1-5) i komentarzy do trunków.

### 🍷 Baza Trunków
- **Przeglądanie:** Listy sortowane wg trendów, ocen lub ceny.
- **Wyszukiwanie:** Filtrowanie po nazwie i typie trunku.
- **Szczegóły:** Informacje o woltażu, cenie, opisie oraz średnia ocen społeczności.

### 🛠️ Panel Administratora
- Zarządzanie bazą trunków (CRUD: dodawanie, edycja, usuwanie).
- Moderacja użytkowników i opinii.

### ⚙️ Backend & API
- **Dokumentacja API:** Automatycznie generowana w **Swagger/OpenAPI**.
- **Zadania w tle:** Przetwarzanie asynchroniczne przy użyciu **RabbitMQ** (np. generowanie raportów/powiadomienia).
- **Walidacja:** Pełna weryfikacja danych wejściowych.

---

## 🧩 Stack Technologiczny

Aplikacja wykorzystuje nowoczesny stos technologiczny (MERN + Microservices support):

| Obszar | Technologie | Uzasadnienie |
|--------|-------------|--------------|
| **Frontend** | React, Vite, Axios | Szybki rendering, komponentowe podejście, responsywność. |
| **Backend** | Node.js, Express.js | Wydajne środowisko asynchroniczne, architektura REST. |
| **Baza Danych** | MongoDB (Mongoose) | Elastyczność schematów, łatwe skalowanie (NoSQL). |
| **Kolejkowanie** | RabbitMQ | Obsługa zadań asynchronicznych (wymóg projektowy). |
| **Konteneryzacja**| Docker, Docker Compose | Łatwe uruchomienie całego środowiska jedną komendą. |
| **Dokumentacja** | Swagger UI | Interaktywna dokumentacja endpointów API. |

---

## 🗂️ Struktura Bazy Danych (ERD)

Baza danych odwzorowuje relacje przedstawione na diagramie ERD:

1.  **Users:** Przechowuje dane logowania (login, hasło, rola).
2.  **Users_Info:** Rozszerzone informacje o użytkowniku.
3.  **Drinks:** Główna tabela produktów (nazwa, woltaż, cena, opis).
4.  **Grades:** Oceny i komentarze (powiązane z Użytkownikiem i Trunkiem).
5.  **Favorite_Drinks:** Tabela łącząca (relacja wiele-do-wielu) dla ulubionych.

---

## 💿 Instrukcja Uruchomienia

Projekt jest w pełni skonteneryzowany. Wymagany jest zainstalowany **Docker** oraz **Docker Compose**.

### Szybki Start (Zalecane)

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/Gqrecki/mega-ambitny-projekt-na-ZTPAI
   cd DrinkAdvisor
   ```

2. Utwórz plik `.env` w folderze `backend` (wzorując się na `.env.example`).

3. Uruchom całe środowisko (Frontend, Backend, Baza, RabbitMQ):
   ```bash
   docker compose up -d --build
   ```

4. Aplikacja dostępna pod adresami:
   - **Frontend:** http://localhost:5173
   - **API:** http://localhost:8080
   - **Swagger Docs:** http://localhost:8080/api-docs

### Uruchomienie Ręczne (Dla deweloperów)

**Backend:**
```bash
cd backend
npm install
npm run seed  # Wypełnienie bazy danymi testowymi (min. 30 rekordów)
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---


Projekt wykonany w ramach zaliczenia przedmiotu.
