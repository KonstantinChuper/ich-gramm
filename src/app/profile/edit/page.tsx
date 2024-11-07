"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import ProfileBadge from "@/components/ProfileBadge";
import Spiner from "@/components/Spiner";
import useUser from "@/hooks/useUserAxios";
import { useRouter } from "next/navigation";
import WordCounter from "@/components/WordCounter";

export default function EditProfile() {
  const { user, isLoading, error, updateUser, userAvatar } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showNotFound, setShowNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
  });
  const maxWords = 150;
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        full_name: user.full_name || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user && !isLoading) {
        setShowNotFound(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [user, isLoading]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "bio" && value.length > maxWords) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Файл слишком большой. Максимальный размер 5MB");
        return;
      }
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (selectedFile) {
        formDataToSend.append("profile_image", selectedFile);
      }

      const success = await updateUser(formDataToSend);

      if (success) {
        if (previewImage) {
          URL.revokeObjectURL(previewImage);
        }
        router.push("/profile");
        router.refresh();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating profile:", error.message);
      } else {
        console.error("Unknown error occurred");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (error)
    return (
      <Container>
        <p className="pt-10">Error: {error}</p>
      </Container>
    );
  if (isLoading && !showNotFound)
    return (
      <Container maxWidth="750px">
        <Spiner />
      </Container>
    );
  if (showNotFound) return <Container>User not found</Container>;

  return (
    <Container maxWidth="750px">
      <form onSubmit={handleSubmit}>
        <p className="font-bold text-xl pt-12">Edit profile</p>
        <div className="mt-11 p-4 bg-inputColor rounded-[20px]">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <ProfileBadge maxWidth={56} src={previewImage || userAvatar} />
            </div>
            <div className="flex-grow min-w-0">
              <p className="font-bold break-words">{user?.username}</p>
              <p className="font-normal text-sm break-words">{user?.bio}</p>
            </div>
            <div className="flex-shrink-0">
              <label className="btn btn-primary px-4 py-2 whitespace-nowrap">
                New photo
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
        </div>
        <div className="pt-8">
          <p className="font-bold text-base">Username</p>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleTextChange}
            className="mt-[7px] p-3 border border-borderColor w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>
        <div className="pt-8">
          <p className="font-bold text-base">Full Name</p>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleTextChange}
            className="mt-[7px] p-3 border border-borderColor w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>
        <div className="pt-8 relative">
          <p className="font-bold text-base">About</p>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleTextChange}
            className="mt-[7px] p-3 border border-borderColor w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-none"
          />
          <WordCounter
            currentLength={formData.bio.length}
            maxLength={maxWords}
          />
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="btn btn-primary w-[268px] py-2 mt-[67px] mb-[124px]"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </form>
    </Container>
  );
}
