import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="relative">
      <div className="h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('https://pixabay.com/get/g5b331cd8451e945209fae4c19b27884275bc093ebcd47ecc22151f63e7c4e9a8dcd177479488097f5b8276191a72a072d92d2c09cc771943a90dcf1546a7196f_1280.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-4">
              Experience The Thrill of <span className="text-secondary">Royal Gaming</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Play the latest and most exciting casino games. Register now and claim your welcome bonus!
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {!user ? (
                <Link href="/auth?tab=register">
                  <Button className="w-full sm:w-auto px-6 py-6 text-lg font-medium rounded-lg gold-gradient hover:opacity-90 transition duration-300">
                    Get Started
                  </Button>
                </Link>
              ) : (
                <Link href="/games">
                  <Button className="w-full sm:w-auto px-6 py-6 text-lg font-medium rounded-lg gold-gradient hover:opacity-90 transition duration-300">
                    Play Now
                  </Button>
                </Link>
              )}
              <Link href="/games">
                <Button variant="outline" className="w-full sm:w-auto px-6 py-6 text-lg font-medium rounded-lg bg-muted hover:bg-card transition duration-300">
                  Explore Games
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
