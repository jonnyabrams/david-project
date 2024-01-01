import { SignedIn, currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import MobileNav from "./MobileNav";
import Theme from "./Theme";
import { getUserById } from "@/lib/actions/user.action";

const Navbar = async () => {
  const user = await currentUser();

  const dbUser = user ? await getUserById({ userId: user.id }) : null;

  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex flex-1 items-center gap-2">
        <Image
          src="/assets/images/stethoscope.jpeg"
          width={36}
          height={36}
          alt="Share Our Best"
        />

        <p className="h2-bold mr-8 font-spaceGrotesk text-dark-100 dark:text-light-900 max-xs:hidden">
          ShareOur<span className="text-primary-500">Best</span>
        </p>
      </Link>

      <div className="flex-between gap-5">
        <Theme />
        <SignedIn>
          {/* <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          /> */}
          <Link href={`/profile/${user?.id}`}>
          <Image
            src={dbUser.picture}
            width={36}
            height={36}
            className="rounded-full"
            alt="profile"
          />
          </Link>
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
