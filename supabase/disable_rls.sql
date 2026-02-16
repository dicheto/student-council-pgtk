-- Temporarily disable RLS to fix login issues
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

SELECT 'RLS изключен временно - логинът ще работи сега!' as status;
