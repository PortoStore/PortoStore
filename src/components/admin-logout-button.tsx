'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useAdminNavigation } from '@/components/admin/admin-navigation-provider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminLogoutButton() {
  const router = useRouter()
  const supabase = createClient()
  const { isDirty, setIsDirty } = useAdminNavigation()

  async function handleLogout() {
    setIsDirty(false) // Clear dirty state to allow navigation/logout
    await supabase.auth.signOut()
    router.refresh()
    router.push('/admin/login')
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2" 
        >
          <LogOut className="h-4 w-4" />
          Salir del Admin
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isDirty ? "¿Descartar cambios y salir?" : "¿Cerrar sesión?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {isDirty 
              ? "Tenés cambios sin guardar que se perderán si cerrás sesión ahora."
              : "Tendrás que volver a ingresar tus credenciales para acceder al panel de administración."
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>
            {isDirty ? "Descartar y Salir" : "Salir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
