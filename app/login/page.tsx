import FormWrap from "@/components/auth/form-wrap";
import LoginForm from "@/components/auth/login-form";
import Container from "@/components/shared/container";
import { getCurrentUser } from "@/lib/actions/session";

const LoginPage = async () => {
  const user = await getCurrentUser();

  return (
    <Container>
      <FormWrap>
        <LoginForm user={user} />
      </FormWrap>
    </Container>
  );
};

export default LoginPage;
