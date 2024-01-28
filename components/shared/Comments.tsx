import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";

import Filter from "./Filter";
import { CommentFilters } from "@/constants/filters";
import { getComments } from "@/lib/actions/comment.action";
import { getTimestamp } from "@/lib/utils";
import Likes from "./Likes";
import Pagination from "./Pagination";

interface CommentsProps {
  postId: string;
  userId: string;
  numberOfComments: number;
  page?: string;
  filter?: string;
}

const Comments = async ({
  postId,
  userId,
  numberOfComments,
  filter,
  page,
}: CommentsProps) => {
  const result = await getComments({ postId, filter, page: page ? +page : 1 });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {numberOfComments} comment{numberOfComments !== 1 && "s"}
        </h3>

        <Filter filters={CommentFilters} />
      </div>

      <div>
        {result.comments.map((comment) => (
          <article key={comment._id} className="light-border border-b py-10">
            <div className="flex items-center justify-between">
              <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${comment.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={comment.author.picture}
                    width={18}
                    height={18}
                    alt="profile picture"
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">{`${comment.author.salutation} ${comment.author.firstName} ${comment.author.surname} `}</p>
                    <p className="small-regular text-light400_light500 ml-1 mt-0.5 line-clamp-1">
                      commented {getTimestamp(comment.createdAt)}
                    </p>
                  </div>
                </Link>

                <div className="flex justify-end">
                  <Likes
                    type="Comment"
                    itemId={JSON.stringify(comment._id)}
                    userId={JSON.stringify(userId)}
                    numberOfLikes={comment.likes.length}
                    userHasAlreadyLiked={comment.likes.includes(userId)}
                  />
                </div>
              </div>
            </div>

            <div className="text-dark200_light900">
              {parse(comment.content)}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <Pagination pageNumber={page ? +page : 1} isNext={result.isNext} />
      </div>
    </div>
  );
};

export default Comments;
