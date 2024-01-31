import React from "react";
import { Knock } from "@knocklabs/node";

import Navbar from "@/components/shared/navbar/Navbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import useCurrentUser from "@/hooks/useCurrentUser";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser  = await useCurrentUser();

  const knockClient = new Knock(process.env.KNOCK_SECRET_API_KEY);

  // eslint-disable-next-line no-unused-vars
  const knockUser = currentUser
    ? await knockClient.users.identify(currentUser._id.toString(), {
        name: currentUser.fullName,
        firstName: currentUser.firstName,
        email: currentUser.email,
      })
    : null;

  // for production
  const knockToken = currentUser
    ? await Knock.signUserToken(currentUser._id.toString(), {
        signingKey: process.env.KNOCK_SIGNING_KEY,
        expiresInSeconds: 60 * 60,
      })
    : undefined;

  return (
    <main className="background-light850_dark100 relative max-xs:min-w-[29rem]">
      <Navbar currentUser={currentUser} knockToken={knockToken} />
      <div className="flex">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RightSidebar />
      </div>
      Toaster
    </main>
  );
};

export default Layout;
