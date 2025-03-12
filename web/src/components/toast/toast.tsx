import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";
import styles from "./toast.module.css";
import { useEffect, useState } from "react";
import { FaCircleStop, FaCircleXmark } from "react-icons/fa6";

type ToastProps = {
  message: string | null;
  onClear: () => void;
  state: ToastState;
  disappears?: boolean;
};

const TIMER_DURATION = 3000; // 3 seconds

type ToastState = "error" | "warning" | "success" | "info";

export default function Toast({
  message,
  onClear,
  state,
  disappears = true,
}: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message !== null) {
      setShow(true);
      if (disappears) {
        setTimeout(() => {
          setShow(false);
          onClear();
        }, TIMER_DURATION);
      }
    }
  }, [message]);

  function renderIcon() {
    switch (state) {
      case "error":
        return <FaCircleStop />;
      case "warning":
        return <FaExclamationCircle />;
      case "success":
        return <FaCheckCircle />;
      case "info":
        return <FaInfoCircle />;
    }
  }

  return (
    <div
      className={`${styles.toast} ${show ? styles.show : ""} ${styles[state]}`}
    >
      {renderIcon()}
      <span>{message}</span>
      <FaCircleXmark onClick={onClear} className={styles.close} />
    </div>
  );
}
