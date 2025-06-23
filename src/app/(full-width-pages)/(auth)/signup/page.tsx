import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cargo Track",
  description: "Registro - Cargo Track",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
