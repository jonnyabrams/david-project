import { getUserComments } from "@/lib/actions/user.action";
import CommentCard from "../cards/CommentCard";
import Pagination from "./Pagination";

interface CommentsTabProps {
  userId: string;
  clerkId?: string | null;
  searchProps?: { [key: string]: string | undefined };
}

const CommentsTab = async ({
  searchProps,
  userId,
  clerkId,
}: CommentsTabProps) => {
  const result = await getUserComments({
    userId,
    page: searchProps?.page ? +searchProps.page : 1,
  });

  return (
    <>
      {result.comments.map((comment) => (
        <CommentCard
          key={comment._id}
          clerkId={clerkId}
          _id={comment._id}
          post={comment.post}
          author={comment.author}
          numberOfLikes={comment.likes.length}
          createdAt={comment.createdAt}
        />
      ))}

      <div className="mt-10">
        <Pagination
          pageNumber={searchProps?.page ? +searchProps.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default CommentsTab;
