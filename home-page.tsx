import { useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import GameList from "@/components/game-card";
import PaymentMethods from "@/components/payment-methods";
import Testimonials from "@/components/testimonials";
import BrandAmbassador from "@/components/brand-ambassador";
import { useQuery } from "@tanstack/react-query";
import { Game } from "@shared/schema";
import { Helmet } from "react-helmet";

export default function HomePage() {
  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>BetRoyal - Premium Online Casino</title>
        <meta name="description" content="Experience the thrill of online casino gaming with BetRoyal. Play the latest and most exciting casino games with generous bonuses and secure deposits." />
        <meta property="og:title" content="BetRoyal - Premium Online Casino" />
        <meta property="og:description" content="Experience the thrill of online casino gaming with BetRoyal. Play the latest and most exciting casino games with generous bonuses and secure deposits." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <section id="games" className="py-16 bg-gradient-to-b from-background to-card">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold">Popular <span className="text-secondary">Games</span></h2>
              <a href="/games" className="text-primary hover:text-secondary flex items-center">
                View All Games 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </a>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                Array(4).fill(0).map((_, index) => (
                  <div key={index} className="bg-card rounded-xl h-64 animate-pulse"></div>
                ))
              ) : (
                games?.map((game) => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                  />
                ))
              )}
            </div>
          </div>
        </section>
        <BrandAmbassador />
        <PaymentMethods />
        <Testimonials />
      </main>
      
      <Footer />
    </div>
  );
}

interface GameCardProps {
  game: Game;
}

function GameCard({ game }: GameCardProps) {
  return (
    <div className="game-card bg-card rounded-xl overflow-hidden shadow-lg transition duration-300">
      <div className="relative">
        <img
          src={game.image || "https://placehold.co/600x400/png"}
          alt={`${game.name} game`}
          className="w-full h-40 object-cover"
        />
        {game.isActive && (
          <div className="absolute top-3 right-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
            HOT
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 font-poppins">{game.name}</h3>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1 h-4 w-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            {game.playersCount} playing
          </span>
          <div className="flex">
            {Array(5).fill(0).map((_, index) => (
              <svg 
                key={index}
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill={index < (game.rating || 0) ? "currentColor" : "none"} 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`h-4 w-4 ${index < (game.rating || 0) ? "text-secondary" : "text-muted"}`}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
        </div>
        <a 
          href={`/games/${game.id}`} 
          className="w-full py-2 text-center bg-muted hover:bg-primary transition duration-300 rounded-lg font-medium block"
        >
          Play Now
        </a>
      </div>
    </div>
  );
}
