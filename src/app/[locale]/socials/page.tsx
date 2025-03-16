import { getSocialLinks } from "@/db/supabase";
import SocialMediaCard from "@/components/social/social-media-card";

export default async function Socials() {
  const socials = await getSocialLinks();

  return (
    <div className="container mx-auto min-h-screen pt-10 text-white">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {socials.map((social) => (
          <SocialMediaCard key={social.social_media} social={social} />
        ))}
      </div>
    </div>
  );
}
