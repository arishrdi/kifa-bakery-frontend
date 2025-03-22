"use client";

import { useState, useEffect, ReactNode } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function IsClientComponent({
  children,
}: {
  children: ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient) {
    return (
      <div>
        {/* <ProgressBar
          height="4px"
          color="rgb(249 115 22)"
          options={{ showSpinner: false }}
          shallowRouting
        /> */}
        {children}
      </div>
    );
  }
}
