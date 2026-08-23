# Cloud Storage

A personal cloud file-storage dashboard built with **Vite + React** and
**Supabase** (Authentication + Storage). Upload a file on one computer,
open the site on another, log in, and the file is there — because it lives
in Supabase, not on your machine.

## How it works

- Files live in a single private Supabase Storage bucket named `files`.
- Every file is uploaded to a path starting with the logged-in user's ID,
  e.g. `3fae1c2b-9e2a-4b8b-9c1a-.../report.pdf`.
- Storage policies (Row Level Security) enforce that a user can only
  read/write/delete objects inside their own folder — Supabase checks this
  on every request, not just the app's UI.
- No separate database table is used for file metadata — Supabase Storage
  already tracks file name, size, MIME type, and upload date for every
  object, and the app reads that directly.

## 1. Run it locally

```bash
npm install
cp .env.example .env.local
```

Open `.env.local` and fill in your Supabase project's URL and anon key
(see step 2 below for where to find them). Then:

```bash
npm run dev
```

Open the local address it prints (normally `http://localhost:5173`).

## 2. Set up your Supabase project

1. Go to [supabase.com](https://supabase.com), create an account, and create
   a new project. Choose a database password and region and wait for it to
   finish provisioning.
2. Go to **Settings -> API**. Copy the **Project URL** and the **anon
   public** key into `.env.local`:

   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

   Never put the **service_role** key in this file or anywhere in the
   frontend — it bypasses all security rules.

3. **Authentication**: go to **Authentication -> Providers** and make sure
   **Email** is enabled. For quick local testing you can turn off "Confirm
   email" under **Authentication -> Settings** so new accounts can log in
   immediately; leave it on for a real deployment.

4. **Storage bucket**: go to **Storage -> New bucket**.
   - Name: `files` (must match exactly — this is the `BUCKET_NAME` used in
     `src/lib/supabase.js`)
   - Public bucket: **OFF** (keep it private)

5. **Storage policies**: open the **SQL Editor** and run the contents of
   [`supabase/storage-policies.sql`](./supabase/storage-policies.sql). This
   restricts every upload/download/delete to the file owner. Without this
   step, uploads and downloads will fail with a permissions error even
   though the bucket and login work.

That's it — no extra database table is required for this app.

## 3. Test that it actually works

1. `npm run dev`, open the site, create an account, and upload a test file.
2. In the Supabase dashboard, go to **Storage -> files -> `<your-user-id>`**
   and confirm the file is there.
3. Open the site in a different browser (or log out and back in) — the file
   should still show up, because it's being read from Supabase, not from
   your browser.
4. Try downloading, opening/previewing, and deleting the file from the
   dashboard.

## 4. Push to GitHub

`.gitignore` already excludes `node_modules`, `dist`, and every `.env*`
file, so your Supabase keys won't be committed.

```bash
git init
git add .
git commit -m "Initial cloud storage dashboard"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## 5. Deploy

Connect the GitHub repo to any static host that supports Vite (Vercel,
Netlify, Cloudflare Pages, etc.):

- Build command: `npm run build`
- Output directory: `dist`
- Add these environment variables in the hosting provider's dashboard
  (not just locally — your local `.env.local` file never leaves your
  computer):
  ```
  VITE_SUPABASE_URL
  VITE_SUPABASE_ANON_KEY
  ```

Once deployed, the site talks directly to Supabase from the browser, so it
works the same from any computer — your original machine doesn't need to
stay on. You can point a custom domain at the hosting provider whenever
you're ready.

## Project structure

```
src/
  lib/supabase.js        Supabase client + bucket name
  context/AuthContext.jsx Auth state (user, sign up/in/out) via React Context
  components/             Sidebar, Header, SearchBar, UploadArea,
                           FileList, FileCard, LoadingSpinner,
                           EmptyState, ErrorMessage, ProtectedRoute
  pages/                  Login, Register, Dashboard
  utils/fileHelpers.js    Formatting + file-type helpers
supabase/
  storage-policies.sql    RLS policies to run in the Supabase SQL Editor
```

## Notes and limitations

- **Upload progress** is shown as an indeterminate bar rather than a real
  percentage — the Supabase JS client's upload method doesn't expose
  byte-level progress events. The app still tells you clearly when an
  upload is in progress or has failed.
- **Print** opens the file in a new tab and attempts to trigger the
  browser's print dialog automatically. This is reliable for PDFs and
  images; for other previewable types the file simply opens and you can
  print manually (Ctrl/Cmd+P).
- **File name collisions**: if you upload a file with a name that already
  exists in your storage, the app automatically renames it (e.g.
  `report (1).pdf`) instead of overwriting the original.
