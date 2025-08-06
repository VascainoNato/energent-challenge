# Energent Oil Drilling Dashboard

**Author:** Rafael Pereira Satyro
**Currently Hosted::** Vercell

---

## Features

- **Mobile-first UI** with TailwindCSS.
- **Modern stack:** React (frontend), Node.js/Express (backend), TypeScript everywhere.
- **Clean code structure:** API, hooks, types, constants (charts), contexts, utils, uploads, etc.
- **Monorepo:** frontend and backend in a single repository.
- **Backend file uploads** stored on AWS S3.
- **Responsive hamburger menu** for mobile.
- **AI Chatbot** (OpenAI GPT-4o).
- **User feedback:** React Toasts for all success/error events.
- **Data visualization:** Recharts for interactive charts.
- **CSV/Excel file upload** and processing.
- **Tooltip caching:** Fast preview on hover.
- **Production deployment:** Frontend on GitHub Pages.
- **CI/CD pipeline:** Automated build and deploy on every push.

---

## Project Structure

```
/energent-challenge-monorepo
  /frontend      # React + Vite + TailwindCSS + Typescript
  /backend       # Node.js + Express + TypeScript
  .github/
    workflows/ (Example)
      deploy.yml # CI/CD pipeline config
  README.md
  ...
```

---

## CI/CD Pipeline (GitHub Pages) - Example

To set up **GitHub Actions** for continuous integration and deployment to **GitHub Pages**.

Note: Vercel, which currently hosts the app, already has CI/CD, so we are using an example from GithubPages.

### How it works

- Every push to the `main` branch triggers the workflow.
- The workflow installs dependencies, builds the frontend, and deploys the static site to GitHub Pages.
- The backend is built for validation, but not deployed via GitHub Pages.

---

### Example Workflow (`.github/workflows/deploy.yml`)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-frontend-and-deploy:
    name: Build and Deploy Frontend to GitHub Pages
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist

  build-backend:
    name: Build Backend (validation only)
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
```

---

### Step-by-step: How to set up CI/CD for GitHub Pages

1. **Install `gh-pages` in the frontend:**

   ```bash
   cd frontend
   npm install gh-pages --save-dev
   ```

2. **Add the `homepage` field to `frontend/package.json`:**

   ```json
   "homepage": "https://<your-github-username>.github.io/<your-repo-name>"
   ```

   Example:

   ```json
   "homepage": "https://VascainoNato.github.io/energent-challenge-monorepo"
   ```

3. **Add deploy scripts to `frontend/package.json`:**

   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

4. **Create the workflow file:**
   Add `.github/workflows/deploy.yml` to the root of your repository (see above).

5. **Enable GitHub Pages in your repository settings:**

   - Go to **Settings > Pages**.
   - Set the source to the `gh-pages` branch and root (`/`).

6. **Push to `main`:**
   - Every push triggers the workflow, building and deploying the frontend to GitHub Pages.

---

## How to run locally

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

---

## Functionality Overview

- **Well List Panel:** Sidebar with well names and depths, dynamic selection and dashboard update.
- **File Upload:** Upload Excel/CSV, process and store in AWS S3, show success/error feedback.
- **Responsive Design:** Works on desktop, tablet, and mobile (hamburger menu).
- **Chatbot:** Conversational UI, OpenAI integration, user and bot messages.
- **Charts:** Interactive, domain-specific charts with Recharts.
- **Tooltip Caching:** Fast preview on hover.
- **User Feedback:** Toasts for all actions.
- **Monorepo:** Clean, scalable structure for both frontend and backend.

---

## Deployment

- **Frontend:** https://energent-challenge-woad.vercel.app/
- **Backend:** File uploads on AWS S3.

---

## Maintainers

- Rafael Pereira Satyro

---

## License

MIT
