import AdminShell from './_components/AdminShell';
import '../globals.css';
/** Load with layout so styles always ship in production (not tied to client page chunk). */
import './dashboard-page.css';

export const metadata = {
  title: { default: 'Admin Panel – Saviour', template: '%s – Admin' },
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
