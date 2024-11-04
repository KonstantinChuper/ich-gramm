"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import ProfileBadge from "@/components/ProfileBadge";
import Spiner from "@/components/Spiner";
import useUser from "@/hooks/useUser";

export default function EditProfile() {
  const { user, isLoading, error, updateUser } = useUser();
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
      setSelectedFile(file); // сохраняем File объект
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
        if (value) {
          formDataToSend.append(key, value);
        } else {
          console.warn(`Field ${key} is empty and will not be sent.`);
        }
      });

      if (selectedFile) {
        formDataToSend.append("profile_image", selectedFile);
      }

      await updateUser(formDataToSend);
    } catch (error) {
      console.error("Failed to update profile:", error);
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
        <div className="mt-11 p-4 bg-inputColor rounded-[20px] flex justify-between">
          <div className="flex gap-4">
            <ProfileBadge maxWidth={56} src={previewImage || user?.profile_image} />
            <div className="flex">
              <p className="font-bold">{user?.username}</p>
              <p className="font-normal text-sm">{user?.bio}</p>
            </div>
          </div>
          <label className="btn btn-primary px-4 py-2 self-center">
            New photo{" "}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
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
          <p className="text-sm text-gray-500 absolute bottom-3 right-4">
            {formData.bio.length}/{maxWords}
          </p>
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
