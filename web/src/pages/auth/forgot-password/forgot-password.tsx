import styles from "./forgotpassword.module.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "../../../hooks/api-call";
import { api } from "../../../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Toast from "../../../components/toast/toast";

export default function ForgotPassword() {
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const reset = useMutation({
    mutation: () => api.resetPassword(id ?? "", password),
  });

  return (
    <main>
      <div>
        <h1>Reset Password</h1>
        <div className={styles.password}>
          <input
            type={visible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => setVisible(!visible)}>
            {visible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className={styles.password}>
          <input
            type={visible ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={() => setVisible(!visible)}>
            {visible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button onClick={() => reset.mutate()} disabled={reset.loading}>
          Reset Password
        </button>
      </div>
      <Toast message={reset.error} state="error" onClear={reset.resetError} />
    </main>
  );
}
