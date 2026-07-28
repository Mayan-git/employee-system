import Modal from "../ui/Modal.jsx";
import EmployeeForm from "./EmployeeForm.jsx";

export default function EditEmployeeModal({ employee, onClose, onSave }) {
  return (
    <Modal open={Boolean(employee)} onClose={onClose} title={`Edit — ${employee?.name}`}>
      {employee && (
        <EmployeeForm
          initialValues={employee}
          submitLabel="Save Changes"
          onCancel={onClose}
          onSubmit={onSave}
        />
      )}
    </Modal>
  );
}
