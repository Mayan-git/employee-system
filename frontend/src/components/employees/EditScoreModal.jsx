import { useState } from "react";
import Modal from "../ui/Modal.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";

export default function EditScoreModal({ employee, onClose, onSave }) {
  const [score, setScore] = useState(employee ? String(employee.performanceScore) : "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    const value = Number(score);
    if (score === "" || Number.isNaN(value) || value < 0 || value > 100) {
      setError("Score must be between 0 and 100");
      return;
    }
    setSaving(true);
    try {
      await onSave(value);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={Boolean(employee)} onClose={onClose} title={`Update score — ${employee?.name}`}>
      <form onSubmit={handleSave} className="space-y-4">
        <Input
          label="Performance Score (0-100)"
          type="number"
          min="0"
          max="100"
          autoFocus
          value={score}
          onChange={(e) => {
            setScore(e.target.value);
            setError("");
          }}
          error={error}
        />
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
