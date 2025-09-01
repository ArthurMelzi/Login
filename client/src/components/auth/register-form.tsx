import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { registerSchema, type RegisterData } from "@shared/schema";
import { FloatingInput } from "./floating-input";
import { PasswordStrength } from "./password-strength";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface RegisterFormProps {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [acceptTerms, setAcceptTerms] = useState(false);

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiRequest("POST", "/api/auth/register", {
        username: data.username,
        password: data.password,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso!",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      onSuccess();
    },
    onError: (error: any) => {
      const message = error.message || "Erro ao criar conta";
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterData) => {
    if (!acceptTerms) {
      toast({
        title: "Erro",
        description: "Você deve aceitar os termos de uso",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-register">
      <div className="space-y-4">
        <div>
          <FloatingInput
            {...form.register("username")}
            label="Nome de usuário"
            error={form.formState.errors.username?.message}
            data-testid="input-register-username"
          />
          <p className="text-xs text-muted-foreground mt-1">Mínimo 3 caracteres</p>
        </div>

        <FloatingInput
          {...form.register("password")}
          type="password"
          label="Senha"
          error={form.formState.errors.password?.message}
          data-testid="input-register-password"
        />

        <FloatingInput
          {...form.register("confirmPassword")}
          type="password"
          label="Confirmar senha"
          error={form.formState.errors.confirmPassword?.message}
          success={!!(confirmPassword && password === confirmPassword && !form.formState.errors.confirmPassword)}
          data-testid="input-confirm-password"
        />

        <PasswordStrength password={password || ""} />

        <label className="flex items-start space-x-2" data-testid="label-terms">
          <Checkbox
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            className="mt-1"
            data-testid="checkbox-terms"
          />
          <span className="text-sm text-muted-foreground">
            Concordo com os{" "}
            <a href="#" className="text-primary hover:text-primary/80" data-testid="link-terms">
              termos de uso
            </a>{" "}
            e{" "}
            <a href="#" className="text-primary hover:text-primary/80" data-testid="link-privacy">
              política de privacidade
            </a>
          </span>
        </label>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={registerMutation.isPending || !acceptTerms}
        data-testid="button-register"
      >
        <span data-testid="text-register-button">
          {registerMutation.isPending ? "Criando conta..." : "Criar conta"}
        </span>
        {registerMutation.isPending && (
          <div className="spinner ml-2" data-testid="spinner-register" />
        )}
      </Button>
    </form>
  );
}
