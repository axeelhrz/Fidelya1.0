import AdminClientContent from './AdminClientContent';
import { AuthProvider } from '@/context/auth-context'
export const dynamic = 'force-dynamic';



export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminClientContent />;\
    </AuthProvider>
  )
}