import { createClient } from '@supabase/supabase-js';
import { db } from '../src/lib/drizzle';
import { users } from '../src/db/schema';
import { eq, and, ne } from 'drizzle-orm';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function run() {
  console.log('Fetching internal admins...');
  
  const internalAdmins = await db
    .select()
    .from(users)
    .where(and(eq(users.userType, 'internal_admin'), ne(users.role, 'super_admin')));
    
  console.log(`Found ${internalAdmins.length} internal admins (excluding super_admin)`);
  
  // Get all auth users
  console.log('Fetching Supabase Auth users...');
  let authUsers: any[] = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 100,
    });
    
    if (error) {
      console.error('Error fetching auth users:', error);
      break;
    }
    
    authUsers = [...authUsers, ...data.users];
    
    if (data.users.length === 100) {
      page++;
    } else {
      hasMore = false;
    }
  }
  
  console.log(`Found ${authUsers.length} total auth users`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const admin of internalAdmins) {
    const authUser = authUsers.find(u => u.email === admin.email);
    
    let userId = authUser?.id;
    
    if (!authUser) {
      console.log(`Warning: Auth user not found for ${admin.email}. Creating it...`);
      const { data: newAuth, error: createError } = await supabase.auth.admin.createUser({
        email: admin.email,
        password: '@Kemenag126',
        email_confirm: true,
      });
      
      if (createError || !newAuth.user) {
        console.error(`Failed to create auth user for ${admin.email}:`, createError?.message);
        errorCount++;
        continue;
      }
      
      userId = newAuth.user.id;
      console.log(`Successfully created auth user for ${admin.email}`);
    } else {
      console.log(`Updating password for ${admin.email}...`);
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: '@Kemenag126',
      });
      
      if (error) {
        console.error(`Failed to update ${admin.email}:`, error.message);
        errorCount++;
        continue;
      } else {
        console.log(`Successfully updated ${admin.email}`);
      }
    }
    
    successCount++;
  }
  
  console.log(`Done! Successfully updated ${successCount} users. Failed: ${errorCount}`);
}

run().catch(console.error);
