import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 32 }}>
      <h1>Welcome to FormPilot</h1>
      <p>
        A simple form submission SaaS platform. <br />
        <a href="/login">Login</a> or <a href="/signup">Sign up</a> to get started.
      </p>
    </div>
  );
}
