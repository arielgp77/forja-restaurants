"use client";

import { useState } from "react";
import type { MenuPageVM } from "../../lib/menu/types";
import { PublicHeader } from "../public/PublicHeader";
import { MenuExperience } from "./MenuExperience";

interface MenuClientShellProps {
  vm: MenuPageVM;
}

export function MenuClientShell({ vm }: MenuClientShellProps) {
  const [cartCount, setCartCount] = useState(0);

  return (
    <>
      <PublicHeader
        restaurantName={vm.restaurantName}
        menuHref={`/r/${vm.slug}/menu`}
        cartHref={`/r/${vm.slug}/checkout`}
        cartCount={cartCount}
      />
      <MenuExperience
        vm={vm}
        onCartSummaryChange={({ totalUnits }) => setCartCount(totalUnits)}
      />
    </>
  );
}
