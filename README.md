# 📝 ToDo App – Full Stack Application

ToDo App to stylowa aplikacja webowa, która umożliwia użytkownikom tworzenie, edytowanie i zarządzanie zadaniami. Zbudowana z użyciem **Node.js**, **Express**, **MongoDB** oraz **React**. Obsługuje logowanie i rejestrację z JWT.

---

## 🔧 Technologie

**Backend:**
- 🟩 Node.js + Express
- 🍃 MongoDB + Mongoose
- 🔐 JWT (autoryzacja)
- ⚙️ dotenv

**Frontend:**
- ⚛️ React
- 🚦 React Router
- 📡 Axios
- 🔒 bcryptjs

---

## 📁 Struktura projektu

```
.
├── backend/
│   ├── app.js
│   ├── seedTemplates.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        └── App.js
```

---

## 🚀 Instalacja i uruchomienie

### 🛠 Główny folder

```bash
npm install concurrently --save-dev
(dodać do scripts:
    "start": "npm run dev",
    "dev": "concurrently \"npm --prefix backend start\" \"npm --prefix frontend start\"",
    "backend": "npm --prefix backend start",
    "frontend": "npm --prefix frontend start")
npm start (cały projekt)
npm run backend (tylko backend)
npm run frontend (tylko frontend)
```
---

### 🛠 Backend

```bash
cd backend
npm install
node seedTemplates.js
npm start
```

Domyślnie serwer uruchomi się pod adresem: `http://localhost:5000`

---

### 🎨 Frontend

```bash
cd frontend
npm install
npm install react-calendar
npm start
```

Frontend będzie dostępny pod adresem: `http://localhost:3000`

> ⚠️ Upewnij się, że backend działa równocześnie na porcie 5000.

---

## 🔐 API – dostępne endpointy

| Metoda | Endpoint               | Opis                        | Wymaga JWT |
|--------|------------------------|-----------------------------|------------|
| POST   | `/api/auth/register`   | Rejestracja użytkownika     | ❌         |
| POST   | `/api/auth/login`      | Logowanie i JWT             | ❌         |
| GET    | `/api/tasks`           | Pobranie zadań              | ✅         |
| POST   | `/api/tasks`           | Dodanie nowego zadania      | ✅         |
| PUT    | `/api/tasks/:id`       | Edycja istniejącego zadania | ✅         |
| DELETE | `/api/tasks/:id`       | Usunięcie zadania           | ✅         |

---

## 👤 Przebieg użytkowania

1. 🔐 Zarejestruj się
2. 🔓 Zaloguj się (otrzymasz token JWT)
3. 🗒️ Zarządzaj swoimi zadaniami:
   - dodawaj ✍️
   - edytuj ✏️
   - usuwaj ❌

---

## 🌱 Możliwe rozszerzenia

- ✅ Walidacja danych (np. Joi)
- 🕒 Termin wykonania zadania / przypomnienia
- 🗃️ Obsługa wielu list zadań
- ☁️ Hosting (np. Vercel + Render)
- 🔔 Powiadomienia

---



## 📄 Licencja

Projekt do celów edukacyjnych – feel free to fork!

---
