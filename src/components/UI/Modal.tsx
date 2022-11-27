import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { createPortal } from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";

type ModalProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  actionTitle: string;
  isOpen: boolean;
};

function Modal({ setIsOpen, isOpen, children, actionTitle }: ModalProps) {
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
            setIsOpen(false);
          }}
          className="absolute inset-0 top-0 left-0  z-20  flex h-screen w-full  items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: "50vh" }}
            transition={{ duration: 0.8, type: "spring" }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "50vh", scale: 0.4 }}
            id="modal"
            onClick={(e) => e.stopPropagation()}
            className="fixed z-40 flex min-h-[150px] w-3/4 max-w-xl flex-1 flex-col gap-8 rounded-md  bg-[#e1e1f8e7] p-3 text-black "
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold sm:text-2xl lg:text-3xl">
                {actionTitle}
              </h2>
              <button className="self-end">
                <AiOutlineClose
                  onClick={() => {
                    setIsOpen(false);
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
