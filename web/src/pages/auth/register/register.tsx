import { useContext, useState } from "react";
import styles from "./register.module.css";
import { AuthContext } from "../../../contexts/auth-provider";
import { Link } from "react-router-dom";
import LoadingButton from "../../../components/loading-btn/loading-btn";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Toast from "../../../components/toast/toast";

export default function Register() {
  const { register, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    const res = await register(name, email, password);
    if (res) {
      setError(res);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.form}>
        <h1>Register</h1>
        <input
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          text="Register"
          isLoading={isLoading}
          onClick={handleRegister}
          className={styles["action-btn"]}
        />
        <p>
          <span>Already have an account? </span>
          <Link to="/login">Login</Link>
        </p>
      </div>
      <Toast message={error} onClear={() => setError(null)} state="error" />
    </main>
  );
}
