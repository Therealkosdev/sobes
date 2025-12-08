# Git - Полная методичка по командам и коммитам

## Оглавление
1. [Что такое Git и основные концепции](#intro)
2. [Начало работы](#setup)
3. [Базовые команды](#basic)
4. [Работа с ветками](#branches)
5. [Удаленные репозитории](#remote)
6. [Отмена изменений](#undo)
7. [История и просмотр](#history)
8. [Продвинутые команды](#advanced)
9. [Работа с конфликтами](#conflicts)
10. [Git Flow и стратегии](#flow)
11. [Conventional Commits - профессиональные коммиты](#conventional)
12. [Шпаргалка команд](#cheatsheet)

---

<a name="intro"></a>
## 1. Что такое Git и основные концепции

### Что такое Git?

**Git** - это распределенная система контроля версий. Она позволяет:
- Отслеживать изменения в коде
- Работать в команде без конфликтов
- Откатывать изменения
- Создавать разные версии проекта (ветки)
- Сохранять историю всех изменений

### Основные концепции

**Repository (Репозиторий)** - хранилище вашего проекта со всей историей изменений

**Working Directory (Рабочая директория)** - папка с файлами, которые вы редактируете

**Staging Area (Индекс)** - промежуточная область для подготовки коммита

**Commit (Коммит)** - снимок состояния проекта в определенный момент времени

**Branch (Ветка)** - независимая линия разработки

**Remote (Удаленный репозиторий)** - версия репозитория на сервере (GitHub, GitLab)

### Жизненный цикл файла

```
Untracked → Unmodified → Modified → Staged → Committed
(новый)     (без изм.)   (изменен)  (добавл.) (сохранен)
```

### Три области Git

```
Working Directory  →  Staging Area  →  Repository
  (ваши файлы)      (git add)         (git commit)
```

---

<a name="setup"></a>
## 2. Начало работы

### Установка и настройка

```bash
# Проверить версию Git
git --version

# Настроить имя пользователя (глобально)
git config --global user.name "Ваше Имя"

# Настроить email
git config --global user.email "your.email@example.com"

# Посмотреть все настройки
git config --list

# Настроить редактор по умолчанию
git config --global core.editor "code --wait"  # VS Code
git config --global core.editor "vim"          # Vim

# Настроить цветной вывод
git config --global color.ui auto
```

### Создание репозитория

```bash
# Создать новый репозиторий в текущей папке
git init

# Создать новый репозиторий в указанной папке
git init название-проекта

# Клонировать существующий репозиторий
git clone https://github.com/user/repo.git

# Клонировать в конкретную папку
git clone https://github.com/user/repo.git my-folder
```

---

<a name="basic"></a>
## 3. Базовые команды

### git status - проверка состояния

```bash
# Показать состояние рабочей директории
git status

# Краткий формат
git status -s
git status --short

# Вывод:
# ?? - untracked (новый файл)
# A  - added (добавлен в staging)
# M  - modified (изменен)
# D  - deleted (удален)
```

### git add - добавление в staging

```bash
# Добавить конкретный файл
git add file.txt

# Добавить все файлы в текущей директории
git add .

# Добавить все файлы в проекте
git add -A
git add --all

# Добавить все файлы определенного типа
git add *.js

# Добавить файлы в конкретной папке
git add src/

# Интерактивное добавление (выбор частей файла)
git add -p
git add --patch
```

### git commit - сохранение изменений

```bash
# Создать коммит с сообщением
git commit -m "Описание изменений"

# Создать коммит с заголовком и описанием
git commit -m "Заголовок" -m "Детальное описание"

# Добавить все измененные файлы и создать коммит (для tracked файлов)
git commit -am "Сообщение"

# Открыть редактор для написания коммита
git commit

# Изменить последний коммит (добавить файлы или изменить сообщение)
git commit --amend

# Изменить только сообщение последнего коммита
git commit --amend -m "Новое сообщение"

# Создать пустой коммит (без изменений)
git commit --allow-empty -m "Empty commit"
```

### git diff - просмотр изменений

```bash
# Показать изменения в рабочей директории (unstaged)
git diff

# Показать изменения в staging area
git diff --staged
git diff --cached

# Показать изменения конкретного файла
git diff file.txt

# Сравнить две ветки
git diff branch1..branch2

# Сравнить два коммита
git diff commit1 commit2

# Показать статистику изменений
git diff --stat

# Показать только имена измененных файлов
git diff --name-only
```

### git rm - удаление файлов

```bash
# Удалить файл из репозитория и рабочей директории
git rm file.txt

# Удалить файл только из репозитория (оставить в рабочей директории)
git rm --cached file.txt

# Удалить папку рекурсивно
git rm -r folder/

# Принудительное удаление (если есть изменения)
git rm -f file.txt
```

### git mv - переименование файлов

```bash
# Переименовать файл
git mv old-name.txt new-name.txt

# Переместить файл в другую папку
git mv file.txt folder/file.txt
```

---

<a name="branches"></a>
## 4. Работа с ветками

### Зачем нужны ветки?

Ветки позволяют:
- Разрабатывать новые функции изолированно
- Экспериментировать без риска
- Работать над несколькими задачами параллельно
- Организовать процесс разработки

### git branch - управление ветками

```bash
# Показать все локальные ветки (* - текущая ветка)
git branch

# Показать все ветки (локальные и удаленные)
git branch -a

# Показать только удаленные ветки
git branch -r

# Создать новую ветку
git branch feature-login

# Создать ветку из конкретного коммита
git branch branch-name commit-hash

# Переименовать текущую ветку
git branch -m new-name

# Переименовать другую ветку
git branch -m old-name new-name

# Удалить ветку (только если она слита)
git branch -d feature-login

# Принудительно удалить ветку
git branch -D feature-login

# Посмотреть последний коммит в каждой ветке
git branch -v

# Посмотреть какие ветки слиты в текущую
git branch --merged

# Посмотреть какие ветки не слиты
git branch --no-merged
```

### git checkout - переключение веток

```bash
# Переключиться на существующую ветку
git checkout main

# Создать новую ветку и сразу переключиться
git checkout -b feature-login

# Переключиться на предыдущую ветку
git checkout -

# Переключиться на конкретный коммит
git checkout commit-hash

# Восстановить файл из последнего коммита (отменить изменения)
git checkout -- file.txt

# Восстановить файл из конкретной ветки
git checkout branch-name -- file.txt
```

### git switch - новая команда для переключения (Git 2.23+)

```bash
# Переключиться на ветку
git switch main

# Создать и переключиться на новую ветку
git switch -c feature-login

# Переключиться на предыдущую ветку
git switch -

# Создать ветку из удаленной
git switch -c local-branch origin/remote-branch
```

### git merge - слияние веток

```bash
# Слить ветку в текущую
git merge feature-login

# Слить с созданием merge commit (даже если можно fast-forward)
git merge --no-ff feature-login

# Слить и сразу создать коммит (без редактора)
git merge -m "Merge message" feature-login

# Отменить слияние (если есть конфликты)
git merge --abort

# Посмотреть что будет слито (без слияния)
git merge --no-commit --no-ff feature-login
git diff --cached
git merge --abort
```

### git rebase - перебазирование

```bash
# Перебазировать текущую ветку на main
git rebase main

# Интерактивное перебазирование (последние 3 коммита)
git rebase -i HEAD~3

# Продолжить rebase после решения конфликтов
git rebase --continue

# Пропустить текущий коммит
git rebase --skip

# Отменить rebase
git rebase --abort
```

**Разница между merge и rebase:**

```
# MERGE - создает merge commit
main:     A---B---C
               \
feature:        D---E
                     \
после merge: A---B---C---M (merge commit)
                  \     /
                   D---E

# REBASE - переписывает историю
main:     A---B---C
               \
feature:        D---E

после rebase: A---B---C---D'---E'
```

---

<a name="remote"></a>
## 5. Удаленные репозитории

### git remote - управление удаленными репозиториями

```bash
# Показать все удаленные репозитории
git remote

# Показать с URL
git remote -v

# Добавить удаленный репозиторий
git remote add origin https://github.com/user/repo.git

# Изменить URL удаленного репозитория
git remote set-url origin https://github.com/user/new-repo.git

# Переименовать удаленный репозиторий
git remote rename origin upstream

# Удалить удаленный репозиторий
git remote remove origin

# Показать информацию об удаленном репозитории
git remote show origin
```

### git fetch - получение изменений

```bash
# Получить изменения со всех удаленных репозиториев
git fetch

# Получить изменения с конкретного репозитория
git fetch origin

# Получить конкретную ветку
git fetch origin main

# Получить все ветки и удалить удаленные
git fetch --prune
git fetch -p
```

### git pull - получение и слияние изменений

```bash
# Получить изменения и слить с текущей веткой
git pull

# Pull из конкретного репозитория и ветки
git pull origin main

# Pull с rebase вместо merge
git pull --rebase

# Pull только если можно сделать fast-forward
git pull --ff-only

# Настроить pull с rebase по умолчанию
git config --global pull.rebase true
```

### git push - отправка изменений

```bash
# Отправить изменения в удаленный репозиторий
git push

# Отправить в конкретный репозиторий и ветку
git push origin main

# Отправить и установить upstream для ветки
git push -u origin feature-login
git push --set-upstream origin feature-login

# Отправить все ветки
git push --all

# Отправить теги
git push --tags

# Принудительная отправка (ОПАСНО!)
git push -f
git push --force

# Безопасная принудительная отправка (не перезапишет чужие изменения)
git push --force-with-lease

# Удалить удаленную ветку
git push origin --delete feature-login
git push origin :feature-login
```

---

<a name="undo"></a>
## 6. Отмена изменений

### git restore - восстановление файлов (Git 2.23+)

```bash
# Отменить изменения в файле (unstaged)
git restore file.txt

# Убрать файл из staging (не удаляя изменения)
git restore --staged file.txt

# Восстановить файл из конкретного коммита
git restore --source=HEAD~2 file.txt

# Восстановить все файлы
git restore .
```

### git reset - сброс изменений

```bash
# Убрать файлы из staging (изменения сохранятся)
git reset file.txt
git reset HEAD file.txt

# Отменить последний коммит (изменения останутся в staging)
git reset --soft HEAD~1

# Отменить последний коммит (изменения останутся unstaged)
git reset HEAD~1
git reset --mixed HEAD~1

# Отменить последний коммит и все изменения (ОПАСНО!)
git reset --hard HEAD~1

# Вернуться к конкретному коммиту
git reset --hard commit-hash

# Отменить последние N коммитов
git reset --soft HEAD~3
```

**Разница между режимами reset:**

```
--soft:  HEAD меняется, staging и working directory не меняются
--mixed: HEAD и staging меняются, working directory не меняется (по умолчанию)
--hard:  Все меняется (опасно, можно потерять данные!)
```

### git revert - отмена коммита с созданием нового

```bash
# Отменить конкретный коммит (создает новый коммит)
git revert commit-hash

# Отменить последний коммит
git revert HEAD

# Отменить несколько коммитов
git revert HEAD~3..HEAD

# Отменить без создания коммита (остается в staging)
git revert --no-commit commit-hash
```

**Разница между reset и revert:**

- **reset** - переписывает историю (опасно для публичных веток)
- **revert** - создает новый коммит, который отменяет изменения (безопасно)

### git clean - удаление неотслеживаемых файлов

```bash
# Показать что будет удалено (dry run)
git clean -n
git clean --dry-run

# Удалить неотслеживаемые файлы
git clean -f

# Удалить файлы и папки
git clean -fd

# Удалить включая игнорируемые файлы
git clean -fdx

# Интерактивное удаление
git clean -i
```

---

<a name="history"></a>
## 7. История и просмотр

### git log - просмотр истории

```bash
# Показать историю коммитов
git log

# Краткий формат (одна строка на коммит)
git log --oneline

# Показать последние N коммитов
git log -5

# Показать с графом веток
git log --graph

# Красивый формат с графом
git log --oneline --graph --all --decorate

# Показать изменения в каждом коммите
git log -p
git log --patch

# Показать статистику изменений
git log --stat

# Фильтр по автору
git log --author="John"

# Фильтр по дате
git log --since="2024-01-01"
git log --after="2 weeks ago"
git log --until="2024-12-31"
git log --before="yesterday"

# Фильтр по сообщению коммита
git log --grep="fix"

# Показать коммиты с конкретным файлом
git log -- file.txt

# Показать коммиты в конкретной ветке
git log main..feature

# Кастомный формат
git log --pretty=format:"%h - %an, %ar : %s"
```

**Полезные форматы:**

```bash
# Алиас для красивого лога
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# Использование
git lg
```

### git show - детали коммита

```bash
# Показать последний коммит
git show

# Показать конкретный коммит
git show commit-hash

# Показать конкретный файл из коммита
git show commit-hash:file.txt

# Показать изменения в файле
git show HEAD:src/app.js
```

### git blame - кто изменял строки

```bash
# Показать кто изменял каждую строку файла
git blame file.txt

# С датами
git blame -L 10,20 file.txt  # строки 10-20

# Игнорировать пробелы
git blame -w file.txt
```

### git reflog - история всех действий

```bash
# Показать все действия (даже удаленные коммиты)
git reflog

# Показать последние N действий
git reflog -5

# Восстановить потерянный коммит
git reflog
git checkout lost-commit-hash
```

---

<a name="advanced"></a>
## 8. Продвинутые команды

### git stash - временное сохранение изменений

```bash
# Сохранить текущие изменения (working directory + staging)
git stash

# Сохранить с описанием
git stash save "Work in progress on login"

# Сохранить включая неотслеживаемые файлы
git stash -u
git stash --include-untracked

# Показать список stash
git stash list

# Показать изменения в stash
git stash show
git stash show -p stash@{0}

# Применить последний stash (не удаляя его)
git stash apply

# Применить конкретный stash
git stash apply stash@{2}

# Применить и удалить последний stash
git stash pop

# Удалить последний stash
git stash drop

# Удалить конкретный stash
git stash drop stash@{2}

# Удалить все stash
git stash clear

# Создать ветку из stash
git stash branch feature-name stash@{0}
```

### git cherry-pick - применение отдельных коммитов

```bash
# Применить коммит из другой ветки
git cherry-pick commit-hash

# Применить несколько коммитов
git cherry-pick commit1 commit2

# Применить диапазон коммитов
git cherry-pick commit1^..commit2

# Применить без создания коммита
git cherry-pick --no-commit commit-hash

# Отменить cherry-pick
git cherry-pick --abort
```

### git tag - создание меток

```bash
# Показать все теги
git tag

# Создать легкий тег
git tag v1.0.0

# Создать аннотированный тег (рекомендуется)
git tag -a v1.0.0 -m "Version 1.0.0"

# Создать тег для конкретного коммита
git tag -a v1.0.0 commit-hash -m "Message"

# Показать информацию о теге
git show v1.0.0

# Отправить теги на сервер
git push origin v1.0.0
git push origin --tags

# Удалить локальный тег
git tag -d v1.0.0

# Удалить удаленный тег
git push origin --delete v1.0.0
```

### git bisect - поиск проблемного коммита

```bash
# Начать bisect
git bisect start

# Отметить текущий коммит как плохой
git bisect bad

# Отметить старый коммит как хороший
git bisect good commit-hash

# Git будет переключать на коммиты для тестирования
# После каждого теста отмечаем:
git bisect good  # если все работает
git bisect bad   # если есть баг

# Завершить bisect
git bisect reset
```

### git worktree - работа с несколькими ветками одновременно

```bash
# Создать новую рабочую директорию для ветки
git worktree add ../project-feature feature-branch

# Показать все worktree
git worktree list

# Удалить worktree
git worktree remove ../project-feature

# Почистить устаревшие worktree
git worktree prune
```

---

<a name="conflicts"></a>
## 9. Работа с конфликтами

### Как возникают конфликты

Конфликты возникают когда:
- Два человека изменили одни и те же строки в файле
- Один удалил файл, другой изменил его
- Оба создали ветки с одинаковыми именами

### Маркеры конфликта

```
<<<<<<< HEAD
Ваши изменения
=======
Изменения из другой ветки
>>>>>>> feature-branch
```

### Решение конфликтов

```bash
# 1. Увидеть конфликтующие файлы
git status

# 2. Открыть файл и решить конфликт вручную
# Удалить маркеры <<<<, ====, >>>>
# Оставить нужный код

# 3. Добавить решенный файл
git add file.txt

# 4. Продолжить merge/rebase
git merge --continue
git rebase --continue

# Или отменить
git merge --abort
git rebase --abort
```

### Стратегии разрешения конфликтов

```bash
# Принять свои изменения
git checkout --ours file.txt

# Принять чужие изменения
git checkout --theirs file.txt

# Использовать merge tool
git mergetool

# Настроить merge tool (например, VSCode)
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

---

<a name="flow"></a>
## 10. Git Flow и стратегии

### Git Flow - популярная стратегия ветвления

**Основные ветки:**
- **main** (master) - продакшн код, всегда стабилен
- **develop** - интеграционная ветка для разработки

**Вспомогательные ветки:**
- **feature/** - новые функции (от develop)
- **release/** - подготовка к релизу (от develop)
- **hotfix/** - срочные исправления (от main)

```bash
# Начать новую фичу
git checkout develop
git checkout -b feature/login-form

# Закончить фичу
git checkout develop
git merge --no-ff feature/login-form
git branch -d feature/login-form
git push origin develop

# Создать релиз
git checkout develop
git checkout -b release/1.0.0
# Исправления багов, обновление версий
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0
git checkout develop
git merge --no-ff release/1.0.0
git branch -d release/1.0.0

# Hotfix
git checkout main
git checkout -b hotfix/critical-bug
# Исправление
git checkout main
git merge --no-ff hotfix/critical-bug
git tag -a v1.0.1
git checkout develop
git merge --no-ff hotfix/critical-bug
git branch -d hotfix/critical-bug
```

### GitHub Flow - упрощенная стратегия

```bash
# 1. Создать ветку от main
git checkout main
git checkout -b feature/new-feature

# 2. Работа и коммиты
git add .
git commit -m "feat: add new feature"

# 3. Push и создать Pull Request
git push -u origin feature/new-feature

# 4. После ревью - merge в main
# 5. Deploy автоматически
```

### Trunk-Based Development

```bash
# Все работают в main или short-lived ветках
git checkout main
git checkout -b feature-x

# Быстрая разработка (часы, не дни)
git add .
git commit -m "feat: implement X"

# Merge как можно скорее
git checkout main
git merge feature-x
git branch -d feature-x
```

---

<a name="conventional"></a>
## 11. Conventional Commits - профессиональные коммиты

### Что такое Conventional Commits?

**Conventional Commits** - это соглашение о формате сообщений коммитов. Используется в крупных проектах и Open Source.

### Формат коммита

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Пример:**
```
feat(auth): add login with Google

Implement OAuth2 authentication flow for Google login.
Users can now sign in using their Google account.

Closes #123
```

### Типы коммитов (type)

**Основные типы:**

```bash
feat:     # Новая функциональность
fix:      # Исправление бага
docs:     # Изменения в документации
style:    # Форматирование (не влияет на код)
refactor: # Рефакторинг (не fix, не feat)
perf:     # Улучшение производительности
test:     # Добавление/исправление тестов
build:    # Изменения в сборке (webpack, npm)
ci:       # Изменения в CI/CD
chore:    # Рутинные задачи (обновление зависимостей)
revert:   # Откат предыдущего коммита
```

### Примеры коммитов

```bash
# Новая функция
git commit -m "feat: add user registration form"
git commit -m "feat(auth): implement JWT authentication"

# Исправление бага
git commit -m "fix: resolve null pointer exception in login"
git commit -m "fix(ui): correct button alignment on mobile"

# Документация
git commit -m "docs: update README with installation steps"
git commit -m "docs(api): add JSDoc comments to auth service"

# Стиль (форматирование, пробелы, точки с запятой)
git commit -m "style: format code with prettier"
git commit -m "style(components): add consistent spacing"

# Рефакторинг
git commit -m "refactor: extract validation logic to separate function"
git commit -m "refactor(api): simplify error handling"

# Производительность
git commit -m "perf: optimize image loading"
git commit -m "perf(db): add index to users table"

# Тесты
git commit -m "test: add unit tests for auth service"
git commit -m "test(integration): add API endpoint tests"

# Сборка
git commit -m "build: update webpack config for production"
git commit -m "build(deps): upgrade react to 18.2.0"

# CI/CD
git commit -m "ci: add GitHub Actions workflow"
git commit -m "ci(deploy): configure automatic deployment"

# Рутинные задачи
git commit -m "chore: update dependencies"
git commit -m "chore(git): add .gitignore rules"

# Откат
git commit -m "revert: feat: add user registration form"
```

### Scope (область изменений)

Scope указывает какая часть проекта изменена:

```bash
feat(auth): add login page
fix(cart): resolve checkout bug
docs(readme): update installation guide
refactor(api): simplify user service
test(components): add Button tests

# Общие scope:
(api)        # Backend API
(ui)         # User Interface
(db)         # Database
(auth)       # Authentication
(config)     # Configuration
(deps)       # Dependencies
(tests)      # Tests
(docs)       # Documentation
```

### Subject (заголовок)

Правила для subject:
- Начинать с маленькой буквы (или большой - выберите стиль)
- Не ставить точку в конце
- Использовать повелительное наклонение ("add" не "added")
- Максимум 50-72 символа

```bash
# ✅ Хорошо
feat: add login button
fix: resolve memory leak
docs: update API documentation

# ❌ Плохо
feat: Added login button.
fix: Fixed a bug
docs: Updated some docs
```

### Body (тело коммита)

Детальное описание изменений:
- Что изменилось
- Почему изменилось
- Как работает

```bash
git commit -m "feat: add user authentication" -m "
Implement JWT-based authentication system.
Users can now sign up, log in, and access protected routes.

Technical details:
- Added JWT middleware
- Created auth service
- Implemented password hashing with bcrypt
- Added login/register endpoints
"
```

### Footer (подвал)

Ссылки на issues, breaking changes:

```bash
git commit -m "feat: migrate to new API" -m "
Complete migration from v1 to v2 API.
Updated all endpoints and response formats.
" -m "
BREAKING CHANGE: API v1 is no longer supported.
All clients must upgrade to v2.

Closes #456
Refs #123, #789
"
```

**Breaking Changes:**
```bash
# Способ 1: через footer
feat: rename user endpoint

BREAKING CHANGE: /api/user renamed to /api/users

# Способ 2: через !
feat!: rename user endpoint
refactor(api)!: change response format
```

### Полные примеры профессиональных коммитов

```bash
# Простой коммит
git commit -m "feat: add dark mode toggle"

# С scope
git commit -m "fix(auth): prevent token expiration bug"

# С body
git commit -m "refactor: optimize image loading" -m "
Lazy load images below the fold to improve initial page load time.
Reduces initial bundle size by 40%.
"

# Breaking change
git commit -m "feat!: upgrade to React 18" -m "
Migrate entire codebase to React 18.
Update all lifecycle methods to hooks.
" -m "
BREAKING CHANGE: Requires React 18 and Node 16+

Closes #234
"

# Множественные issues
git commit -m "fix: resolve multiple UI bugs" -m "
- Fix button misalignment on mobile
- Correct z-index for modal overlay
- Update font sizes for accessibility
" -m "
Fixes #123, #124, #125
"

# Revert
git commit -m "revert: feat: add dark mode toggle" -m "
This reverts commit abc123def456.
Dark mode causes rendering issues on Safari.
"
```

### Правила для хороших коммитов

**DO (делать):**
- Коммитить часто и логично
- Один коммит - одна задача
- Писать понятные сообщения
- Использовать conventional commits
- Ссылаться на issues

**DON'T (не делать):**
- Коммитить "WIP", "fix", "update"
- Смешивать разные изменения в одном коммите
- Коммитить неработающий код в main
- Использовать бессмысленные сообщения

### Примеры плохих коммитов

```bash
# ❌ Очень плохо
git commit -m "fix"
git commit -m "update"
git commit -m "asdf"
git commit -m "changes"
git commit -m "..."

# ❌ Плохо
git commit -m "fixed some bugs"
git commit -m "updated files"
git commit -m "changes from yesterday"

# ❌ Слишком общее
git commit -m "fix bugs and add features"
git commit -m "update multiple files"

# ✅ Хорошо
git commit -m "fix(auth): resolve token expiration bug"
git commit -m "feat(ui): add dark mode toggle button"
git commit -m "refactor(api): extract validation logic"
```

### Полезные алиасы для коммитов

```bash
# Настроить алиасы
git config --global alias.feat '!git commit -m "feat: $1"'
git config --global alias.fix '!git commit -m "fix: $1"'

# Или в ~/.gitconfig
[alias]
    feat = "!f() { git commit -m \"feat: $1\"; }; f"
    fix = "!f() { git commit -m \"fix: $1\"; }; f"
    docs = "!f() { git commit -m \"docs: $1\"; }; f"
    refactor = "!f() { git commit -m \"refactor: $1\"; }; f"
    test = "!f() { git commit -m \"test: $1\"; }; f"
```

### Emoji в коммитах (опционально)

Некоторые команды используют emoji для визуального выделения:

```bash
# Gitmoji convention
git commit -m "✨ feat: add new feature"
git commit -m "🐛 fix: resolve bug"
git commit -m "📝 docs: update README"
git commit -m "♻️ refactor: improve code"
git commit -m "⚡️ perf: optimize performance"
git commit -m "✅ test: add tests"
git commit -m "🔧 chore: update config"
git commit -m "🚀 deploy: release version 1.0"

# Популярные emoji:
✨ feat        🐛 fix         📝 docs
♻️ refactor    ⚡️ perf        ✅ test
🔧 config     🚀 deploy      🎨 style
🔥 remove     🚑 hotfix      🔒 security
```

### Автоматизация с Commitizen

```bash
# Установить commitizen
npm install -g commitizen cz-conventional-changelog

# Инициализировать в проекте
commitizen init cz-conventional-changelog --save-dev --save-exact

# Использовать
git add .
git cz  # вместо git commit

# Commitizen задаст вопросы:
# 1. Type of change? (feat, fix, docs...)
# 2. Scope of this change?
# 3. Short description?
# 4. Longer description?
# 5. Breaking changes?
# 6. Issues closed?
```

---

<a name="cheatsheet"></a>
## 12. Шпаргалка команд

### Начало работы
```bash
git init                    # Создать репозиторий
git clone <url>             # Клонировать репозиторий
git config --global user.name "Name"  # Настроить имя
git config --global user.email "email"  # Настроить email
```

### Базовые операции
```bash
git status                  # Статус файлов
git add <file>              # Добавить в staging
git add .                   # Добавить все файлы
git commit -m "message"     # Создать коммит
git commit -am "message"    # Add + commit
git diff                    # Показать изменения
```

### Ветки
```bash
git branch                  # Список веток
git branch <name>           # Создать ветку
git checkout <name>         # Переключиться на ветку
git switch <name>           # Переключиться (новая команда)
git checkout -b <name>      # Создать и переключиться
git merge <branch>          # Слить ветку
git branch -d <name>        # Удалить ветку
```

### Удаленные репозитории
```bash
git remote add origin <url> # Добавить remote
git fetch                   # Получить изменения
git pull                    # Получить и слить
git push                    # Отправить изменения
git push -u origin <branch> # Отправить и установить upstream
```

### Отмена изменений
```bash
git restore <file>          # Отменить изменения в файле
git restore --staged <file> # Убрать из staging
git reset HEAD~1            # Отменить последний коммит
git reset --hard HEAD~1     # Отменить коммит и изменения
git revert <commit>         # Отменить коммит (безопасно)
```

### История
```bash
git log                     # История коммитов
git log --oneline           # Краткая история
git log --graph             # С графом веток
git show <commit>           # Показать коммит
git blame <file>            # Кто изменял строки
```

### Продвинутые команды
```bash
git stash                   # Сохранить изменения
git stash pop               # Применить stash
git cherry-pick <commit>    # Применить коммит
git rebase <branch>         # Перебазировать
git tag <name>              # Создать тег
```

### Conventional Commits шпаргалка
```bash
feat:      # Новая функция
fix:       # Исправление бага
docs:      # Документация
style:     # Форматирование
refactor:  # Рефакторинг
perf:      # Производительность
test:      # Тесты
build:     # Сборка
ci:        # CI/CD
chore:     # Рутина
revert:    # Откат
```

---

## Заключение

### Что должен знать junior разработчик:
- Базовые команды (init, clone, add, commit, push, pull)
- Работа с ветками (branch, checkout, merge)
- Решение простых конфликтов
- Понимание .gitignore
- Базовые conventional commits

### Что должен знать middle разработчик:
- Все базовые команды свободно
- Rebase, cherry-pick, stash
- Решение сложных конфликтов
- Git flow или GitHub flow
- Правильное написание коммитов
- Работа с remote репозиториями

### Что должен знать senior разработчик:
- Вся шпаргалка выше
- Оптимизация истории (interactive rebase)
- Настройка CI/CD через Git hooks
- Стратегии branching для команды
- Автоматизация с помощью скриптов
- Восстановление потерянных данных

### Полезные ресурсы:
- **Официальная документация:** https://git-scm.com/doc
- **Learn Git Branching (интерактивно):** https://learngitbranching.js.org/
- **Conventional Commits:** https://www.conventionalcommits.org/
- **GitHub Flow:** https://guides.github.com/introduction/flow/
- **Git Flow:** https://nvie.com/posts/a-successful-git-branching-model/

---

**Успехов в изучении Git! 🚀**