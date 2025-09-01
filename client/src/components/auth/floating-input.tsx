import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, success, className, ...props }, ref) => {
    return (
      <div className="floating-label">
        <input
          ref={ref}
          placeholder=" "
          className={cn(
            "w-full px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background text-foreground",
            error && "input-error",
            success && "input-success",
            className
          )}
          {...props}
        />
        <label className="text-sm">{label}</label>
        {error && (
          <p className="text-xs text-destructive mt-1">{error}</p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
