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

Після верифікацію з пошти відбувається redirect на сторінку
`https://eimanager.netlify.app/` в параметрах буде переданий accessToken й
refreshToken Його краще обробити й записати в localStorage Інформація ще є в
"GET Верифікація користувача "

Вхід в систему через email та password (login)

- `https://kapusta-project-back-production.up.railway.app/api/users/login`

Відповідь, коли верифікацію пройдено : { "\_id": "63f22620ab2035b9989fbbc4",
"password": "$2a$10$iwFZRZGOng2Z1MFu7FAYBOfuVj9/Oexuge2ZlEiaixZPp7OqwtFiu",
"email": "andreyservis@ukr.net", "token":
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjIyNjIwYWIyMDM1Yjk5ODlmYmJjNCIsImlhdCI6MTY3NjkxMjIwMCwiZXhwIjoxNjc5NTA0MjAwfQ.mXZzioPmzhmJ8JOE4uv3QgeoVydbk-mhFeDo5nET8YI",
"balance": 200000, "verify": true, "verificationToken": null, "createdAt":
"2023-02-19T13:37:36.506Z", "updatedAt": "2023-02-20T16:56:40.701Z" }

## PATCH Вихід з системи

Карточці User записуються нові дані <accessToken: null> та <refreshToken: null>
Також потрібно видалити токен в localStorage

- `https://kapusta-project-back-production.up.railway.app/api/users/logout`

## PATCH Зміна балансу

Потрібно передати: { "balance":200000 }

- `https://kapusta-project-back-production.up.railway.app/api/users/balance`

  Відповідь успішної транзакції: { "balance":200000, "firstBalance: true" }

  ## GET Отримання інформації по user

  Потрібно зробити запит, відповідь прийде якщо токен записаний в
  config.headers.Authorization

  - `https://kapusta-project-back-production.up.railway.app/api/users/get-user`

  Відповідь: { "accessToken": ".......","refreshToken":"....", "\_id":
  "63f647e7ecd31043a14be05a", "email": "andrey301288@gmail.com", "userName":
  "andrey301", "avatarUrl": "", "balance": 100000, "verificationToken": null,
  "verify": true }

## GET Верифікація користувача (відбувається через пошту)

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

- `https://kapusta-project-back-production.up.railway.app/api/users/verify/:verificationToken`

коли проходите верифікацію, створюється пара токенів й передається в параметрах
як refreshToken та accessToken

## POST Завантаження фото

Потрібно передати image
`https://kapusta-project-back-production.up.railway.app/upload`

- Відповідь: { "url": "/uploads/IMG_6976.png" }

## PATCH Оновлення даних по користувачу

Можна оновити: {userName:...., avatarUrl:......}

- `https://kapusta-project-back-production.up.railway.app/api/users/update-user`

Відповідь: Карточка User

## POST Забув пароль

Потрібно передати: {email: .......}

- `https://kapusta-project-back-production.up.railway.app/api/users/refresh-password`

Відповідь:

1. 201 { "message": "Password recovery email was successful !" }

- Буде відправлено новий згенерований пароль на пошту

2. 409 { "message": "User with this email 'andrey301288@gmail.co' is not in the
   database. Please register" }
3. 401 { "message": "Please confirm the mail and@gmail.com by verifying" }

## POST Відслідковування першого візиту

Користувач на початку першого входу: {firstVisit: false}

- `https://kapusta-project-back-production.up.railway.app/api/users/api/first-visit`

Відправляєте запит на бек Змінює статус користувача на {firstVisit: true}, але
відповідь йде зі старим статусом. Якщо користувач вже {firstVisit: true} то
нічого не змінюється й повертається статус що користувач вже не перший раз
заходить.

## Transaction /api/transaction ----------------

## POST Отримати транзакції

Потрібно передати вид транзакціям {operation: "income"} або {operation:
"expenses"}

- `https://kapusta-project-back-production.up.railway.app/api/transaction/operation`

Відповідь: [{},{},{}]

## POST Проведення транзакції по користувачу

Потрібно передати: "{ "operation":"expenses", "description":"Купівля поні 2",
"date": "17.02.2023", "month": "February", "year":"2023", "category":"Other",
"sum":"5000", "currency":"UAH" }"

- `https://kapusta-project-back-production.up.railway.app/api/transaction/new`

Відповідь: { "data": { "operation": "expenses", "description": "Купівля поні 2",
"category": "Other", "sum": 32000, "date": "01.03.2023", "month": "March",
"year": "2023", "currency": "UAH", "userId": "63f8ec1fe303b362792abbe5", "\_id":
"63f915ddd03434efdbb4953c", "createdAt": "2023-02-24T19:54:05.719Z",
"updatedAt": "2023-02-24T19:54:05.719Z" }, "user": { "balance": -32000 } }

## DELETE Видалення транзакції

Потрібно передати id транзакції

- `https://kapusta-project-back-production.up.railway.app/api/transaction/delete/${< id-транзакції>}`

Автоматично змінюється баланс в користувача й записується в карточку

Відповідь успішної операції: { "id": "63f78fd91fcc9d9cf934d633", "user": {
"balance": 100000 } }

## POST Отримати інформації по транзакціях за поточний рік по кожному місяцю

потрібно передати вид транзакціям {operation: "income"} або {operation:
"expenses"}

- `https://kapusta-project-back-production.up.railway.app/api/transaction/summary`

Відповідь:

- [ { "month": "March", "sum": 163000, "monthNumber": 0.2 } ]

## POST -----------------

Потрібно передати: { month, year, operation }

- `https://kapusta-project-back-production.up.railway.app/api/transaction/all-summary-reports`

Відповідь: [ { "operation": "expenses", "sum": 96000 }, { "operation": "income",
"sum": 96000 } ]

## POST -----------------

Потрібно передати: { month, year, operation }

- `https://kapusta-project-back-production.up.railway.app/api/transaction/category-reports`

Відповідь: [ { "category": "Other", "sum": 96000 } ]

## POST -----------------

Потрібно передати: { month, year, operation, category }

- `https://kapusta-project-back-production.up.railway.app/api/transaction/items-category-reports`

Відповідь: [ { "category": "Other", "sum": 96000 } ]
