import { useState } from "react";
import { useMutation } from "../../../hooks/api-call";
import { api } from "../../../api";
import Toast from "../../../components/toast/toast";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const request = useMutation({
    mutation: () => api.requestResetPassword(email),
  });

  return (
    <main>
      <div>
        <h1>Reset Password</h1>
        <input
          type="email"
          placeholder="jdoe@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={() => request.mutate()} disabled={request.loading}>
          Reset Password
        </button>
      </div>
      <Toast
        message={request.error}
        state="error"
        onClear={request.resetError}
      />
    </main>
  );
}
