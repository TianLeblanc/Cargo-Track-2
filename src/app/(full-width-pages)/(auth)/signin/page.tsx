import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cargo Track",
  description: "Iniciar Sesión - Cargo Track",
};

export default function SignIn() {
  return <SignInForm/>;
}
