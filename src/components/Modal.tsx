import React, { useEffect, useRef } from 'react';

interface ModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string; // Optional title for accessibility
}

export const Modal: React.FC<ModalProps> = ({ id, isOpen, onClose, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close the modal on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Close the modal on pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div key={id} id={id} className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center px-4 py-6">
      <div ref={modalRef} className="relative bg-white w-full max-w-md m-auto p-6 rounded-lg shadow-lg" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <h2 id="modalTitle" className="text-lg font-semibold">{title}</h2>
        {children}
        <button onClick={onClose} className="absolute top-3 right-3 text-lg text-gray-700 hover:text-gray-900">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;

// Usage
// <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
//   <p>Your modal content goes here.</p>
// </Modal>
