import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xbszoksbpwbmvjfjjcjl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhic3pva3NicHdibXZqZmpqY2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDQ2NjQsImV4cCI6MjA1MzM4MDY2NH0.0dC87Po--og7Mb6-DDmPsbfvp3Z62L8kEI9tvnEwrSY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
