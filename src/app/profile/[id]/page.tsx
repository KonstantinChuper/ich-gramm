"use client";

import { useParams } from "next/navigation";
import Container from "@/components/Container";
import ProfileHeader from "@/components/ProfileHeader";
import UserPostListById from "@/components/UserPostListById";

export default function UserProfile() {
  const params = useParams();
  const id = params.id as string;

  return (
    <Container maxWidth="850px" className="!mr-0">
      <ProfileHeader userId={id} />
      <UserPostListById userId={id} />
    </Container>
  );
}
