
import Link from 'next/link';
import { SignedIn } from '@clerk/nextjs';

import { formatLargeNumber, getTimestamp } from '@/lib/utils';
import Metric from '../shared/Metric';
import EditDeleteAction from '../shared/EditDeleteAction';

interface CommentCardProps {
  clerkId?: string | null;
  _id: string;
  post: {
    _id: string;
    title: string;
  };
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  numberOfLikes: number;
  createdAt: Date;
}
const CommentCard = ({
  clerkId,
  _id,
  post,
  author,
  numberOfLikes,
  createdAt
}: CommentCardProps) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] px-11 py-9">
      <Link href={`/post/${post._id}/#${_id}`}>
        <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
          <div>
            <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
              {getTimestamp(createdAt)}
            </span>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {post.title}
            </h3>
          </div>
          <SignedIn>
            {showActionButtons && (
              <EditDeleteAction type="Comment" itemId={JSON.stringify(_id)} />
            )}
          </SignedIn>
        </div>

        <div className="flex-between mt-6 w-full flex-wrap gap-3">
          <Metric
            imgUrl={author.picture}
            alt="user avatar"
            value={author.name}
            title={` • commented ${getTimestamp(createdAt)}`}
            href={`/profile/${author.clerkId}`}
            textStyles="body-medium text-dark400_light700"
            isAuthor
          />

          <div className="flex-center gap-3">
            <Metric
              imgUrl="/assets/icons/like.svg"
              alt="like icon"
              value={formatLargeNumber(numberOfLikes)}
              title=" Likes"
              textStyles="small-medium text-dark400_light800"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};
export default CommentCard;