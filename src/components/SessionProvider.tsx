"use client";
import { Session } from "next-auth";
import { SessionProvider, getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";

export default function SessionProviderClient({
  session,
  children,
}: {
  session: Session | null;
  children: ReactNode;
}) {
  useEffect(() => {
    (async function () {
      try {
        const session1 = await getSession();
        if (!session1) {
          window.location.replace("/api/auth/signin");
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
