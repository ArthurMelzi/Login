import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { loginSchema, type LoginData } from "@shared/schema";
import { FloatingInput } from "./floating-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function LoginForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso!",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      const message = error.message || "Erro ao fazer login";
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-login">
      <div className="space-y-4">
        <FloatingInput
          {...form.register("username")}
          label="Nome de usuário"
          error={form.formState.errors.username?.message}
          data-testid="input-username"
        />

        <FloatingInput
          {...form.register("password")}
          type="password"
          label="Senha"
          error={form.formState.errors.password?.message}
          data-testid="input-password"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center" data-testid="label-remember">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="mr-2"
              data-testid="checkbox-remember"
            />
            <span className="text-sm text-muted-foreground">Lembrar-me</span>
          </label>
          <a 
            href="#" 
            className="text-sm text-primary hover:text-primary/80 transition-colors"
            data-testid="link-forgot-password"
          >
            Esqueceu a senha?
          </a>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loginMutation.isPending}
        data-testid="button-login"
      >
        <span data-testid="text-login-button">
          {loginMutation.isPending ? "Entrando..." : "Entrar"}
        </span>
        {loginMutation.isPending && (
          <div className="spinner ml-2" data-testid="spinner-login" />
        )}
      </Button>
    </form>
  );
}
