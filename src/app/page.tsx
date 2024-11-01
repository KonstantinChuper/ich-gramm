import Post from "@/components/Post";
import Container from "@/components/Container";
import NoMorePostsBanner from "@/components/NoMorePostsBanner";

export default function Home() {
  return (
    <Container>
      <div className="pt-[50px] pl-[245px] my-auto">
        <div className="gap-16 flex-nowrap grid grid-cols-1 lg:grid-cols-2 ">
          <Post />
          <Post />
        </div>
        <NoMorePostsBanner />
      </div>
    </Container>
  );
}
