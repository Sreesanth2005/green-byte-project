
-- Create profiles table function
CREATE OR REPLACE FUNCTION create_profiles_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    CREATE TABLE public.profiles (
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
      eco_credits INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Set up RLS for profiles
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view their own profile"
      ON public.profiles FOR SELECT
      USING (auth.uid() = id);

    CREATE POLICY "Users can update their own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id);

    CREATE POLICY "Users can insert their own profile"
      ON public.profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END;
$$;

-- Create schedule_pickups table function
CREATE OR REPLACE FUNCTION create_schedule_pickups_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'schedule_pickups') THEN
    CREATE TABLE public.schedule_pickups (
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

    -- Set up RLS for schedule_pickups
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
  END IF;
END;
$$;

-- Create marketplace_items table function
CREATE OR REPLACE FUNCTION create_marketplace_items_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'marketplace_items') THEN
    CREATE TABLE public.marketplace_items (
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

    -- Set up RLS for marketplace_items
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
  END IF;
END;
$$;

-- Create storage buckets if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM storage.buckets WHERE id = 'pickup_images') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('pickup_images', 'pickup_images', true);
  END IF;

  IF NOT EXISTS (SELECT FROM storage.buckets WHERE id = 'marketplace_images') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('marketplace_images', 'marketplace_images', true);
  END IF;

  IF NOT EXISTS (SELECT FROM storage.buckets WHERE id = 'user_avatars') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('user_avatars', 'user_avatars', true);
  END IF;
END $$;

-- Setup Storage RLS policies
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own images"
  ON storage.objects FOR UPDATE
  USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('pickup_images', 'marketplace_images', 'user_avatars'));
