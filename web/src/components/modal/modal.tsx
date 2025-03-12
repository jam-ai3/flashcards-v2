import styles from "./modal.module.css";
import { ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  show: boolean;
  className?: string;
};

export default function Modal({ children, show, className = "" }: ModalProps) {
  if (!show) return null;

  return (
    <div className={styles.modal}>
      <div className={`${styles.content} ${className}`}>{children}</div>
    </div>
  );
}
