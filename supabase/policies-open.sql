-- Run this in the Supabase SQL Editor to switch the "files" bucket from
-- per-user private storage to fully open access (no login required).
--
-- WARNING: after running this, ANYONE who has your website link can view,
-- upload, and delete ANY file in the bucket. There is no owner check.
-- This is intentional for a fully public/shared file drop.

-- Allow anyone (no login) to list/download files.
create policy "Public read access"
on storage.objects for select
to public
using (bucket_id = 'files');

-- Allow anyone (no login) to upload files.
create policy "Public upload access"
on storage.objects for insert
to public
with check (bucket_id = 'files');

-- Allow anyone (no login) to overwrite files.
create policy "Public update access"
on storage.objects for update
to public
using (bucket_id = 'files')
with check (bucket_id = 'files');

-- Allow anyone (no login) to delete files.
create policy "Public delete access"
on storage.objects for delete
to public
using (bucket_id = 'files');
