"use client";

import { usePathname, useSearchParams } from "next/navigation";

import Container from "@/components/shared/container";
import { categories } from "@/lib/utils";
import Category from "@/components/ui/category";
import { useMemo } from "react";

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathName = usePathname();

  const isMainPage = useMemo(() => pathName === "/", [pathName]);

  if (!isMainPage) return null;

  return (
    <div className="bg-white">
      <Container>
        <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
          {categories.map((cat) => (
            <Category
              key={cat.label}
              label={cat.label}
              icon={cat.icon}
              selected={
                category === cat.label ||
                (category === null && cat.label === "All")
              }
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Categories;
