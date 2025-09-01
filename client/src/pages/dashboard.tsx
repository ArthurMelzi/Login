import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso!",
        description: data.message,
      });
      queryClient.clear();
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer logout",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="page-dashboard-loading">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="page-dashboard">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user text-2xl text-primary" data-testid="icon-user"></i>
          </div>
          <CardTitle className="text-2xl font-bold" data-testid="text-welcome">
            Bem-vindo!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Usuário logado:</p>
            <p className="font-semibold text-lg" data-testid="text-username">
              {user.user?.username}
            </p>
            <p className="text-xs text-muted-foreground" data-testid="text-created-at">
              Membro desde: {user.user?.createdAt ? new Date(user.user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => logoutMutation.mutate()}
              variant="outline"
              className="w-full"
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              {logoutMutation.isPending ? "Saindo..." : "Sair"}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground" data-testid="text-security-footer">
              <i className="fas fa-shield-alt mr-1"></i>
              Sua sessão está protegida
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
