
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  street_address TEXT,
  apartment_number TEXT,
  city TEXT,
  state TEXT,
  pin_code TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schedule_pickups table
CREATE TABLE IF NOT EXISTS public.schedule_pickups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  address TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  image_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create marketplace_items table
CREATE TABLE IF NOT EXISTS public.marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  condition TEXT,
  category TEXT,
  is_sold BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('pickup_images', 'pickup_images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('marketplace_images', 'marketplace_images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) policies

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Schedule Pickups RLS
ALTER TABLE public.schedule_pickups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pickups"
  ON public.schedule_pickups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pickups"
  ON public.schedule_pickups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pickups"
  ON public.schedule_pickups FOR UPDATE
  USING (auth.uid() = user_id);

-- Marketplace Items RLS
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view marketplace items"
  ON public.marketplace_items FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own marketplace items"
  ON public.marketplace_items FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own marketplace items"
  ON public.marketplace_items FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own marketplace items"
  ON public.marketplace_items FOR DELETE
  USING (auth.uid() = seller_id);

-- Storage RLS policies
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own images"
  ON storage.objects FOR UPDATE
  USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('pickup_images', 'marketplace_images'));
