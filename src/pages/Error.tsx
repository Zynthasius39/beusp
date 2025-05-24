import { Box, Stack, Typography, styled } from "@mui/material";

interface ErrorProps {
  errorCode: number,
  errorText: string,
}

const ErrorTypography = styled(Typography, {
  name: 'ErrorTypograhpy',
  slot: 'root',
})(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: "bold",
}));

const Error = ({ errorCode, errorText }: ErrorProps) => {
  return (
    <Stack
      bgcolor='background.paper'
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Box
        component="img"
        sx={{
          width: {
            xs: "75vw",
            md: 512,
          },
          height: {
            xs: "75vw",
            md: 512,
          },
          p: 4,
          borderRadius: "25%",
        }}
        src="https://media1.tenor.com/m/iMcsJK3CkQgAAAAC/huh-huh-cat.gif"
        alt="not-found-cat"
      />
      <ErrorTypography
        variant="h1"
      >
        {errorCode}
      </ErrorTypography>
      <ErrorTypography
        variant="h2"
      >
        {errorText}
      </ErrorTypography>
    </Stack >
  );
};

export default Error;
