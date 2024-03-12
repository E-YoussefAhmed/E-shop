import FormWrap from "@/components/auth/form-wrap";
import Container from "@/components/shared/container";
import RegisterForm from "@/components/auth/register-form";
import { getCurrentUser } from "@/lib/actions/session";

const RegisterPage = async () => {
  const user = await getCurrentUser();

  return (
    <Container>
      <FormWrap>
        <RegisterForm user={user} />
      </FormWrap>
    </Container>
  );
};

export default RegisterPage;
