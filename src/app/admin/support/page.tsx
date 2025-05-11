import SupportDashboard from './components/SupportDashboard';
import { AuthProvider } from '@/context/auth-context'

export default function SupportDashboardPage() {
  return (
    <AuthProvider>
     <SupportDashboard />;
    </AuthProvider>
  )
}