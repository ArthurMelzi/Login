import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ];
    
    strength = checks.filter(Boolean).length;
    return strength;
  };

  const strength = checkPasswordStrength(password);
  const colors = ['bg-muted', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const texts = ['', 'Muito fraca', 'Fraca', 'Regular', 'Boa', 'Forte'];

  return (
    <div className="space-y-2" data-testid="password-strength">
      <div className="flex space-x-1">
        <div className="h-1 flex-1 bg-muted rounded-full">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-300",
              colors[strength]
            )}
            style={{ width: `${(strength / 5) * 100}%` }}
            data-testid="strength-bar"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground" data-testid="strength-text">
        {password ? texts[strength] || 'Digite uma senha para ver a força' : 'Digite uma senha para ver a força'}
      </p>
    </div>
  );
}
