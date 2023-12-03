import PostForm from "@/components/forms/PostForm";

const CreatePost = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900 ">Create a Post</h1>
      
      <div className="mt-9">
        <PostForm />
      </div>
    </div>
  );
};

export default CreatePost;
