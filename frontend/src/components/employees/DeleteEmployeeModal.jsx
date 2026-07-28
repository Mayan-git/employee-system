import { useState } from "react";
import Modal from "../ui/Modal.jsx";
import Button from "../ui/Button.jsx";

export default function DeleteEmployeeModal({ employee, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal open={Boolean(employee)} onClose={onClose} title="Delete employee">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Are you sure you want to remove <span className="font-semibold text-slate-900 dark:text-slate-100">{employee?.name}</span>? This action cannot be undone.
      </p>
      <div className="mt-5 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" loading={deleting} onClick={handleConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
