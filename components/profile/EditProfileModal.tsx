import { useUpdateUser } from "@/hooks/user/useUpdateUserData";
import { UserProfile } from "@/types/User";
import React, { useState } from "react";
import { toast } from "sonner";
import { Modal } from "../ui/modal";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useCheckUsername } from "@/hooks/user/useCheckUsername";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface Props {
  user: UserProfile;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfileModal = ({
  user,
  isEditProfileOpen,
  setIsEditProfileOpen,
}: Props) => {
  const router = useRouter();

  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  const [formFields, setFormFields] = useState({
    fullName: user.fullname,
    username: user.username,
    bio: user.bio,
  });

  const usernameDebounce = useDebounce(formFields.username);
  const { data, isLoading: isCheckingUsername } =
    useCheckUsername(usernameDebounce);

  // Track if username has changed from original
  const isUsernameChanged = formFields.username !== user.username;
  const isUsernameValid = !isUsernameChanged || data?.status === "success";
  const showUsernameError = isUsernameChanged && data?.status === "error";
  const showUsernameSuccess = isUsernameChanged && data?.status === "success";
  const showUsernameLoading = isUsernameChanged && isCheckingUsername;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if username is invalid
    if (!isUsernameValid) {
      toast.error("Please fix the username before submitting");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9._]{1,20}$/;

    if (!usernameRegex.test(formFields.username)) {
      toast.error("Username must only contain letters, numbers, '.' and '_'");
      return;
    }

    try {
      const body = {
        username: user.username,
        payload: {
          newUsername: formFields.username,
          fullName: formFields.fullName,
          bio: formFields.bio,
        },
      };

      await updateUser(body);
      toast.success("Your Data is updated successfully");
      setIsEditProfileOpen(false);
      router.replace(`/profile/${formFields.username}`);
    } catch (error) {
      toast.error("Something went wrong, please try again");
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isEditProfileOpen}
      onClose={() => setIsEditProfileOpen(false)}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto mt-10 p-6 rounded-xl shadow space-y-6"
      >
        <div className="space-y-2">
          <label className="block font-medium">
            Username <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              name="username"
              value={formFields.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${
                showUsernameError
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : showUsernameSuccess
                  ? "border-green-500 focus:ring-green-500 focus:border-green-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              required
            />
            {showUsernameLoading && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
              </div>
            )}
          </div>

          {/* Username validation feedback */}
          {showUsernameError && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {data?.message}
            </p>
          )}

          {showUsernameSuccess && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {data?.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="fullName"
            value={formFields.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">
            Bio <span className="text-red-500">*</span>
          </label>
          <input
            name="bio"
            value={formFields.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            type="button"
            onClick={() => setIsEditProfileOpen(false)}
            className="flex-1 px-4 py-2 rounded-lg"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={!isUsernameValid || isCheckingUsername}
            className={`flex-1 px-4 py-2 rounded-lg font-medium`}
            isLoading={isPending}
          >
            {isCheckingUsername ? "Checking..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
