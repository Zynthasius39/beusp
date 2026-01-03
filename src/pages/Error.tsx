import { Box, Stack, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Snowflakes } from "../components/Snowflakes";

interface ErrorProps {
  errorCode: number,
}

const ErrorTypography = styled(Typography, {
  name: 'ErrorTypograhpy',
  slot: 'root',
})(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: "bold",
}));

const Error = ({ errorCode }: ErrorProps) => {
  const { t } = useTranslation();

  let errorText: string | null = t(errorCode.toString());
  if (errorText === errorCode.toString())
    errorText = null;

  return (
    <Stack
      id="login-root"
      alignItems="center"
      justifyContent="center"
      height="100%"
      sx={{
        color: "primary.contrastText",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Snowflakes />
      <Stack
        p="45px"
        gap="15px"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "background.default",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 50px 0 rgba(0, 0, 0, 0.2)",
          borderRadius: 4,
        }}
      >
        <Box
          component="img"
          sx={{
            width: {
              xs: "45vw",
              sm: "16rem",
            },
            height: {
              xs: "45vw",
              sm: "16rem",
            },
            borderRadius: 4,
          }}
          src="https://media1.tenor.com/m/iMcsJK3CkQgAAAAC/huh-huh-cat.gif"
          alt="not-found-cat"
        />
        <ErrorTypography
          variant="h2"
        >
          {errorCode}
        </ErrorTypography>
        {errorText &&
          <ErrorTypography
            variant="h3"
          >
            {t(errorText)}
          </ErrorTypography>
        }
      </Stack >
    </Stack>
  );
};

export default Error;
