import React, { useEffect, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';

// Context to track nesting depth of modals
const ModalDepthContext = createContext<number>(0);

let openModalsCount = 0;
let originalBodyOverflow = '';
let originalBodyPaddingRight = '';

function lockBodyScroll() {
 if (typeof window === 'undefined') return;
 if (openModalsCount === 0) {
 originalBodyOverflow = document.body.style.overflow;
 originalBodyPaddingRight = document.body.style.paddingRight;
 
 // Calculate scrollbar width to prevent layout jump
 const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
 if (scrollbarWidth > 0) {
 document.body.style.paddingRight = `${scrollbarWidth}px`;
 }
 document.body.style.overflow = 'hidden';
 }
 openModalsCount++;
}

function unlockBodyScroll() {
 if (typeof window === 'undefined') return;
 openModalsCount = Math.max(0, openModalsCount - 1);
 if (openModalsCount === 0) {
 document.body.style.overflow = originalBodyOverflow;
 document.body.style.paddingRight = originalBodyPaddingRight;
 }
}

export interface ModalPortalProps {
 children: React.ReactNode;
 isOpen?: boolean;
 onClose?: () => void;
 /** Custom z-index override if specifically required */
 zIndex?: number;
 /** Custom backdrop opacity or class */
 backdropClassName?: string;
 /** Container padding / alignment class */
 containerClassName?: string;
 /** Close when clicking on backdrop outside children */
 closeOnBackdropClick?: boolean;
}

export const ModalPortal: React.FC<ModalPortalProps> = ({
 children,
 isOpen = true,
 onClose,
 zIndex,
 backdropClassName,
 containerClassName = 'p-3 sm:p-6',
 closeOnBackdropClick = false,
}) => {
 const currentDepth = useContext(ModalDepthContext);

 useEffect(() => {
 if (!isOpen) return;
 lockBodyScroll();
 return () => {
 unlockBodyScroll();
 };
 }, [isOpen]);

 useEffect(() => {
 if (!isOpen || !onClose) return;

 const handleKeyDown = (e: KeyboardEvent) => {
 if (e.key === 'Escape') {
 onClose();
 }
 };

 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, [isOpen, onClose]);

 if (!isOpen || typeof document === 'undefined') return null;

 // Stacking hierarchy: base z-[1000], nested z-[1050], sub-nested z-[1100]
 const computedZIndex = zIndex ?? (1000 + currentDepth * 50);

 // For nested modals, use a softer backdrop so opacities don't multiply into pitch black
 const defaultBackdropBg = currentDepth === 0
 ? 'bg-zinc-950/65'
 : 'bg-zinc-950/40';

 const backdropClasses = backdropClassName || defaultBackdropBg;

 const content = (
 <ModalDepthContext.Provider value={currentDepth + 1}>
 <div
 className={`fixed inset-0 ${backdropClasses} flex items-center justify-center ${containerClassName} animate-in fade-in duration-150 select-text`}
 style={{ zIndex: computedZIndex }}
 onClick={(e) => {
 if (closeOnBackdropClick && e.target === e.currentTarget && onClose) {
 onClose();
 }
 }}
 >
 {children}
 </div>
 </ModalDepthContext.Provider>
 );

 return createPortal(content, document.body);
};
