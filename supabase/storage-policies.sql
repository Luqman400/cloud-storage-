-- Run this in the Supabase SQL Editor AFTER creating a bucket named "files"
-- (Storage -> New bucket -> name: files -> Public: OFF).
--
-- These policies make storage.objects rows in the "files" bucket private per
-- user: a user can only insert/select/update/delete objects whose path
-- starts with their own auth.uid(), e.g. "3fae1c2b-.../report.pdf".
--
-- Row Level Security is already enabled on storage.objects by default in
-- every Supabase project, so we only need to add policies here.

-- Allow a user to list/download their own files.
create policy "Users can read their own files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow a user to upload files into their own folder.
create policy "Users can upload their own files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow a user to overwrite/update their own files.
create policy "Users can update their own files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'files'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow a user to delete their own files.
create policy "Users can delete their own files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'files'
  and (storage.foldername(name))[1] = auth.uid()::text
);
