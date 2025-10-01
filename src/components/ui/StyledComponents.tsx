import { styled } from "@storybook/theming";

export const PanelWrapper = styled.div(({ theme }) => ({
  background: theme.background.content,
  padding: "16px",
  height: "100%",
  overflow: "auto",
  boxSizing: "border-box",
}));

export const Header = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
});

export const Title = styled.h1({
  margin: 0,
  fontSize: "18px",
  fontWeight: 600,
});

export const ButtonGroup = styled.div({
  display: "flex",
  gap: "8px",
  alignItems: "center",
});

export const Badge = styled.span<{
  variant?: "warning" | "success" | "danger" | "secondary";
  customColor?: string;
}>(({ variant, customColor, theme }) => {
  if (customColor) {
    return {
      background: customColor,
      color: "white",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: 500,
    };
  }

  const colors = {
    warning: { bg: "#ff8400ff", color: "#212529" },
    success: { bg: "#28a745", color: "white" },
    danger: { bg: "#dc3545", color: "white" },
    secondary: { bg: "#6c757d", color: "white" },
  };

  const colorScheme = variant ? colors[variant] : colors.secondary;

  return {
    background: colorScheme.bg,
    color: colorScheme.color,
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 500,
  };
});

export const Button = styled.button<{
  variant: "primary" | "secondary";
  disabled?: boolean;
}>(({ variant, disabled }) => ({
  background: disabled
    ? "#6c757d"
    : variant === "primary"
      ? "#007bff"
      : "#6c757d",
  color: "white",
  border: "none",
  padding: "2px 8px",
  borderRadius: "4px",
  cursor: disabled ? "not-allowed" : "pointer",
  fontSize: "12px",
  fontWeight: 500,
  opacity: disabled ? 0.6 : 1,
}));

export const Input = styled.input({
  width: "100%",
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "14px",
  boxSizing: "border-box",
});

export const Select = styled.select({
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "14px",
});

export const Link = styled.a({
  color: "white",
});

export const GuidelineCardWrapper = styled.div(({ theme }) => ({
  border: `1px solid ${theme.color.border}`,
  borderRadius: "8px",
  marginBottom: "12px",
  padding: "16px",
  background: theme.background.content,
}));
