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
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import React from "react";

interface AlertTypes {
  title: string;
  description: string;
  primaryBtn?: string;
  secondaryBtn?: string;
  open?: boolean;
  openChange?: any;
  onConfirm?: any;
  onCancel?: any;
  children?: React.ReactNode;
}

const Alert = ({
  children,
  title,
  description,
  primaryBtn,
  secondaryBtn,
  open,
  openChange,
  onConfirm,
  onCancel,
  ...rest
}: AlertTypes) => {
  return (
    <AlertDialog open={open} onOpenChange={openChange} {...rest}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{secondaryBtn || "Cancel"}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{primaryBtn || "Continue"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
