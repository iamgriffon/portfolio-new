# Supabase Integration Guide

This guide explains how to set up and use Supabase with this portfolio application.

## Overview

This application uses Supabase as its database provider for storing resume data. The data is split into two main tables:
- `job_history` - Contains work experience information
- `education` - Contains education history information

## Setup

### 1. Create a Supabase Project

1. Sign up or log in to [Supabase](https://supabase.com/)
2. Create a new project
3. Note down your project URL and anon/public key from the project settings

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and add the following:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace the placeholders with your actual Supabase project details.

### 3. Set Up Database Schema

You have two options for setting up the database schema:

**Option 1: Automatic Setup During Build**
- The build process will automatically attempt to create tables and seed data if they don't exist

**Option 2: Manual Setup**
- Run the SQL in `scripts/simplified-schema.sql` in your Supabase SQL Editor
- Then run `npm run seed-supabase` to populate the database with seed data

## Database Schema

### Job History Table
```sql
CREATE TABLE IF NOT EXISTS job_history (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  en_position TEXT NOT NULL,
  ptbr_position TEXT NOT NULL,
  zh_position TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  technologies TEXT,
  url TEXT,
  order_index INTEGER,
  image_url TEXT
);
```

### Education Table
```sql
CREATE TABLE IF NOT EXISTS education (
  id SERIAL PRIMARY KEY,
  institution TEXT NOT NULL,
  en_degree TEXT NOT NULL,
  ptbr_degree TEXT NOT NULL,
  zh_degree TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  en_achievements TEXT,
  ptbr_achievements TEXT,
  zh_achievements TEXT,
  technologies TEXT,
  url TEXT,
  order_index INTEGER,
  degree_url TEXT
);
```

## Seeding Data

To populate your Supabase database with initial data:

```
npm run seed-supabase
```

This will check if tables already have data and add seed data if they're empty.

## Deployment

For Vercel deployment, the build command automatically includes database seeding.

Ensure you add the Supabase environment variables to your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Troubleshooting

- **Missing Environment Variables**: Check your `.env.local` file contains the required Supabase variables
- **Table Creation Errors**: Use the manual setup method if automatic creation fails
- **Empty Data**: Run `npm run seed-supabase` to populate the database
- **Deployment Issues**: Confirm environment variables are correctly set in Vercel 