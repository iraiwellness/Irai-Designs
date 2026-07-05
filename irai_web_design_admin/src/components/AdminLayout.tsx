import WebShell from './web/WebShell';
import { ADMIN_NAV } from './web/navConfig';

export default function AdminLayout() {
  return <WebShell navItems={ADMIN_NAV} workspace="admin" />;
}
