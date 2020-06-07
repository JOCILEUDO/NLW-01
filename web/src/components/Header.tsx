import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header>
      <h2>{props.title}</h2>
    </header>
  )
}

export default Header;