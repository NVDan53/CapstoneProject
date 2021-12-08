import React, { useState, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";

function InstructorNav(props) {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    process.browser && setCurrentPath(window.location.pathname);
  }, [process.browser, window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link href="/instructor">
        <a
          className={clsx("nav-link", {
            active: currentPath === "/instructor",
          })}
        >
          Instructor dashboard
        </a>
      </Link>
      <Link href="/instructor/course/create">
        <a
          className={clsx(
            "nav-link",
            currentPath === "/instructor/course/create" && "active"
          )}
        >
          Course Create
        </a>
      </Link>
    </div>
  );
}

export default InstructorNav;
