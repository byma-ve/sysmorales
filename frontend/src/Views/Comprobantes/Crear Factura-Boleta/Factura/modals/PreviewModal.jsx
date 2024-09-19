import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@/components/ui/dialog";

const PreviewModal = ({ isOpen, onClose, onEmit, children }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90%] max-h-[90vh] overflow-y-auto">
        {children}
        <DialogActions>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onEmit}>Emitir Factura</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
