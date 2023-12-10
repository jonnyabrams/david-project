import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ITag } from "@/models/tag.model";

interface RenderTagsProps {
  tag: ITag;
  showCount?: boolean;
}

const RenderTag = ({ tag, showCount }: RenderTagsProps) => {
  return (
    <Link href={`/tags/${tag._id}`} className="flex justify-between gap-2">
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        {tag.name}
      </Badge>

      {showCount && <p className="small-medium text-dark500_light700">{tag.posts?.length}</p>}
    </Link>
  );
};

export default RenderTag;
