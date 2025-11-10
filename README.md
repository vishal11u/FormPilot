# FormPilot 🚀

FormPilot is a full-stack form submission SaaS platform that allows you to create, manage, and analyze form submissions easily. It provides a public API endpoint for form submissions and an embeddable code for easy integration into your website.

![](landing.png)

## ✨ Features

- **User Authentication**: Secure user authentication using Clerk.
- **Form Creation and Management**: Easily create and manage forms from the dashboard.
- **Form Submission API**: A public API endpoint to handle form submissions.
- **Embeddable Forms**: Simple-to-use embed code for seamless integration with your website.
- **Submission Management**: View and manage all your form submissions in one place.
- **Spam Protection**: Honeypot implementation to protect against spam bots.
- **Redirects**: Redirect users to a specific URL after a successful form submission.
- **Dark Mode**: A beautiful dark mode for a better user experience.

## 🛠️ Technical Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Linting**: [ESLint](https://eslint.org/)
- **Formatting**: [Prettier](https://prettier.io/)
- **Testing**: [Jest](https://jestjs.io/)

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/FormPilot.git
    cd FormPilot
    ```

2.  **Install the dependencies:**

    ```sh
    npm install
    ```

3.  **Set up your environment variables:**

    Create a `.env.local` file in the root of your project and add the following environment variables. You can get these from your Supabase and Clerk dashboards.

    ```
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    ```

4.  **Set up the database:**

    Run the following SQL queries in your Supabase SQL editor to create the necessary tables:

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

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1.  **Sign up and log in.**
2.  **Create a new form** from the dashboard.
3.  **Copy the form submission URL** and use it as the `action` attribute in your HTML form.
4.  **Submissions will be saved** in your Supabase database and can be viewed on the submissions page.

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
