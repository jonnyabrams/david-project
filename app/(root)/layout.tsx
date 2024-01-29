import React from "react";
import { Knock } from "@knocklabs/node";

import Navbar from "@/components/shared/navbar/Navbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import { currentUser } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const clerkUser = await currentUser();

  const dbUser = clerkUser ? await getUserById({ userId: clerkUser.id }) : null;

  const knockClient = new Knock(process.env.KNOCK_SECRET_API_KEY);

  // eslint-disable-next-line no-unused-vars
  const knockUser = dbUser
    ? await knockClient.users.identify(dbUser._id, {
        name: dbUser.fullName,
        firstName: dbUser.firstName,
        email: dbUser.email,
      })
    : null;

  // for production
  const knockToken = dbUser
    ? await Knock.signUserToken(dbUser._id, {
        signingKey: process.env.KNOCK_SIGNING_KEY,
        expiresInSeconds: 60 * 60,
      })
    : undefined;

  return (
    <main className="background-light850_dark100 relative max-xs:min-w-[29rem]">
      <Navbar knockToken={knockToken} />
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
