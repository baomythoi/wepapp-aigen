ALTER TABLE public.faqs
ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());