import styles from "./loadingbtn.module.css";
import { CSSProperties, ReactNode } from "react";
import { FaSpinner } from "react-icons/fa";

type LoadingButtonProps = {
  text: string;
  isLoading: boolean;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  styles?: CSSProperties;
};

export default function LoadingButton({
  text,
  isLoading,
  onClick,
  icon,
  disabled,
  className,
  styles: s,
}: LoadingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      style={s}
      className={`${styles.button} ${className}`}
    >
      {isLoading ? (
        <>
          <FaSpinner className={styles.spinner} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && icon}
          <span>{text}</span>
        </>
      )}
    </button>
  );
}
