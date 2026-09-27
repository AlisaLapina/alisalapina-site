# alisalapina.com

Статический сайт на Astro. Админка на Sveltia CMS: `alisalapina.com/admin`. Хостинг: GitHub Pages.

## Где что лежит

- `src/content/works/*.json`: работы, один файл на работу.
- `src/content/series/*.json`: серии, их порядок и порядок работ внутри.
- `src/content/pages/*.json`: главная, About, CV, Process, контакты.
- `public/img/`: фото. Новые фото из админки попадают в `public/img/uploads/`.
- `public/admin/config.yml`: поля админки.

## Как работает админка

Каждое сохранение в админке становится коммитом в GitHub. GitHub Actions (`.github/workflows/deploy.yml`) за 1–2 минуты пересобирает сайт и выкладывает его на Pages.

Вход: «Войти с помощью токена доступа». Токен: GitHub → Settings → Developer settings → Fine-grained tokens, доступ только к `alisalapina-site`, право Contents: Read and write.

- **Новая работа:** «Работы» → «+ Работа», затем добавить её в нужную серию («Серии» → «Работы в серии»). Без серии работа на сайт не попадёт.
- **Порядок работ:** «Серии» → перетаскивать работы за значок ═.
- **Порядок серий:** поле «Порядок на странице Works».
- **Скрыть работу, не удаляя:** снять галочку «Показывать на сайте».
- **Статус:** Available показывает синюю точку и кнопку Request price.

## Локально, без GitHub

```bash
npm install
npm run dev
```

Админка: http://localhost:4321/admin/index.html → «Работать с локальным репозиторием» → выбрать папку `site` (работает в Chrome и Edge). Правки пишутся прямо в файлы; чтобы они попали на сайт, их нужно закоммитить и отправить в GitHub.
