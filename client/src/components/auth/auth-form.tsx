import { useState } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { SuccessModal } from "./success-modal";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export function AuthForm() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [, setLocation] = useLocation();

  const handleRegisterSuccess = () => {
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setActiveTab("login");
  };

  return (
    <>
      <div className="relative w-full max-w-md">
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-5" 
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%233B82F6" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`
          }}
        />

        <Card className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden slide-in animate-slide-in" data-testid="card-auth">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/90 p-6 text-center">
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-shield-alt text-2xl text-primary-foreground" data-testid="icon-shield"></i>
            </div>
            <h1 className="text-2xl font-bold text-primary-foreground" data-testid="text-title">
              Sistema Seguro
            </h1>
            <p className="text-primary-foreground/80 text-sm mt-1" data-testid="text-subtitle">
              Autenticação e cadastro de usuários
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-muted">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === "login"
                  ? "bg-card text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="tab-login"
            >
              <i className="fas fa-sign-in-alt mr-2"></i>Entrar
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === "register"
                  ? "bg-card text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="tab-register"
            >
              <i className="fas fa-user-plus mr-2"></i>Cadastrar
            </button>
          </div>

          {/* Form Container */}
          <div className="p-6">
            {activeTab === "login" ? (
              <LoginForm />
            ) : (
              <RegisterForm onSuccess={handleRegisterSuccess} />
            )}
          </div>

          {/* Footer */}
          <div className="bg-muted/30 px-6 py-4 text-center border-t border-border">
            <p className="text-xs text-muted-foreground" data-testid="text-security">
              <i className="fas fa-shield-alt mr-1"></i>
              Seus dados são protegidos com criptografia de ponta
            </p>
          </div>
        </Card>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        message="Conta criada com sucesso! Você pode fazer login agora."
      />
    </>
  );
}
