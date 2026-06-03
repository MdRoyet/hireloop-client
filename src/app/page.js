import Banner from "@/components/Banner"; // Adjust the import path if needed

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Banner Section */}
      <Banner />

      {/* Other future homepage sections (like "Recent Jobs") will go here */}
    </div>
  );
}
