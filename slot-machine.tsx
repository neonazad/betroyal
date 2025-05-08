import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SlotMachineProps {
  user: User | null;
}

export default function SlotMachine({ user }: SlotMachineProps) {
  const [reels, setReels] = useState<string[]>(["🍒", "🍊", "🍇"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(50);
  const [result, setResult] = useState<{ message: string; isWin: boolean } | null>(null);
  const { toast } = useToast();
  
  const symbols = ["🍒", "🍊", "🍇", "🍋", "🍉", "7️⃣", "💎"];
  
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
  
  const spinSlots = () => {
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
    
    setIsSpinning(true);
    setResult(null);
    
    // Animation
    let spins = 0;
    const maxSpins = 20;
    
    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
      
      spins++;
      if (spins >= maxSpins) {
        clearInterval(spinInterval);
        const finalReels = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)]
        ];
        
        setReels(finalReels);
        
        // Determine win/loss - win if at least 2 symbols match
        const isWin = finalReels[0] === finalReels[1] || 
                      finalReels[1] === finalReels[2] || 
                      finalReels[0] === finalReels[2];
        
        // Multiply bet by 3 for a win
        const winAmount = isWin ? betAmount * 3 : 0;
        
        // Set result message
        setResult({
          message: isWin ? `You won ₹${winAmount}!` : "Try again!",
          isWin
        });
        
        // Process game result (update balance)
        if (user) {
          gameResultMutation.mutate({
            gameId: 1, // Slot machine game ID
            amount: isWin ? betAmount * 3 : betAmount, // Win amount or loss amount
            isWin
          });
        }
        
        setIsSpinning(false);
      }
    }, 100);
  };
  
  return (
    <div>
      <div className="py-6 bg-background rounded-xl mb-6">
        <div className="flex justify-center space-x-2">
          {reels.map((symbol, index) => (
            <div 
              key={index} 
              className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center text-4xl font-bold"
            >
              {symbol}
            </div>
          ))}
        </div>
        
        {result && (
          <div className={`text-center mt-4 text-lg font-medium ${result.isWin ? 'text-success' : 'text-muted-foreground'}`}>
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
              disabled={isSpinning || betAmount <= 10}
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
              disabled={isSpinning || betAmount >= (user?.balance || 1000)}
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
          className="gold-gradient px-6 py-3 rounded-lg font-medium"
          onClick={spinSlots}
          disabled={isSpinning || !user || user.balance < betAmount}
        >
          {isSpinning ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              SPIN
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
