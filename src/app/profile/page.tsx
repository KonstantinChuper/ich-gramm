import ProfileHeader from "@/components/ProfileHeader";
import Container from "@/components/Container";
import UserPostList from "@/components/UserPostList";

export default function Profile() {

  return (
    <Container>
      <ProfileHeader/>
      <UserPostList/>
    </Container>
  );
}
