import Image from "next/image";

import { Button } from "../ui/button";
import Link from "next/link";

const Intro = () => {
  return (
    <>
      <div className="flex items-center justify-center gap-8">
        <div className="mt-4 flex flex-col items-center justify-center gap-10">
          <p className="h1-bold text-center dark:text-light-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </p>
          <p className="paragraph-regular text-center dark:text-light-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p className="paragraph-regular text-center dark:text-light-500">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/sign-up">
              <Button className="primary-gradient min-h-[46px] min-w-[115px] px-4 py-3 !text-light-900">
                Sign Up Now
              </Button>
            </Link>

            <Link href="/sign-in">
              <Button className="secondary-gradient min-h-[46px] min-w-[115px] px-4 py-3 !text-light-900">
                Log In
              </Button>
            </Link>
          </div>
        </div>
        <Image
          src="/assets/images/doctor.webp"
          alt="banner image"
          width={260}
          height={260}
          className="rounded-md"
        />
      </div>
      {/* <div className="float-right flex items-center gap-4">
        <p className="paragraph-medium dark:text-light-700">
          Already a member?
        </p>
        <Button className="secondary-gradient min-h-[36px] px-4 py-3 !text-light-900">
            Log In
          </Button>
      </div> */}
    </>
  );
};

export default Intro;
