/* eslint-disable no-useless-return */
"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

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
import { getSubspecialties } from "@/lib/utils";
import { UploadButton } from "@/lib/uploadthing";

interface ProfileFormProps {
  clerkId: string;
  user: string;
  isOnboarding?: boolean;
}

const ProfileForm = ({
  clerkId,
  user,
  isOnboarding = false,
}: ProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubspecialties, setShowSubspecialties] = useState(false);
  const [subspecialties, setSubspecialties] = useState<SelectOption[]>([]);

  const router = useRouter();
  const pathname = usePathname();

  const parsedUser = JSON.parse(user);

  const inputClasses = isOnboarding
    ? "no-focus"
    : "no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border";

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      salutation: parsedUser?.salutation || "",
      firstName: parsedUser?.firstName || "",
      surname: parsedUser?.surname || "",
      trust: parsedUser?.trust || "",
      specialty: parsedUser?.specialty || "",
      subspecialty: parsedUser?.subspecialty || "",
      website: parsedUser?.website || "",
      location: parsedUser?.location || "",
      bio: parsedUser?.bio || "",
      picture: parsedUser?.picture || "",
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
      fullName: `${values.salutation} ${values.firstName} ${values.surname}`,
      trust: values.trust,
      specialty: values.specialty,
      // make empty string if change to specialty without subspecialty otherwise prev value will remain
      subspecialty: specialtiesWithSubspecialties.includes(currentSpecialty)
        ? values.subspecialty
        : "",
      location: values.location,
      website: values.website,
      bio: values.bio,
      picture: values.picture,
      isOnboarded: true,
    };

    try {
      await updateUser({ clerkId, updateData, path: pathname });

      if (pathname === "/profile/edit") {
        router.back();
      } else {
        router.push("/");
      }
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
          name="picture"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile picture"
                    width={140}
                    height={140}
                    priority
                    className="rounded-full object-cover"
                  />
                ) : (
                  // TODO: replace default image
                  <Image
                    src="/assets/images/default-profile-picture.png"
                    alt="profile picture"
                    width={140}
                    height={140}
                    className="rounded-full object-cover"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    form.setValue("picture", res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  isOnboarding={isOnboarding}
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
                <Input className={inputClasses} {...field} />
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
                <Input className={inputClasses} {...field} />
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
                <SelectInput
                  name="trust"
                  options={trusts}
                  field={field}
                  isOnboarding={isOnboarding}
                />
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
                  isOnboarding={isOnboarding}
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
                    isOnboarding={isOnboarding}
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
                <Input type="url" className={inputClasses} {...field} />
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
                <Input className={inputClasses} {...field} />
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
                  className={inputClasses}
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
