import { redirect } from 'next/navigation';

export default function Redirect2Page() {
  // This will redirect to /redirect1
  redirect('/is-page-stable/redirect1');
}
