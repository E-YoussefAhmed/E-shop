import FormWrap from "@/components/auth/form-wrap";
import Container from "@/components/shared/container";
import { getCurrentUser } from "@/lib/actions/session";
import AddProductForm from "@/components/admin/add-product-form";
import NullData from "@/components/admin/null-data";

const AddProductsPage = async () => {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return <NullData title="Oops! Access Denied." />;
  }

  return (
    <div className="p-8">
      <Container>
        <FormWrap>
          <AddProductForm />
        </FormWrap>
      </Container>
    </div>
  );
};

export default AddProductsPage;
