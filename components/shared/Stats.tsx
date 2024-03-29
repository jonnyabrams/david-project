import { formatLargeNumber } from "@/lib/utils";
import Link from "next/link";

interface StatsProps {
  totalPosts: number;
  totalComments: number;
  totalFollowers: number;
  totalFollowing: number;
}

const Stats = ({
  totalPosts,
  totalComments,
  totalFollowers,
  totalFollowing,
}: StatsProps) => {
  return (
    <div className="mt-5 grid grid-cols-2 gap-4">
      <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
        <div>
          <p className="paragraph-semibold text-dark200_light900">
            {formatLargeNumber(totalPosts)}
          </p>
          <p className="body-medium text-dark400_light700">Posts</p>
        </div>
        <div>
          <p className="paragraph-semibold text-dark200_light900">
            {formatLargeNumber(totalComments)}
          </p>
          <p className="body-medium text-dark400_light700">Comments</p>
        </div>
      </div>

      <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
        <Link href="/follows?type=followers">
          <p className="paragraph-semibold text-primary-500">
            {formatLargeNumber(totalFollowers)}
          </p>
          <p className="body-medium text-dark400_light700">Followers</p>
        </Link>
        <Link href="/follows?type=following">
          <p className="paragraph-semibold text-primary-500">
            {formatLargeNumber(totalFollowing)}
          </p>
          <p className="body-medium text-dark400_light700">Following</p>
        </Link>
      </div>
    </div>
  );
};

export default Stats;
