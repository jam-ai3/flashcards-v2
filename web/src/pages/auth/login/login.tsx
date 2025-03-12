import { useContext, useState } from "react";
import styles from "./login.module.css";
import { AuthContext } from "../../../contexts/auth-provider";
import { Link } from "react-router-dom";
import LoadingButton from "../../../components/loading-btn/loading-btn";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Toast from "../../../components/toast/toast";

export default function Login() {
  const { login, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    const res = await login(email, password);
    if (res) {
      setError(res);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.form}>
        <h1>Login</h1>
        <input
          type="email"
          placeholder="jdoe@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className={styles.password}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className={styles.eye}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <LoadingButton
          text="Login"
          isLoading={isLoading}
          onClick={handleLogin}
          className={styles["action-btn"]}
        />
        {/* <Link to="/request-reset-password">Forgot Password?</Link> */}
        <p>
          <span>
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </span>
        </p>
      </div>
      <Toast message={error} onClear={() => setError(null)} state="error" />
    </main>
  );
}
