import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  buttonText?: string;
}

export function SuccessModal({ 
  isOpen, 
  onClose, 
  title = "Sucesso!",
  message, 
  buttonText = "Continuar" 
}: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm text-center slide-in" data-testid="success-modal">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check text-2xl text-green-600 dark:text-green-400"></i>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="success-title">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4" data-testid="success-message">
          {message}
        </p>
        <Button 
          onClick={onClose}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          data-testid="button-continue"
        >
          {buttonText}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
