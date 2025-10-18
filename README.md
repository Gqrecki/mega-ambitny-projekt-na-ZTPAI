# 🍸 DrinkAdvisor  

> Aplikacja do oceniania i komentowania trunków — społeczność smakoszy w Twojej kieszeni.  
> Stworzona w **React**, **Node.js** i **MongoDB**.  

---

## 🧾 Opis projektu  

**DrinkAdvisor** to aplikacja dla miłośników napojów alkoholowych i bezalkoholowych.  
Użytkownicy mogą odkrywać nowe trunki, dodawać własne oceny i komentarze, a także śledzić ulubione pozycje.  
Aplikacja kładzie nacisk na **społeczność**, **autentyczność opinii** i **łatwość obsługi**.  

---

## 🚀 Funkcjonalności  

### 👥 Użytkownicy  
- Rejestracja i logowanie (z JWT)  
- Profile użytkowników z listą opinii i ulubionych  
- Role: **użytkownik** i **administrator**  

### 🍷 Trunki  
- Przeglądanie bazy trunków  
- Sortowanie (trendujące, najlepsze, najtańsze, najdroższe)  
- Wyszukiwanie po nazwie lub typie  
- Dodawanie do **ulubionych**  

### 💬 Opinie  
- Dodawanie ocen i komentarzy (jedna opinia na użytkownika)  
- Edycja lub usunięcie własnej opinii  

### 🛠️ Panel administratora  
- Dodawanie, edycja i usuwanie trunków  
- Zarządzanie użytkownikami  

### 🔐 Bezpieczeństwo  
- Hasła szyfrowane przy użyciu **bcrypt**  
- Autoryzacja i sesje oparte o **JWT**  
- Walidacja danych wejściowych po stronie backendu  

---

## 🧩 Technologie  

| Warstwa | Technologie |
|----------|-------------|
| **Frontend** | React.js |
| **Backend** | Node.js, Express.js |
| **Baza danych** | MongoDB |

---

## ⚙️ Uruchomienie projektu  

### 1️⃣ Klonowanie repozytorium  
```bash
git clone https://github.com/twoje-repo/drink-advisor.git
cd drink-advisor
