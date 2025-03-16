# Migrating from SQLite to Supabase

This guide explains how to migrate your SQLite database to Supabase for deployment on Vercel.

## Why Migrate to Supabase?

Supabase is an excellent choice for Vercel deployments because:

1. **Serverless Compatibility**: Works seamlessly with Vercel's serverless environment
2. **Scalability**: Automatically scales with your application's needs
3. **Auth & APIs**: Provides built-in authentication and REST/GraphQL APIs
4. **Free Tier**: Generous free tier for smaller projects
5. **Easy Maintenance**: No need to manage database files or worry about filesystem limitations

## Migration Options

We offer three ways to migrate your data, from simplest to most controlled:

### Option 1: One-Step Migration (Recommended)

This is the easiest method that tries to create tables and migrate data in one step:

1. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Run the one-step migration script:
   ```
   npm run migrate:one-step
   ```

If this fails because of permission issues with creating tables, you'll need to create them manually (see Option 2).

### Option 2: Create Tables First, Then Migrate

If the one-step migration fails to create tables:

1. Go to your Supabase SQL Editor
2. Copy the contents of `scripts/simplified-schema.sql` and run it
3. Run the migration script with the schema creation step skipped:
   ```
   npm run migrate:skip-schema
   ```

### Option 3: Original (Manual) Migration

For more control over each step:

1. Create a Supabase account and project
2. Copy your Supabase URL and keys to `.env.local`
3. Run the SQL schema manually in Supabase SQL Editor
4. Run the separate migration script:
   ```
   npm run migrate:to-supabase
   ```

## Troubleshooting

### "Relation does not exist" errors

This means the tables don't exist in Supabase yet. Use Option 2 to create them first.

### Permission errors

Make sure your Supabase anon key has sufficient permissions. For the one-step migration, your account might need to enable direct SQL execution for the `anon` role.

### Data not appearing in the application

- Check that environment variables are properly set in your deployment
- Verify that the tables were created and data was migrated
- Check browser console for errors

## Verification

After migration:

1. Go to your Supabase dashboard
2. Open the Table Editor
3. Check that your `job_history` and `education` tables contain the expected data
4. Run your application locally: `npm run dev`
5. Visit the Resume page to verify data is loading properly

## Deploying to Vercel

1. Add your Supabase environment variables to your Vercel project:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Deploy your application
3. Verify that the deployed app loads data from Supabase correctly 