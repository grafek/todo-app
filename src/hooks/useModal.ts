import { useState } from "react";

function useModal() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  return { isModalOpen, showModal, hideModal };
}

export default useModal;
