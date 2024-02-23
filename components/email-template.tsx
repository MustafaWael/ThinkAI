interface EmailTemplateProps {
  url: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  url: magicLink,
}) => (
  <div style={styles.container}>
    <h2 style={styles.title}>ThinkAI | Login to Your Account</h2>
    <p style={styles.description}>
      Click the magic link below to access your account.
    </p>
    <a href={magicLink} style={styles.button}>
      Login with Magic Link
    </a>
    <p style={styles.note}>
      Note: This link is valid for a single use and will expire after use.
    </p>
  </div>
);

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    textAlign: "center" as "center",
  },
  title: {
    color: "#333",
    fontSize: "24px",
    marginBottom: "20px",
  },
  description: {
    color: "#555",
    fontSize: "16px",
    marginBottom: "20px",
  },
  button: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
  note: {
    color: "#888",
    fontSize: "14px",
    marginTop: "20px",
  },
};
