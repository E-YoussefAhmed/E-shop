import Link from "next/link";
import { Redressed } from "next/font/google";

import { getCurrentUser } from "@/lib/actions/session";
import CartCount from "@/components/shared/cart-count";
import Container from "@/components/shared/container";
import UserMenu from "@/components/ui/user-menu";
import Categories from "@/components/ui/categories";
import SearchBar from "@/components/ui/search-bar";

const redressed = Redressed({ subsets: ["latin"], weight: ["400"] });

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <div className="sticky top-0 w-full bg-slate-200 z-30 shadow-sm">
      <div className="py-4 border-b">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            <Link
              href="/"
              className={`${redressed.className} font-bold text-2xl`}
            >
              E-Shop
            </Link>

            <div className="hidden md:block">
              <SearchBar />
            </div>

            <div className="flex items-center gap-8 md:gap-12">
              <CartCount />
              <UserMenu user={user} />
            </div>
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
