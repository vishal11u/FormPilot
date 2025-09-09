# FormPilot

# FormPilot 🚀

A full-stack form submission SaaS platform like Formspree.

> [Add a short, one-sentence description of your project here. What problem does it solve?]

## Features

---

- User authentication (Supabase Auth)
- Create and manage forms
- Public API endpoint for form submissions
- Embed code for easy integration

## ✨ Features

## Setup

- **Feature A:** Briefly describe the feature.
- **Feature B:** Briefly describe the feature.
- **Feature C:** Briefly describe the feature.

1. **Clone the repo and install dependencies:**

## 🛠️ Technical Stack

```bash
npm install
```

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Add your styling solution, e.g., Tailwind CSS, CSS Modules]
- **Linting:** [ESLint](https://eslint.org/)
- **Formatting:** [Prettier](https://prettier.io/)
- **Testing:** [Jest](https://jestjs.io/)

2. **Set up Supabase:**
   - Create a project at [supabase.com](https://supabase.com/)
   - Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   - Create the following tables in the SQL editor:

## ⚙️ Getting Started

```sql
create table forms (
  id uuid primary key default uuid_generate_v4(),
  form_id text unique not null,
  user_id uuid references auth.users(id),
  notify_email text not null,
  redirect_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

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

### Prerequisites

3. **Configure environment variables:**
   - Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.

- Node.js (v18.x or later)
- npm or yarn

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

4. **Run the development server:**
1. Clone the repository:
   ```sh
   git clone https://github.com/vishal11u/FormPilot.git
   cd FormPilot
   ```

```bash
npm run dev
```

2.  Install the dependencies:

    ```sh
    npm install
    ```

3.  **Visit the app:**
    - Open [http://localhost:3000](http://localhost:3000)
4.  Run the development server:
    ```sh
    npm run dev
    ```

## Usage

- Sign up and log in
- Create forms in the dashboard
- Copy the embed code and use it in your site
- Submissions will be saved in Supabase

## Dynamic Domain Support

FormPilot automatically detects your domain and generates the correct embed codes:

- **Development**: Uses `http://localhost:3000` when running locally
- **Production**: Automatically uses your actual domain when hosted
- **No configuration needed**: Works seamlessly across environments

### How it works:

1. **Client-side detection**: Automatically detects the current domain
2. **Environment variables**: Falls back to `NEXT_PUBLIC_BASE_URL` or `VERCEL_URL` if set
3. **Smart fallback**: Defaults to localhost for development
4. **Automatic updates**: Embed codes always use the correct domain

### Environment Variables (Optional):

```bash
# For custom domain
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# For Vercel deployment (auto-detected)
VERCEL_URL=https://yourproject.vercel.app
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
