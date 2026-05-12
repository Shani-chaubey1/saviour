import { redirect } from 'next/navigation';

/** Site-wide homepage + branding settings live under Website Pages → Homepage. */
export default function SettingsRedirectPage() {
  redirect('/admin/pages/home');
}
