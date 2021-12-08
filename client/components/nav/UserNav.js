import Link from "next/link";
import React, { useState, useEffect } from "react";
import clsx from "clsx";

function UserNav(props) {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    process.browser && setCurrentPath(window.location.pathname);
  }, [process.browser, window.location.pathname]);
  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link href="/user">
        <a
          className={clsx("nav-link", {
            active: currentPath === "/user",
          })}
        >
          User Dashboard
        </a>
      </Link>
    </div>
  );
}

export default UserNav;
