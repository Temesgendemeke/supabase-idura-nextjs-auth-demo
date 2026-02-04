# Supabase + Norwegian BankID (Idura) Auth Demo

A modern, high-performance authentication boilerplate using **Next.js 15+ App Router**, **Supabase SSR**, and **Norwegian BankID** via [Idura/Criipto](https://www.criipto.com/).

## Key Features

- **Next.js App Router**: Optimized with Server Components and Route Handlers.
- **Supabase SSR Integration**: Modern cookie-based authentication flow using `@supabase/ssr`.
- **BankID (OIDC)**: Seamless integration with the Norwegian BankID login flow through Idura.
- **Premium UI**: Clean, responsive, and high-end design using **Tailwind CSS 4.0**.
- **User Profiles**: Automatic profile synchronization with Supabase Postgres on first login.
- **Middleware Protected Routes**: Secure dashboard access with server-side session validation.

## Technology Stack

| Tech              | Description                            |
| :---------------- | :------------------------------------- |
| **Next.js**       | React Framework for the Web            |
| **Supabase**      | Firebase Alternative (Auth & Database) |
| **Idura/Criipto** | Identity Broker for Norwegian BankID   |
| **Tailwind CSS**  | Utility-first CSS framework            |
| **TypeScript**    | Static typing for JavaScript           |

## Getting Started

### 1. Prerequisites

- A [Supabase](https://supabase.com/) account and project.
- A [Criipto/Idura](https://dashboard.criipto.com/) application configured with:
  - **Redirect URI**: `http://localhost:3000/api/auth/callback`
  - **OIDC Scopes**: `openid profile`

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Idura/Criipto
IDURA_SUBDOMAIN=your_subdomain.criipto.id
IDURA_CLIENT_ID=your_client_id
IDURA_CLIENT_SECRET=your_client_secret
IDURA_REDIRECT_URI=http://localhost:3000/api/auth/callback
IDURA_ACR_VALUES=urn:grn:authn:no:bankid:substantial
```

### 3. Installation

```bash
npm install
```

### 4. Database Setup

Run the following SQL in your Supabase SQL Editor to create the profiles table:

```sql
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  bankid_sub TEXT UNIQUE NOT NULL,
  national_id TEXT,
  full_name TEXT,
  given_name TEXT,
  family_name TEXT,
  birth_date DATE,
  phone TEXT,
  bankid_verified BOOLEAN DEFAULT true,
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### 5. Running the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your BankID Demo in action.

## Project Structure

- `app/api/auth/`: App Router Route Handlers for Login, Callback, and Logout.
- `app/dashboard/`: Protected profile page (Server Component).
- `components/`: UI components including the BankID login button.
- `lib/supabase.ts`: Server-side Supabase client initialization.
- `middleware.ts`: Global session and route protection.

## License

MIT. Feel free to use this as a starting point for your own projects!
