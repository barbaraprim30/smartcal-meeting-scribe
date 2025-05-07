
-- Update profiles table to add bio and time_zone columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS time_zone text;

-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  calendar_type TEXT NOT NULL DEFAULT 'work',
  attendees TEXT[] DEFAULT '{}',
  is_virtual BOOLEAN DEFAULT TRUE,
  location TEXT,
  platform TEXT,
  description TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable row level security on all tables
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for meetings
CREATE POLICY "Users can view all meetings" 
  ON public.meetings FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can insert their own meetings" 
  ON public.meetings FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own meetings" 
  ON public.meetings FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own meetings" 
  ON public.meetings FOR DELETE 
  TO authenticated 
  USING (auth.uid() = created_by);

-- Create policies for user_roles
CREATE POLICY "Users can view all roles" 
  ON public.user_roles FOR SELECT 
  TO authenticated 
  USING (true);

-- Create storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload avatars
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = 'avatars'
);

-- Create policy to allow users to update their avatar
CREATE POLICY "Users can update their avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = 'avatars'
);

-- Create policy to allow public read access to avatars
CREATE POLICY "Public read access for avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Set up realtime for meetings table
ALTER TABLE public.meetings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;
