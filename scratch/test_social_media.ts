import { getSocialMediaSettings, updateSocialMediaSettings } from '../src/app/actions/social-media';

async function main() {
  console.log('--- Starting Social Media Integration Verification ---');

  // 1. Test fetching initial settings
  console.log('1. Testing getSocialMediaSettings...');
  const initialRes = await getSocialMediaSettings();
  console.log('   Fetch success:', initialRes.success);
  console.log('   Instagram:', initialRes.data?.instagram);
  console.log('   YouTube:', initialRes.data?.youtube);
  console.log('   Facebook:', initialRes.data?.facebook);

  if (!initialRes.success || !initialRes.data) {
    throw new Error('Failed to fetch initial social media settings');
  }

  // 2. Test URL validations
  console.log('2. Testing validation rules...');

  // 2a. HTTP instead of HTTPS
  const httpRes = await updateSocialMediaSettings({
    instagram: { url: 'http://instagram.com/idleducation', active: true },
    youtube: { url: 'https://youtube.com/@idleducation', active: true },
    facebook: { url: 'https://facebook.com/idleducation', active: true }
  });
  console.log('   HTTP rejection test (expected failure):', !httpRes.success, httpRes.errors?.instagram);
  if (httpRes.success) {
    throw new Error('Validation failed: HTTP was accepted but should be rejected!');
  }

  // 2b. Wrong domain for platform
  const wrongDomainRes = await updateSocialMediaSettings({
    instagram: { url: 'https://twitter.com/idleducation', active: true },
    youtube: { url: 'https://youtube.com/@idleducation', active: true },
    facebook: { url: 'https://facebook.com/idleducation', active: true }
  });
  console.log('   Wrong domain test (expected failure):', !wrongDomainRes.success, wrongDomainRes.errors?.instagram);
  if (wrongDomainRes.success) {
    throw new Error('Validation failed: Twitter domain was accepted for Instagram!');
  }

  // 3. Test valid update
  console.log('3. Testing valid update...');
  const validUpdate = await updateSocialMediaSettings({
    instagram: { url: 'https://www.instagram.com/idleducation/', active: true },
    youtube: { url: 'https://www.youtube.com/@idleducation', active: true },
    facebook: { url: 'https://www.facebook.com/idleducation', active: true }
  });
  console.log('   Update result:', validUpdate);
  if (!validUpdate.success || validUpdate.message !== 'Social media settings updated.') {
    throw new Error(`Unexpected message: ${validUpdate.message}`);
  }

  // 4. Verify persisted data
  console.log('4. Verifying persisted settings...');
  const verifiedRes = await getSocialMediaSettings();
  console.log('   Verified Instagram URL:', verifiedRes.data.instagram.url);
  console.log('   Verified YouTube URL:', verifiedRes.data.youtube.url);
  console.log('   Verified Facebook URL:', verifiedRes.data.facebook.url);

  // 5. Test disabling a single platform
  console.log('5. Testing disable toggle on Facebook...');
  const disableFbRes = await updateSocialMediaSettings({
    instagram: { url: 'https://www.instagram.com/idleducation', active: true },
    youtube: { url: 'https://www.youtube.com/@idleducation', active: true },
    facebook: { url: 'https://www.facebook.com/idleducation', active: false }
  });
  console.log('   Disable Facebook result:', disableFbRes.success);

  const rechecked = await getSocialMediaSettings();
  console.log('   Facebook active state:', rechecked.data.facebook.active);
  if (rechecked.data.facebook.active !== false) {
    throw new Error('Facebook should be inactive');
  }

  // Re-enable Facebook to restore clean state
  await updateSocialMediaSettings({
    instagram: { url: 'https://www.instagram.com/idleducation', active: true },
    youtube: { url: 'https://www.youtube.com/@idleducation', active: true },
    facebook: { url: 'https://www.facebook.com/idleducation', active: true }
  });
  console.log('   Re-enabled Facebook successfully.');

  console.log('--- Social Media Integration Verification: ALL TESTS PASSED ---');
}

main().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
