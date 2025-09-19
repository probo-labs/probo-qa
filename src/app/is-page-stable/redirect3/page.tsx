import { redirect } from 'next/navigation';

export default function Redirect3Page() {
  // This will redirect to /redirect2
  redirect('/is-page-stable/redirect2');
}
