import { Box, Container, Paper } from '@mui/material';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <SignupForm />
        </Paper>
      </Container>
    </Box>
  );
}