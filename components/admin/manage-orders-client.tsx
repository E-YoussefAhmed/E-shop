"use client";

import moment from "moment";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  MdAccessTimeFilled,
  MdDeliveryDining,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";

import { Order, User } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import Status from "@/components/shared/status";
import Heading from "@/components/shared/heading";
import ActionBtn from "@/components/shared/action-btn";
import { deliverOrder, dispatchOrder } from "@/lib/actions/order";

type ExtendedOrder = Order & {
  user: User;
};

const ManageOrdersClient = ({ orders }: { orders: ExtendedOrder[] }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  let rows: any = [];

  if (orders) {
    rows = orders.map((order) => {
      return {
        id: order.id,
        customer: order.user.name,
        amount: formatPrice(order.amount / 100),
        paymentStatus: order.status,
        deliveryStatus: order.deliveryStatus,
        date: moment(order.createdAt).fromNow(),
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "customer", headerName: "Customer Name", width: 130 },
    {
      field: "amount",
      headerName: "Amount (USD)",
      width: 130,
      renderCell(params) {
        return (
          <div className="font-bold text-slate-800">{params.row.amount}</div>
        );
      },
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 130,
      renderCell(params) {
        return (
          <div className="">
            {params.row.paymentStatus === "pending" ? (
              <Status
                text="pending"
                icon={MdAccessTimeFilled}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : params.row.paymentStatus === "completed" ? (
              <Status
                text="completed"
                icon={MdDone}
                bg="bg-purple-200"
                color="text-purple-700"
              />
            ) : null}
          </div>
        );
      },
    },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",
      width: 130,
      renderCell(params) {
        return (
          <div className="">
            {params.row.deliveryStatus === "pending" ? (
              <Status
                text="pending"
                icon={MdAccessTimeFilled}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : params.row.deliveryStatus === "dispatched" ? (
              <Status
                text="dispatched"
                icon={MdDeliveryDining}
                bg="bg-purple-200"
                color="text-purple-700"
              />
            ) : params.row.deliveryStatus === "delivered" ? (
              <Status
                text="delivered"
                icon={MdDone}
                bg="bg-purple-200"
                color="text-purple-700"
              />
            ) : null}
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      width: 130,
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell(params) {
        return (
          <div className="flex justify-between gap-4 w-full">
            <ActionBtn
              icon={MdDeliveryDining}
              onClick={() => handleDispatch(params.row.id)}
            />
            <ActionBtn
              icon={MdDone}
              onClick={() => handleDeliver(params.row.id)}
            />
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={() => router.push(`/order/${params.row.id}`)}
            />
          </div>
        );
      },
    },
  ];

  const handleDispatch = useCallback((id: string) => {
    startTransition(() => {
      dispatchOrder(id)
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

  const handleDeliver = useCallback((id: string) => {
    startTransition(() => {
      deliverOrder(id)
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

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Orders" center />
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

export default ManageOrdersClient;
