## GoIT Node.js Kapusta-project-back

## User /api/users

## POST Реєстрація

Потрібно передати, приклад: { "email":"andreyservis2332@ukr.net",
"password":"123456" }

- `https://kapusta-project-back-production.up.railway.app/api/users/register`

Відповідь: {message: "User registration was successful, a verification email
and@and.com was sent to you"}

## POST Вхід в систему якщо вже зареєстрований

Якщо користувач зареєстрований, але ще не пройшов верифікацію, йому буде
відправлене посилання для верифікації, потрібно перейти в пошту та пройти
верифікацію.

---

# Посилання перекидає в кабінет додатку, якщо верифікація пройшла успішно.

# ??????????? як відловити відповідь щоб записати токен????

---

Також потрібно записати токен в localStorage

- `https://kapusta-project-back-production.up.railway.app/api/users/login`

Відповідь, коли верифікацію пройдено : { "\_id": "63f22620ab2035b9989fbbc4",
"password": "$2a$10$iwFZRZGOng2Z1MFu7FAYBOfuVj9/Oexuge2ZlEiaixZPp7OqwtFiu",
"email": "andreyservis@ukr.net", "token":
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjIyNjIwYWIyMDM1Yjk5ODlmYmJjNCIsImlhdCI6MTY3NjkxMjIwMCwiZXhwIjoxNjc5NTA0MjAwfQ.mXZzioPmzhmJ8JOE4uv3QgeoVydbk-mhFeDo5nET8YI",
"balance": 200000, "verify": true, "verificationToken": null, "createdAt":
"2023-02-19T13:37:36.506Z", "updatedAt": "2023-02-20T16:56:40.701Z" }

## PATCH Вихід з системи

Карточці User записуються нові дані <token: null> Також потрібно видалити токен
в localStorage

- `https://kapusta-project-back-production.up.railway.app/api/users/logout`

## PATCH Зміна балансу

Потрібно передати: { "balance":200000 }

- `https://kapusta-project-back-production.up.railway.app/api/users/balance`

  Відповідь успішної транзакції: { "message": "The exit was successful" }

  ## GET Отримання інформації по user

  id дістається з localStorage

  - `https://kapusta-project-back-production.up.railway.app/api/users/me`

  Відповідь, вся інформація яка стосується по User

## GET Верифікація користувача

При реєстрації створюється користувач з: -- <verify: false> --
<verificationToken: "Fda8EyukRCVXpU2ofhEFj"> На пошту відправляється посилання,
щоб пройти верифікацію. Після верифікації в карточку User записуються нові дані:
-- <verify: true> -- <verificationToken: null>

Приклад як можна обіграти через axios передачу токена в
<config.headers.Authorization>

- const instance = axios.create({ baseURL:
  'https://kapusta-project-back-production.up.railway.app', });

міделвер для додавання токена якщо користувач ввійшов в систему

- instance.interceptors.request.use((config) => { config.headers.Authorization =
  window.localStorage.getItem("token"); return config; });

- `https://kapusta-project-back-production.up.railway.app/api/users/balance/verify/:verificationToken`
  #############

## Transaction /api/transaction ----------------

## POST Проведення транзакції по користувачу

Потрібно передати: "{ "operation":"expenses", "description":"Купівля поні 2",
"date": "17.02.2023", "month": "February", "year":"2023", "category":"Other",
"sum":"5000", "currency":"UAH" }"

- `https://kapusta-project-back-production.up.railway.app/api/transaction/`

Відповідь: { "data": { "operation": "expenses", "description": "Купівля поні 2",
"category": "Other", "sum": "5000", "date": "17.02.2023", "month": "February",
"year": "2023", "currency": "UAH", "userId": "63f22620ab2035b9989fbbc4", "\_id":
"63f39fea144b37647b5f0751", "createdAt": "2023-02-20T16:29:30.949Z",
"updatedAt": "2023-02-20T16:29:30.949Z" } }

## POST Отримати інформації по транзакціях за поточний рік по кожному місяцю

потрібно передати вид транзакціям {operation: "income"} або {operation:
"expenses"}

- `https://kapusta-project-back-production.up.railway.app/api/transaction/summary`

Відповідь:

- { "transaction": [ { "month": "February", "sum": 510000 }, { "month":
  "January", "sum": 600000 } ] }

## GET Отримати інформацію по транзакціях за період

потрібно передати період, приклад: <{ month: "February", year:"2023" }>

- `https://kapusta-project-back-production.up.railway.app/api/transaction/information-period`

Відповідь: Повертає масив всіх транзакції

## DELETE Видалення транзакції

Потрібно передати id транзакції

- `https://kapusta-project-back-production.up.railway.app/api/transaction/delete/${< id-транзакції>}`

Відповідь успішної операції: { "message": "Your transaction was deleted!" }

### Команди:

- `npm start` &mdash; старт сервера в режимі production
- `npm run start:dev` &mdash; старт сервера в режимі розробки (development)
- `npm run lint` &mdash; запустити виконання перевірки коду з eslint, необхідно
  виконувати перед кожним PR та виправляти всі помилки лінтера
- `npm lint:fix` &mdash; та ж перевірка лінтера, але з автоматичними
  виправленнями простих помилок

- запит повертає масив обьектів транзакціям <operation: "income",> та
  <operation: "expenses"> для отримання актуальної інфомації обовязково потрібно
  передавати токен usera
