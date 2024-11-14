import ProfileHeader from "@/components/ProfileHeader";
import Container from "@/components/Container";
import UserPostList from "@/components/UserPostList";

export default function Profile() {

  return (
    <Container maxWidth="850px" className="!mr-0">
      <ProfileHeader />
      <UserPostList />
    </Container>
  );
}
