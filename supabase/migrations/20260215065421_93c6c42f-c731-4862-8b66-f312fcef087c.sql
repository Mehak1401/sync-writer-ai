
-- Role enum
CREATE TYPE public.app_role AS ENUM ('student', 'advisor', 'director');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table (separate from profiles per security requirements)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Papers table
CREATE TABLE public.papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Paper',
  content TEXT NOT NULL DEFAULT '',
  word_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in-review', 'published')),
  deadline TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;

-- Paper versions table
CREATE TABLE public.paper_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL DEFAULT 1,
  label TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  word_count INTEGER NOT NULL DEFAULT 0,
  changes_summary TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (paper_id, version_number)
);
ALTER TABLE public.paper_versions ENABLE ROW LEVEL SECURITY;

-- Student-advisor mapping
CREATE TABLE public.student_advisor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  advisor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, advisor_id),
  CHECK (student_id != advisor_id)
);
ALTER TABLE public.student_advisor ENABLE ROW LEVEL SECURITY;

-- Helper function: check role (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: get supervised student IDs
CREATE OR REPLACE FUNCTION public.get_supervised_student_ids(_advisor_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT student_id FROM public.student_advisor
  WHERE advisor_id = _advisor_id
$$;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_papers_updated_at BEFORE UPDATE ON public.papers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  -- Default role: student
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS: profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- RLS: user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
-- Directors can view all roles for dashboard
CREATE POLICY "Directors can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'director'));

-- RLS: papers
CREATE POLICY "Students can CRUD own papers" ON public.papers FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Advisors can view supervised students papers" ON public.papers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'advisor') AND owner_id IN (SELECT public.get_supervised_student_ids(auth.uid())));
CREATE POLICY "Directors can view all papers" ON public.papers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'director'));

-- RLS: paper_versions (same access as papers)
CREATE POLICY "Owners can manage versions" ON public.paper_versions FOR ALL TO authenticated USING (paper_id IN (SELECT id FROM public.papers WHERE owner_id = auth.uid())) WITH CHECK (paper_id IN (SELECT id FROM public.papers WHERE owner_id = auth.uid()));
CREATE POLICY "Advisors can view supervised versions" ON public.paper_versions FOR SELECT TO authenticated USING (paper_id IN (SELECT id FROM public.papers WHERE owner_id IN (SELECT public.get_supervised_student_ids(auth.uid())) AND public.has_role(auth.uid(), 'advisor')));
CREATE POLICY "Directors can view all versions" ON public.paper_versions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'director'));

-- RLS: student_advisor
CREATE POLICY "View own mappings" ON public.student_advisor FOR SELECT TO authenticated USING (student_id = auth.uid() OR advisor_id = auth.uid());
CREATE POLICY "Directors can view all mappings" ON public.student_advisor FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'director'));
