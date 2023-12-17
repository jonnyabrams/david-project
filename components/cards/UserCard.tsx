import Image from "next/image";
import Link from "next/link";

import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";
import { getTopTagsForUser } from "@/lib/actions/tag.action";

interface UserCardProps {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    salutation: string;
    firstName: string;
    surname: string;
    specialty: string;
    trust: string;
  };
}

const UserCard = async ({ user }: UserCardProps) => {
  const topTags = await getTopTagsForUser({ userId: user._id });

  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.picture}
          alt="user profile picture"
          width={100}
          height={100}
          className="rounded-full"
        />

        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.salutation || "Dr."} {user.firstName || "Placeholder"}{" "}
            {user.surname || "Name"}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            {user.specialty || "Specialty"} @{user.trust || "Trust"}
          </p>
        </div>

        <div className="mt-5">
          {topTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {topTags.map((tag) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
