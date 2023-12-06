"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCallback, useState } from "react";
import { ReactTags } from "react-tag-autocomplete";

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
import { Textarea } from "@/components/ui/textarea";

import { PostSchema } from "@/lib/validations";
import tagSuggestions from "@/constants/tagSuggestions";
import "@/styles/tags.css";

const PostForm = () => {
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [tooManyTags, setTooManyTags] = useState(false);

  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  console.log(form.getValues().tags);

  const onAddTag = useCallback(
    (newTag: any) => {
      if (selectedTags.length < 3) {
        form.setValue("tags", [...form.getValues().tags, newTag]);
        setSelectedTags([...selectedTags, newTag]);
      } else {
        setTooManyTags(true);
      }
    },
    [form, selectedTags]
  );

  const onDeleteTag = useCallback(
    (tagIndex: number) => {
      if (selectedTags.length === 3) {
        setTooManyTags(false);
      }

      const updatedTags = form
        .getValues()
        .tags.filter((_, i) => i !== tagIndex);

      form.setValue("tags", updatedTags);
      setSelectedTags(updatedTags);
    },
    [form, selectedTags]
  );

  const onSubmit = (values: z.infer<typeof PostSchema>) => {
    console.log(values);
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
                <Textarea
                  placeholder="Share your best..."
                  className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[126px] border"
                  {...field}
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
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <ReactTags
                  selected={selectedTags}
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default PostForm;
