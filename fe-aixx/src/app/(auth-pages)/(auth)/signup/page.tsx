import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIXX SignUp Page",
  description: "AIXX Signup Page",
};

export default function SignUp() {
  return <SignUpForm />;
}
