import { SignOutButton, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import MobileNav from "./MobileNav";
import Theme from "./Theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationMenu from "./NotificationMenu";
import { IUser } from "@/models/user.model";

interface NavbarProps {
  currentUser: IUser;
  knockToken: string | undefined;
}

const Navbar = async ({ currentUser, knockToken }: NavbarProps) => {
  const dropdownMenuItemStyles =
    "cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400";

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
        {currentUser && knockToken && (
          <div className="mr-2">
            <NotificationMenu
              userId={currentUser._id.toString()}
              knockToken={knockToken}
              apiKey={process.env.KNOCK_PUBLIC_API_KEY!}
              feedChannelId={process.env.KNOCK_FEED_CHANNEL_ID!}
            />
          </div>
        )}
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
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Image
                src={
                  currentUser?.picture || "/assets/images/default-profile-picture.png"
                }
                width={36}
                height={36}
                className="rounded-full"
                alt="profile"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-dark500_light700 small-regular border-none bg-light-900 focus:outline-none active:outline-none dark:bg-dark-300">
              <DropdownMenuLabel>{currentUser?.fullName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className={dropdownMenuItemStyles}>
                <Link href={`/profile/${currentUser?.clerkId}`}>Your Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator>
                {" "}
                <div className="h-[1px] bg-light-700/50 dark:bg-gray-100 dark:opacity-25" />
              </DropdownMenuSeparator>
              <DropdownMenuItem className={dropdownMenuItemStyles}>
                <SignOutButton>Sign Out</SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <Link href={`/profile/${user?.id}`}>
            <Image
              src={dbUser.picture}
              width={36}
              height={36}
              className="rounded-full"
              alt="profile"
            />
          </Link> */}
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
