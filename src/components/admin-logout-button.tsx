'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function AdminLogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/admin/login')
  }

  return (
    <Button 
      variant="outline" 
      className="w-full justify-start gap-2" 
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      Salir del Admin
    </Button>
  )
}
