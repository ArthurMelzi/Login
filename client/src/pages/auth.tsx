import { AuthForm } from "@/components/auth/auth-form";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="page-auth">
      <AuthForm />
    </div>
  );
}
