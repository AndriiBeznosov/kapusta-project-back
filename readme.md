## GoIT Node.js Kapusta-project-back

## Реєстрація

- https://kapusta-project-back-production.up.railway.app/api/users/register

## Вхід в систему якщо вже зареєстрований

Якщо користувач зареєстрований, але ще не пройшов верифікацію, йому буде
відправлене посилання для верифікації

- https://kapusta-project-back-production.up.railway.app/api/users/login

## Вихід з системи

Карточці User записуються нові дані <token: null>

- https://kapusta-project-back-production.up.railway.app/api/users/logout

## Отримати актуальний балан

- https://kapusta-project-back-production.up.railway.app/api/users/balance

## Верифікація користувача

При реєстрації створюється користувач з: -- <verify: false> --
<verificationToken: "Fda8EyukRCVXpU2ofhEFj"> На пошту відправляється посилання,
щоб пройти верифікацію. Після верифікації в карточку User записуються нові дані:
-- <verify: true> -- <verificationToken: null>

- https://kapusta-project-back-production.up.railway.app/api/users/balance/verify/:verificationToken

### Команди:

- `npm start` &mdash; старт сервера в режимі production
- `npm run start:dev` &mdash; старт сервера в режимі розробки (development)
- `npm run lint` &mdash; запустити виконання перевірки коду з eslint, необхідно
  виконувати перед кожним PR та виправляти всі помилки лінтера
- `npm lint:fix` &mdash; та ж перевірка лінтера, але з автоматичними
  виправленнями простих помилок
