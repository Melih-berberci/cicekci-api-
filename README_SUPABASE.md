Supabase integration notes

This project was updated to use Supabase for data and storage. Follow these steps to finish setup and deploy.

1) Create a Supabase project at https://app.supabase.com

2) In the SQL editor run the migrations in order:
   - paste `migrations/001_init.sql` and run
   - paste `migrations/002_admins.sql` and run

3) Create a storage bucket named `product-images` (public) via the UI or CLI.

4) Add environment variables to your hosting environment or a local `.env` copy of `.env.example`:

   REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key

   For importing existing images and running migrations locally, keep a secure service role key in an environment variable (never checked in):
   SUPABASE_SERVICE_ROLE=your-service-role-key

5) To migrate local images into storage, run locally (only with service role):

   SUPABASE_URL=... SUPABASE_SERVICE_ROLE=... SUPABASE_BUCKET=product-images node scripts/import_images.js

6) Admin setup:
   - Create a user in Supabase Auth for your admin email.
   - Insert that user's `id` (uuid) into `admins` table in the DB.

7) Row Level Security:
   - The provided migrations enable RLS and create policies so public visitors can only read published products.
   - Admins inserted into `admins` can manage data. Adjust policies if you'd prefer a different mapping.

8) Deployment:
   - Build the React app: `npm run build`
   - Upload `build/` to your static host. Ensure environment variables are set in the host.

Notes & Security:
 - Never expose your SUPABASE_SERVICE_ROLE in frontend code. Use it only in server-side scripts.
 - The frontend uses REACT_APP_SUPABASE_ANON_KEY which is safe for public requests but limited by RLS.
 - This integration preserves existing files — it does not delete any records.

If you want, I can create a small serverless function to handle admin-only operations requiring the service role key.
