import React from "react";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <nav className="flex fixed items-center p-4 md:p-8 z-40">
      <h1 className="font-display text-4xl font-bold">RB</h1>
    </nav>
  );
};
