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
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Loader2, Trash, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ConfirmationModalProps {
  title?: string;
  description: string;
  triggerText?: string;
  onConfirm: () => void;
  isLoading: boolean;
  isSuccess: boolean;
}

export function ConfirmationModal({
  title,
  description,
  triggerText,
  onConfirm,
  isSuccess,
  isLoading,
}: ConfirmationModalProps) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open && isSuccess) setOpen(false);
  }, [isSuccess]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          triggerText ? (
            <Button variant="outline">{triggerText}</Button>
          ) : (
            <Button variant="ghost" className="text-red-500">
              <Trash2 />
            </Button>
          )
        }
      ></AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} variant="ghost">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
            className="w-28"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
