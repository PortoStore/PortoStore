"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminNavigation } from './admin-navigation-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';

interface AdminLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode;
}

export function AdminLink({ children, href, onClick, ...props }: AdminLinkProps) {
  const { isDirty, setIsDirty } = useAdminNavigation();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (onClick) {
        onClick(e);
    }
    
    if (props.target === "_blank") {
      return;
    }

    if (isDirty) {
      e.preventDefault();
      setShowDialog(true);
    }
  };

  const handleConfirm = () => {
    setIsDirty(false); // Reset dirty state as we are navigating away
    setShowDialog(false);
    router.push(href.toString());
  };

  return (
    <>
      <Link href={href} onClick={handleClick} {...props}>
        {children}
      </Link>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
            <AlertDialogDescription>
              Tenés cambios sin guardar. Si salís ahora, se perderán.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Descartar y salir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
