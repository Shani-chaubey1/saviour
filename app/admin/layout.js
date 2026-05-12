import AdminShell from './_components/AdminShell';
import '../globals.css';

export const metadata = {
  title: { default: 'Admin Panel – Saviour', template: '%s – Admin' },
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
