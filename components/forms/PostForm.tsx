"use client";

import { useRef, useCallback, useState, ChangeEvent } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ReactTags } from "react-tag-autocomplete";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PostSchema } from "@/lib/validations";
import tagSuggestions from "@/constants/tagSuggestions";
import "@/styles/tags.css";
import { createPost, editPost } from "@/lib/actions/post.action";
import { useTheme } from "@/context/ThemeProvider";
import { ITag } from "@/models/tag.model";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";

interface PostFormProps {
  type?: string;
  dbUserId: string;
  postDetails?: string;
}

const PostForm = ({ type, dbUserId, postDetails }: PostFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tooManyTags, setTooManyTags] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const { mode } = useTheme();

  const editorRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const parsedPostDetails = postDetails && JSON.parse(postDetails || "");

  const groupedTags = parsedPostDetails?.tags.map((tag: ITag) => ({
    value: tag.name,
    label: tag.name,
  }));

  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: parsedPostDetails?.title || "",
      content: parsedPostDetails?.content || "",
      tags: groupedTags || [],
    },
  });

  const onAddTag = useCallback(
    (newTag: any) => {
      if (form.getValues().tags.length < 3) {
        form.setValue("tags", [...form.getValues().tags, newTag]);
      } else {
        setTooManyTags(true);
      }
    },
    [form]
  );

  const onDeleteTag = useCallback(
    (tagIndex: number) => {
      if (form.getValues().tags.length === 3) {
        setTooManyTags(false);
      }

      const updatedTags = form
        .getValues()
        .tags.filter((_, i) => i !== tagIndex);

      form.setValue("tags", updatedTags);
    },
    [form]
  );

  const handleImages = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setImages(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";

        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof PostSchema>) => {
    setIsSubmitting(true);

    const blob = values.picture;
    const imageHasChanged = isBase64Image(blob as string);

    if (imageHasChanged) {
      const imgRes = await startUpload(images);

      if (imgRes && imgRes[0].url) {
        values.picture = imgRes[0].url;
      }
    }

    try {
      if (type === "edit") {
        await editPost({
          postId: parsedPostDetails?._id,
          title: values.title,
          content: values.content,
          picture: values.picture,
          path: pathname,
        });

        router.push(`/post/${parsedPostDetails?._id}`);
      } else {
        await createPost({
          title: values.title,
          content: values.content,
          tags: values.tags,
          author: JSON.parse(dbUserId),
          picture: values.picture,
          path: pathname,
        });

        router.push("/");
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Use a title that offers a helpful summary of the post&apos;s
                content
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Content <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  // @ts-ignore
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue={parsedPostDetails?.content || ""}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style: "body { font-family:Inter; font-size:16px }",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode === "dark" ? "dark" : "light",
                  }}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="picture"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="post image"
                    width={140}
                    height={140}
                    priority
                    className="object-cover"
                  />
                ) : (
                  // TODO: replace default image
                  <Image
                    src="/assets/icons/camera.svg"
                    alt="profile picture"
                    width={140}
                    height={140}
                    className="object-cover"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  onChange={(e) => handleImages(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags
              </FormLabel>
              <FormControl className="mt-3.5">
                <ReactTags
                  selected={form.getValues().tags}
                  suggestions={tagSuggestions}
                  onAdd={onAddTag}
                  onDelete={onDeleteTag}
                  allowBackspace
                  collapseOnSelect
                  noOptionsText="No matching tags"
                  labelText=""
                  isDisabled={type === "edit"}
                  classNames={{
                    root: "react-tags background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border",
                    rootIsActive: "is-active",
                    rootIsDisabled: "is-disabled",
                    rootIsInvalid: "is-invalid",
                    label: "react-tags__label",
                    tagList: "react-tags__list",
                    tagListItem: "react-tags__list-item",
                    tag: "react-tags__tag",
                    tagName: "react-tags__tag-name",
                    comboBox: "react-tags__combobox",
                    input: "react-tags__combobox-input",
                    listBox: "react-tags__listbox",
                    option: "react-tags__listbox-option",
                    optionIsActive: "is-active",
                    highlight: "react-tags__listbox-option-highlight",
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                {tooManyTags ? (
                  <span className="text-red-500">
                    Maximum of 3 tags allowed!
                  </span>
                ) : type === "edit" ? (
                  "You cannot edit tags"
                ) : (
                  "Add up to 3 relevant tags"
                )}
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient w-fit !text-light-900"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === "edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <>{type === "edit" ? "Edit Post" : "Submit Post"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PostForm;
