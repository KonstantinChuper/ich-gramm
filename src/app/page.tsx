import Container from "@/components/HomeContainer";
import PostsList from "@/components/PostsList";

export default function Home() {
  return (
    <Container>
      <div className="pt-[50px] pl-[245px] my-auto">
        <PostsList />
      </div>
    </Container>
  );
}
