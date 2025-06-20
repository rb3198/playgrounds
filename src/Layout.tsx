import React from "react";
import { Header } from "./components/Header";
import { Outlet } from "react-router";

type LayoutProps = {};

export const Layout: React.FC<LayoutProps> = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
