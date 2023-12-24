"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { ProfileSchema } from "@/lib/validations";
import { updateUser } from "@/lib/actions/user.action";
import { salutations } from "@/constants";
import SelectInput from "../shared/SelectInput";
import trusts from "@/constants/trusts";
import {
  specialties,
  specialtiesWithSubspecialties,
} from "@/constants/specialties";
import { SelectOption } from "@/types";
import getSubspecialties from "@/lib/utils";

interface ProfileFormProps {
  clerkId: string;
  user: string;
}

const ProfileForm = ({ clerkId, user }: ProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubspecialties, setShowSubspecialties] = useState(false);
  const [subspecialties, setSubspecialties] = useState<SelectOption[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const parsedUser = JSON.parse(user);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      salutation: parsedUser.salutation || "",
      firstName: parsedUser.firstName || "",
      surname: parsedUser.surname || "",
      trust: parsedUser.trust || "",
      specialty: parsedUser.specialty || "",
      subspecialty: parsedUser.subspecialty || "",
      website: parsedUser.website || "",
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
    },
  });

  const currentSpecialty = form.watch("specialty");

  useEffect(() => {
    getSubspecialties(
      currentSpecialty,
      setShowSubspecialties,
      setSubspecialties
    );
  }, [currentSpecialty]);

  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    setIsSubmitting(true);

    const updateData = {
      salutation: values.salutation,
      firstName: values.firstName,
      surname: values.surname,
      trust: values.trust,
      specialty: values.specialty,
      // make empty string if change to specialty without subspecialty otherwise prev value will remain
      subspecialty: specialtiesWithSubspecialties.includes(currentSpecialty)
        ? values.subspecialty
        : "",
      location: values.location,
      website: values.website,
      bio: values.bio,
    };

    try {
      await updateUser({ clerkId, updateData, path: pathname });

      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-9 flex w-full flex-col gap-9"
      >
        <FormField
          control={form.control}
          name="salutation"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>Salutation</FormLabel>
              <FormControl>
                <SelectInput
                  name="salutation"
                  options={salutations}
                  field={field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>
                First name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>
                Surname <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="trust"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>Trust</FormLabel>
              <FormControl>
                <SelectInput name="trust" options={trusts} field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>Specialty</FormLabel>
              <FormControl>
                <SelectInput
                  name="specialty"
                  options={specialties}
                  field={field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {showSubspecialties && (
          <FormField
            control={form.control}
            name="subspecialty"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>Subspecialty</FormLabel>
                <FormControl>
                  <SelectInput
                    name="subspecialty"
                    options={subspecialties}
                    field={field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  rows={7}
                  placeholder="Tell us about yourself..."
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-7 flex justify-end">
          <Button
            className="primary-gradient w-fit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
