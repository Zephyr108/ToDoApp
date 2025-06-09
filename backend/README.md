# Backend ToDo App

## Instalacja
1. Zainstaluj zależności:
   ```
   npm install
   node seedTemplates.js
   ```
2. Uruchom serwer:
   ```
   npm start
   ```

## API
- POST `/api/auth/register` – rejestracja użytkownika
- POST `/api/auth/login` – logowanie (zwraca JWT)
- GET `/api/tasks` – pobranie zadań (wymaga JWT)
- POST `/api/tasks` – dodanie zadania (wymaga JWT)
- PUT `/api/tasks/:id` – edycja zadania (wymaga JWT)
- DELETE `/api/tasks/:id` – usuwanie zadania (wymaga JWT)
