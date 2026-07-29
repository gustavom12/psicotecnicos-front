import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useIntervieweeAuthContext } from "@/contexts/interviewee-auth.context";
import { Notification } from "@/common/notification";

const MIN_LENGTH = 8;

interface IntervieweePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Permite al candidato definir su contraseña (si entró con el link del email)
 * o cambiar la temporal que recibió.
 */
const IntervieweePasswordModal: React.FC<IntervieweePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { changePassword } = useIntervieweeAuthContext();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setRepeatPassword("");
    setShowPasswords(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (newPassword.length < MIN_LENGTH) {
      Notification(
        `La contraseña nueva debe tener al menos ${MIN_LENGTH} caracteres`,
        "error",
      );
      return;
    }

    if (newPassword !== repeatPassword) {
      Notification("Las contraseñas no coinciden", "error");
      return;
    }

    setSaving(true);
    const ok = await changePassword(currentPassword, newPassword);
    setSaving(false);

    if (ok) handleClose();
  };

  const toggleVisibility = (
    <button
      type="button"
      onClick={() => setShowPasswords(!showPasswords)}
      className="text-gray-400 hover:text-gray-600"
    >
      {showPasswords ? (
        <EyeOff className="w-4 h-4" />
      ) : (
        <Eye className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span className="text-[#3F3F46]">Contraseña de acceso</span>
          <span className="text-sm font-normal text-gray-500">
            Si entraste con el link del email, dejá vacío el campo de
            contraseña actual.
          </span>
        </ModalHeader>

        <ModalBody className="gap-4">
          <Input
            label="Contraseña actual"
            labelPlacement="outside"
            placeholder="La que recibiste por email"
            type={showPasswords ? "text" : "password"}
            value={currentPassword}
            onValueChange={setCurrentPassword}
            startContent={<Lock className="w-4 h-4 text-gray-400" />}
            endContent={toggleVisibility}
          />

          <Input
            label="Contraseña nueva"
            labelPlacement="outside"
            placeholder={`Al menos ${MIN_LENGTH} caracteres`}
            type={showPasswords ? "text" : "password"}
            value={newPassword}
            onValueChange={setNewPassword}
            startContent={<Lock className="w-4 h-4 text-gray-400" />}
            isRequired
          />

          <Input
            label="Repetir contraseña nueva"
            labelPlacement="outside"
            placeholder="Volvé a escribirla"
            type={showPasswords ? "text" : "password"}
            value={repeatPassword}
            onValueChange={setRepeatPassword}
            startContent={<Lock className="w-4 h-4 text-gray-400" />}
            isRequired
          />
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={handleClose} isDisabled={saving}>
            Cancelar
          </Button>
          <Button
            className="bg-[#635BFF] text-white"
            onPress={handleSubmit}
            isLoading={saving}
          >
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IntervieweePasswordModal;
