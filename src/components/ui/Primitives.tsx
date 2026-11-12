import { useEffect, useRef, type ReactNode } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { motion } from "framer-motion";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#home" className="brand" aria-label="MEDIC home">
      <svg viewBox="0 0 36 30" aria-hidden="true">
        <path
          d="M2 26V4h6l10 14L28 4h6v22h-6V14L18 28 8 14v12z"
          fill="currentColor"
        />
      </svg>
      <span>MEDIC{!compact && <small>ROADWAY INTELLIGENCE</small>}</span>
    </a>
  );
}
export function Eyebrow({
  children,
  number,
}: {
  children: ReactNode;
  number?: string;
}) {
  return (
    <div className="eyebrow">
      {number && <span className="section-number">{number}</span>}
      <span className="tiny-line" />
      {children}
    </div>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  children,
  number,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  number?: string;
}) {
  return (
    <div className="section-title">
      <Eyebrow number={number}>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.55 }}
    >
      {children}
    </motion.div>
  );
}
export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a className={`text-link ${className}`} href={href}>
      {children}
      <ArrowUpRight size={16} />
    </a>
  );
}
export function Dialog({
  open,
  onClose,
  title,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (open) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      onCancel={onClose}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={title}
    >
      <div className="dialog-inner">
        <div className="dialog-heading">
          <span>{title}</span>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
