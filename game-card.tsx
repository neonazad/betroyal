import { Game } from "@shared/schema";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface GameCardProps {
  game: Game;
}

export default function GameList({ games, isLoading }: { games: Game[] | undefined, isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="bg-card rounded-xl h-64 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-bold mb-2">No games available</h3>
        <p className="text-muted-foreground">Check back soon for new games!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

function GameCard({ game }: GameCardProps) {
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
      <CardContent className="p-5">
        <h3 className="text-xl font-bold mb-2 font-poppins">{game.name}</h3>
        <div className="flex justify-between items-center mb-4">
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
                fill={index < game.rating ? "currentColor" : "none"} 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`h-4 w-4 ${index < game.rating ? "text-secondary" : "text-muted"}`}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
        </div>
        <Link href={`/games/${game.id}`}>
          <a className="w-full py-2 text-center block bg-muted hover:bg-primary transition duration-300 rounded-lg font-medium">
            Play Now
          </a>
        </Link>
      </CardContent>
    </Card>
  );
}
