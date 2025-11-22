import Feed from "@/components/Feed";

export default function Home() {
  return (
    <div className="md:flex">
      <div>
        <Feed
          label="Discover Branches"
          styleHead="mt-3"
          style="md:grid-cols-5  mt-4 gap-1.5 justify-between md:justify-start"
        />
      </div>
    </div>
  );
}
