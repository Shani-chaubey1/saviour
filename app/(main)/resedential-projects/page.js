import { redirect } from 'next/navigation';

export default function ResidentialRedirectPage() {
  redirect('/projects?type=residential');
}
