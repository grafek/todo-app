import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";

type ModalProps = {
  hideModal: () => void;
  children: React.ReactNode;
  actionTitle: string;
  isOpen: boolean;
};

function Modal({ hideModal, isOpen, children, actionTitle }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const portalDiv = document.getElementById("overlays") as HTMLElement;

  const modalContent = (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          id="backdrop"
          onClick={() => {
            hideModal();
          }}
          className="fixed z-20 flex h-full w-full items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            id="modal"
            onClick={(e) => e.stopPropagation()}
            className="fixed z-40 flex min-h-[150px] w-3/4 max-w-xl flex-1 flex-col gap-8 rounded-md  bg-[#d9e0f8e7] p-3 text-black "
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold sm:text-2xl lg:text-3xl">
                {actionTitle}
              </h2>
              <button className="self-end">
                <AiOutlineClose
                  onClick={() => {
                    hideModal();
                  }}
                  className="text-2xl text-red-600 transition-transform duration-300 hover:scale-110 md:text-3xl"
                />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
  return createPortal(modalContent, portalDiv);
}

export default Modal;
