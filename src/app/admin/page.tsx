import AdminClientContent from './AdminClientContent';
import { AuthProvider } from '@/context/auth-context'


export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminClientContent />;\
    </AuthProvider>
  )
}