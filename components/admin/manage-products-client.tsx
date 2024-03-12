"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";

import { Product } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import Status from "@/components/shared/status";
import Heading from "@/components/shared/heading";
import ActionBtn from "@/components/shared/action-btn";
import { deleteProduct, updateProduct } from "@/lib/actions/product";
import { UploadedImageType } from "@/components/admin/add-product-form";

const ManageProductsClient = ({ products }: { products: Product[] }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  let rows: any = [];

  if (products) {
    rows = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        images: product.images,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Name", width: 220 },
    {
      field: "price",
      headerName: "Price (USD)",
      width: 100,
      renderCell(params) {
        return (
          <div className="font-bold text-slate-800">{params.row.price}</div>
        );
      },
    },
    { field: "category", headerName: "Category", width: 100 },
    { field: "brand", headerName: "Brand", width: 100 },
    {
      field: "inStock",
      headerName: "In Stock",
      width: 120,
      renderCell(params) {
        return (
          <div className="">
            {params.row.inStock === true ? (
              <Status
                text="in stock"
                icon={MdDone}
                bg="bg-teal-200"
                color="text-teal-700"
              />
            ) : (
              <Status
                text="out of stock"
                icon={MdClose}
                bg="bg-rose-200"
                color="text-rose-700"
              />
            )}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell(params) {
        return (
          <div className="flex justify-between gap-4 w-full">
            <ActionBtn
              icon={MdCached}
              onClick={() =>
                handleToggleStock(params.row.id, params.row.inStock)
              }
            />
            <ActionBtn
              icon={MdDelete}
              onClick={() => handleDelete(params.row.id, params.row.images)}
            />
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={() => router.push(`product/${params.row.id}`)}
            />
          </div>
        );
      },
    },
  ];

  const handleToggleStock = useCallback((id: string, inStock: boolean) => {
    startTransition(() => {
      updateProduct(id, !inStock)
        .then(({ error, success }) => {
          if (success) {
            toast.success(success);
          }
          if (error) {
            toast.error(error);
          }
        })
        .catch((err) => {
          toast.error("Oops! Something went wrong");
          console.log(err);
        });
    });
  }, []);

  const handleDelete = useCallback(
    (id: string, images: UploadedImageType[]) => {
      startTransition(() => {
        deleteProduct(id, images)
          .then(({ error, success }) => {
            if (success) {
              toast.success(success);
            }
            if (error) {
              toast.error(error);
            }
          })
          .catch((err) => {
            toast.error("Oops! Something went wrong");
            console.log(err);
          });
      });
    },
    []
  );

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Products" center />
      </div>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default ManageProductsClient;
