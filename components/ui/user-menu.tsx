"use client";

import Link from "next/link";
import { User } from "@prisma/client";
import { useCallback, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { signOut } from "next-auth/react";

import Avatar from "@/components/shared/avatar";
import MenuItem from "@/components/ui/menu-item";
import Backdrop from "@/components/ui/backdrop";

type props = Omit<User, "createdAt" | "updatedAt" | "emailVerified"> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

const UserMenu = ({ user }: { user: props | null }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      <div className="relative z-30">
        <div
          onClick={toggleOpen}
          className="p-2 border border-slate-400 flex flex-row items-center
        gap-1 rounded-full cursor-pointer hover:shadow-md transition text-slate-700"
        >
          <Avatar src={user?.image} />
          <AiFillCaretDown />
        </div>
        {isOpen && (
          <div
            className="absolute rounded-md shadow-md w-[170px] bg-white overflow-hidden
          right-0 top-12 text-sm flex flex-col cursor-pointer"
          >
            {user ? (
              <div>
                <Link href="/orders">
                  <MenuItem onClick={toggleOpen}>Your Orders</MenuItem>
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin">
                    <MenuItem onClick={toggleOpen}>Admin Dashboard</MenuItem>
                  </Link>
                )}
                <hr />
                <MenuItem
                  onClick={() => {
                    toggleOpen();
                    signOut();
                  }}
                >
                  Log Out
                </MenuItem>
              </div>
            ) : (
              <div>
                <Link href="/login">
                  <MenuItem onClick={toggleOpen}>Login</MenuItem>
                </Link>
                <Link href="/register">
                  <MenuItem onClick={toggleOpen}>Register</MenuItem>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      {isOpen ? <Backdrop onClick={toggleOpen} /> : null}
    </>
  );
};

export default UserMenu;
