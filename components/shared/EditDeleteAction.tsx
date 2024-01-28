"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deletePost } from "@/lib/actions/post.action";
import { deleteComment } from "@/lib/actions/comment.action";

interface EditDeleteActionProps {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: EditDeleteActionProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/post/edit/${JSON.parse(itemId)}`);
  };

  const handleDelete = async () => {
    if (type === "Post") {
      await deletePost({ postId: JSON.parse(itemId), path: pathname });
    } else if (type === "Comment") {
      await deleteComment({ commentId: JSON.parse(itemId), path: pathname });
    }
  };
  return (
    <div className="flex items-center justify-start gap-3">
      {type === "Post" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <Image
        src="/assets/icons/trash.svg"
        alt="delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
