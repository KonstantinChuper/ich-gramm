"use client";

import ProfileHeader from "@/components/ProfileHeader";
import Container from "@/components/Container";
import UserPostList from "@/components/UserPostList";
import { useParams } from "next/navigation";

export default function UserProfile() {
  const { userId } = useParams();

  return (
    <Container>
      <ProfileHeader userId={userId as string} />
      <UserPostList userId={userId as string} />
    </Container>
  );
}
