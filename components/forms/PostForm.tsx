"use client";

import { useRef, useCallback, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ReactTags } from "react-tag-autocomplete";
import { useRouter, usePathname } from "next/navigation";

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
import { createPost } from "@/lib/actions/post.action";
import { useTheme } from "@/context/ThemeProvider";

const type: any = "create";

interface PostFormProps {
  dbUserId: string;
}

const PostForm = ({ dbUserId }: PostFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tooManyTags, setTooManyTags] = useState(false);

  const { mode } = useTheme();

  const editorRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
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

  const onSubmit = async (values: z.infer<typeof PostSchema>) => {
    setIsSubmitting(true);

    try {
      await createPost({
        title: values.title,
        content: values.content,
        tags: values.tags,
        author: JSON.parse(dbUserId),
        path: pathname,
      });

      router.push("/");
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
                  initialValue=""
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
