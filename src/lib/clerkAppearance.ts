/** Shared Clerk appearance so Login, SignUp and UserProfile match the app UI. */
export const clerkAppearance = {
  variables: {
    colorPrimary: "var(--accent)",
    colorText: "var(--ink)",
    colorTextSecondary: "var(--ink-muted)",
    colorBackground: "var(--card)",
    colorInputBackground: "var(--surface)",
    colorInputText: "var(--ink)",
    borderRadius: "0.5rem",
  },
  elements: {
    card: {
      backgroundColor: "var(--card)",
      boxShadow: "6px 6px 0 0 var(--ink)",
      border: "2px solid var(--ink)",
      borderRadius: "0.75rem",
      padding: "2rem",
      width: "100%",
      color: "var(--ink)",
    },
    formButtonPrimary: {
      backgroundColor: "var(--accent)",
      fontSize: "0.8125rem",
      borderRadius: "0.5rem",
      height: "3rem",
      fontFamily: '"Space Mono", ui-monospace, monospace',
      textTransform: "uppercase",
      letterSpacing: "0.14em",
      fontWeight: "700",
      "&:hover": {
        backgroundColor: "var(--accent-hover)",
      },
    },
    formFieldInput: {
      backgroundColor: "var(--surface)",
      borderRadius: "0.5rem",
      border: "1px solid var(--line)",
      height: "3rem",
      color: "var(--ink)",
    },
    footer: {
      display: "none",
    },
    headerTitle: {
      fontSize: "1.25rem",
      fontWeight: "800",
      color: "var(--ink)",
    },
  },
};
