"use client";

import ProfileHeader from "@/components/ProfileHeader";
import Container from "@/components/Container";
import UserPostListById from "@/components/UserPostListById";
import { useParams } from "next/navigation";

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
