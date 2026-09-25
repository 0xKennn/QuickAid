import { supabase } from '../config/supabase';
import { GUIDES } from '../data/guides';

// Run this ONCE to seed Supabase with your existing bundled guides.
// After it succeeds, remove the useEffect/button that triggers it — this
// is a migration tool, not something that should run on every launch.
export async function migrateBundledGuidesToSupabase() {
  console.log(`Migrating ${GUIDES.length} guides to Supabase...`);

  for (const guide of GUIDES) {
    const { error } = await supabase.from('guides').upsert({
      id: guide.id,
      category_id: guide.categoryId,
      title: guide.title,
      severity: guide.severity,
      call_emergency: guide.callEmergency,
      content: guide.content,
    });

    if (error) {
      console.log(`  ✗ ${guide.id}:`, error.message);
    } else {
      console.log(`  ✓ ${guide.id}`);
    }
  }

  // Bump the version row so every device's next syncGuides() call
  // sees this as "new" and pulls it down.
  const { error: metaError } = await supabase
    .from('app_meta')
    .upsert({ key: 'guidesVersion', value: { version: Date.now() } });

  if (metaError) {
    console.log('Failed to update version:', metaError.message);
  } else {
    console.log('Migration complete. Version row updated.');
  }
}