import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CardFlipProps {
  user: User | null;
}

export default function CardFlip({ user }: CardFlipProps) {
  const [currentCard, setCurrentCard] = useState<{value: string; suit: string; color: string; index: number}>({
    value: "7",
    suit: "♥",
    color: "text-red-600",
    index: 6
  });
  const [nextCard, setNextCard] = useState<{value: string; suit: string; color: string; index: number} | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [betAmount, setBetAmount] = useState(50);
  const [result, setResult] = useState<{ message: string; isWin: boolean } | null>(null);
  const { toast } = useToast();
  
  const cardValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const suits = ["♠", "♥", "♦", "♣"];
  
  const gameResultMutation = useMutation({
    mutationFn: async (data: { gameId: number; amount: number; isWin: boolean }) => {
      const response = await apiRequest("POST", "/api/game-result", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to process game result: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const decreaseBet = () => {
    if (betAmount > 10) {
      setBetAmount((prev) => prev - 10);
    }
  };
  
  const increaseBet = () => {
    if (betAmount < (user?.balance || 1000)) {
      setBetAmount((prev) => prev + 10);
    }
  };
  
  const playCardGame = (isHigher: boolean) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to play.",
        variant: "destructive",
      });
      return;
    }
    
    if (user.balance < betAmount) {
      toast({
        title: "Insufficient Balance",
        description: "Please deposit more funds or lower your bet amount.",
        variant: "destructive",
      });
      return;
    }
    
    setIsFlipping(true);
    setResult(null);
    
    // Get current card value
    const currentIndex = cardValues.indexOf(currentCard.value);
    
    // Generate next card
    let nextIndex;
    if (isHigher) {
      // For higher, next card should be higher (or equal) with 60% probability
      nextIndex = Math.random() < 0.6 ? 
        Math.floor(Math.random() * (cardValues.length - currentIndex - 1)) + currentIndex + 1 : 
        Math.floor(Math.random() * currentIndex);
    } else {
      // For lower, next card should be lower (or equal) with 60% probability
      nextIndex = Math.random() < 0.6 ? 
        Math.floor(Math.random() * currentIndex) : 
        Math.floor(Math.random() * (cardValues.length - currentIndex - 1)) + currentIndex + 1;
    }
    
    // Make sure index is valid
    nextIndex = Math.max(0, Math.min(cardValues.length - 1, nextIndex));
    
    const nextValue = cardValues[nextIndex];
    const nextSuit = suits[Math.floor(Math.random() * suits.length)];
    const color = (nextSuit === "♥" || nextSuit === "♦") ? "text-red-600" : "text-black";
    
    const nextCardObj = {
      value: nextValue,
      suit: nextSuit,
      color,
      index: nextIndex
    };
    
    setNextCard(nextCardObj);
    
    // Determine win/loss
    const isWin = (isHigher && nextIndex > currentIndex) || (!isHigher && nextIndex < currentIndex);
    
    // Win amount is 2x the bet
    const winAmount = isWin ? betAmount * 2 : 0;
    
    // Set result message
    setResult({
      message: isWin ? `You won!` : `You lost.`,
      isWin
    });
    
    // Process game result (update balance)
    if (user) {
      gameResultMutation.mutate({
        gameId: 3, // Card game ID
        amount: isWin ? betAmount * 2 : betAmount, // Win amount or loss amount
        isWin
      });
    }
    
    setIsFlipping(false);
  };
  
  const resetCardGame = () => {
    // Reset current card to a random card
    const randomValue = cardValues[Math.floor(Math.random() * cardValues.length)];
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const color = (randomSuit === "♥" || randomSuit === "♦") ? "text-red-600" : "text-black";
    
    setCurrentCard({
      value: randomValue,
      suit: randomSuit,
      color,
      index: cardValues.indexOf(randomValue)
    });
    
    // Reset next card
    setNextCard(null);
    
    // Hide result
    setResult(null);
  };
  
  return (
    <div>
      <div className="py-8 bg-background rounded-xl mb-6">
        <p className="text-center text-muted-foreground mb-4">Select higher or lower than the current card</p>
        
        <div className="flex justify-center space-x-8">
          <div className="w-32 h-44 bg-white rounded-lg flex items-center justify-center relative">
            <span className={`absolute top-2 left-2 ${currentCard.color} text-lg`}>{currentCard.suit}</span>
            <span className={currentCard.color}>{currentCard.value}</span>
            <span className={`absolute bottom-2 right-2 ${currentCard.color} text-lg`}>{currentCard.suit}</span>
          </div>
          
          <div className={`w-32 h-44 rounded-lg flex items-center justify-center relative ${nextCard ? 'bg-white' : 'bg-muted'}`}>
            {nextCard ? (
              <>
                <span className={`absolute top-2 left-2 ${nextCard.color} text-lg`}>{nextCard.suit}</span>
                <span className={nextCard.color}>{nextCard.value}</span>
                <span className={`absolute bottom-2 right-2 ${nextCard.color} text-lg`}>{nextCard.suit}</span>
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-muted-foreground"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
            )}
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 mt-6">
          <Button 
            variant="default" 
            className="bg-success hover:bg-success/90"
            onClick={() => playCardGame(true)}
            disabled={isFlipping || nextCard !== null || !user || user.balance < betAmount}
          >
            Higher <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>
          </Button>
          <Button 
            variant="default" 
            className="bg-destructive hover:bg-destructive/90"
            onClick={() => playCardGame(false)}
            disabled={isFlipping || nextCard !== null || !user || user.balance < betAmount}
          >
            Lower <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4"><path d="m19 12-7 7-7-7"></path><path d="M12 5v14"></path></svg>
          </Button>
        </div>
        
        {result && (
          <div className={`mt-4 text-lg font-medium text-center ${result.isWin ? 'text-success' : 'text-destructive'}`}>
            {result.message}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-muted-foreground text-sm mb-1">Bet Amount</label>
          <div className="flex items-center">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-l-lg" 
              onClick={decreaseBet}
              disabled={isFlipping || betAmount <= 10}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h14"></path></svg>
            </Button>
            <Input 
              type="text" 
              value={betAmount} 
              className="w-20 h-8 text-center rounded-none border-x-0" 
              readOnly 
            />
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-r-lg" 
              onClick={increaseBet}
              disabled={isFlipping || betAmount >= (user?.balance || 1000)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            </Button>
          </div>
        </div>
        
        <div>
          <p className="text-muted-foreground text-sm mb-1">Balance</p>
          <p className="text-xl font-bold">₹{user?.balance || 0}</p>
        </div>
        
        <Button 
          className="purple-gradient px-6 py-3 rounded-lg font-medium"
          onClick={resetCardGame}
          disabled={isFlipping}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
          NEW GAME
        </Button>
      </div>
    </div>
  );
}
