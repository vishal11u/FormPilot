# FormPilot

A full-stack form submission SaaS platform like Formspree.

## Features

- User authentication (Supabase Auth)
- Create and manage forms
- Public API endpoint for form submissions
- Embed code for easy integration

## Setup

1. **Clone the repo and install dependencies:**

   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a project at [supabase.com](https://supabase.com/)
   - Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   - Create the following tables in the SQL editor:

```sql
create table forms (
  id uuid primary key default uuid_generate_v4(),
  form_id text unique not null,
  user_id uuid references auth.users(id),
  notify_email text not null,
  redirect_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table submissions (
  id uuid primary key default uuid_generate_v4(),
  form_id text references forms(form_id),
  name text,
  email text,
  mobile text,
  remark text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

3. **Configure environment variables:**
   - Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Visit the app:**
   - Open [http://localhost:3000](http://localhost:3000)

## Usage

- Sign up and log in
- Create forms in the dashboard
- Copy the embed code and use it in your site
- Submissions will be saved in Supabase
