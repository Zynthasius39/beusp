import { Button, styled } from "@mui/material";

export const ResponsiveButton = styled(Button)(({ theme }) => ({
  // ✅ static styles
  backgroundColor: "white",
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,

  // ✅ responsive styles
  ...theme.unstable_sx({
    fontSize: { xs: '12px', sm: '14px' },
    padding: { xs: '6px 12px', sm: '8px 16px' },
  }),
}));