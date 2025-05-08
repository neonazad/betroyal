import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { Game } from "@shared/schema";
import SlotMachine from "@/components/games/slot-machine";
import DiceGame from "@/components/games/dice-game";
import CardFlip from "@/components/games/card-flip";
import CrashGame from "@/components/games/crash-game";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  
  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });
  
  const playGame = (game: Game) => {
    if (game.type === "crash") {
      navigate("/crash-game");
      return;
    }
    
    setActiveGame(game);
    setShowGameModal(true);
  };
  
  const closeGameModal = () => {
    setShowGameModal(false);
    setActiveGame(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Games - BetRoyal Casino</title>
        <meta name="description" content="Play our exciting selection of casino games including slots, dice games, poker and more." />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Casino Games</h1>
              <p className="text-muted-foreground">Test your luck with our exciting selection of games</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Input 
                  placeholder="Search games..." 
                  className="pl-10 w-full sm:w-64"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array(8).fill(0).map((_, index) => (
                <div key={index} className="bg-card rounded-xl h-64 animate-pulse"></div>
              ))
            ) : (
              games?.map((game) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onPlay={() => playGame(game)}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Game Modals */}
        {showGameModal && activeGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className={`bg-card rounded-2xl p-6 w-full ${activeGame.type === "crash" ? "max-w-4xl" : "max-w-2xl"}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-poppins">
                  {activeGame.name}
                </h2>
                <Button variant="ghost" size="icon" onClick={closeGameModal}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                </Button>
              </div>
              
              {activeGame.type === "slots" && <SlotMachine user={user} />}
              {activeGame.type === "dice" && <DiceGame user={user} />}
              {activeGame.type === "cards" && <CardFlip user={user} />}
              {activeGame.type === "crash" && <CrashGame user={user} />}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

interface GameCardProps {
  game: Game;
  onPlay: () => void;
}

function GameCard({ game, onPlay }: GameCardProps) {
  return (
    <Card className="game-card overflow-hidden shadow-lg transition duration-300 hover:-translate-y-1">
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
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-xl">{game.name}</CardTitle>
        <div className="flex justify-between items-center mt-2">
          <span className="text-muted-foreground text-sm">
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
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground">{game.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={onPlay} className="w-full">
          Play Now
        </Button>
      </CardFooter>
    </Card>
  );
}
