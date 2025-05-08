import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DiceGameProps {
  user: User | null;
}

export default function DiceGame({ user }: DiceGameProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [currentDice, setCurrentDice] = useState<number>(5);
  const [isRolling, setIsRolling] = useState(false);
  const [betAmount, setBetAmount] = useState(50);
  const [result, setResult] = useState<{ message: string; isWin: boolean } | null>(null);
  const { toast } = useToast();
  
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
  
  const selectNumber = (num: number) => {
    if (!isRolling) {
      setSelectedNumber(num);
    }
  };
  
  const rollDice = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to play.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedNumber === null) {
      toast({
        title: "Select a Number",
        description: "Please predict a number before rolling.",
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
    
    setIsRolling(true);
    setResult(null);
    
    // Animation
    let rolls = 0;
    const maxRolls = 10;
    
    const rollInterval = setInterval(() => {
      const randomValue = Math.floor(Math.random() * 6) + 1;
      setCurrentDice(randomValue);
      
      rolls++;
      if (rolls >= maxRolls) {
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setCurrentDice(finalValue);
        
        // Determine win/loss
        const isWin = selectedNumber === finalValue;
        
        // Win amount is 5x the bet for correct prediction
        const winAmount = isWin ? betAmount * 5 : 0;
        
        // Set result message
        setResult({
          message: isWin 
            ? `You won! The dice rolled ${finalValue}`
            : `You lost. The dice rolled ${finalValue}`,
          isWin
        });
        
        // Process game result (update balance)
        if (user) {
          gameResultMutation.mutate({
            gameId: 2, // Dice game ID
            amount: isWin ? betAmount * 5 : betAmount, // Win amount or loss amount
            isWin
          });
        }
        
        setIsRolling(false);
      }
    }, 150);
  };
  
  const renderDiceFace = (value: number) => {
    // Create an array to hold the dots
    const dots = [];
    
    // Create patterns based on the dice value
    switch (value) {
      case 1:
        dots.push(<div key="center" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-background rounded-full"></div>);
        break;
      case 2:
        dots.push(<div key="top-left" className="absolute top-3 left-3 w-3 h-3 bg-background rounded-full"></div>);
        dots.push(<div key="bottom-right" className="absolute bottom-3 right-3 w-3 h-3 bg-background rounded-full"></div>);
        break;
      case 3:
        dots.push(<div key="top-left" className="absolute top-3 left-3 w-3 h-3 bg-background rounded-full"></div>);
        dots.push(<div key="center" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-background rounded-full"></div>);
        dots.push(<div key="bottom-right" className="absolute bottom-3 right-3 w-3 h-3 bg-background rounded-full"></div>);
        break;
      case 4:
        dots.push(<div key="top-left" className="absolute top-3 left-3 w-3 h-3 bg-background rounded-full"></div>);
        dots.push(<div key="top-right" className="absolute top-3 right-3 w-3 h-3 bg-background rounded-full"></div>);
        dots.push(<div key="bottom-left" className="absolute bottom-3 left-3 w-3 h-3 bg-background rounded-full"></div>);
        dots.push(<div key="bottom-right" className="absolute bottom-3 right-3 w-3 h-3 bg-background rounded-full"></div>);
        break;
      case 5:
        dots.push(<div key="top-left" className="absolute top-3 left-3 w-3 h-3 bg-background rounded-full"></div>);
        dots.push(<div key="top-right" className="absolute top-3 right-3 w-3 h-3 bg-background rounded-full"></div>);
        dots.push(<div key="center" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-background rounded-full"></div>);
        dots.push(<div key="bottom-left" className="absolute bottom-3 left-3 w-3 h-3 bg-background rounded-full"></div>);
        dots.push(<div key="bottom-right" className="absolute bottom-3 right-3 w-3 h-3 bg-background rounded-full"></div>);
        break;
      case 6:
        dots.push(<div key="top-left" className="absolute top-3 left-3 w-3 h-3 bg-background rounded-full"></div>);
        dots.push(<div key="top-right" className="absolute top-3 right-3 w-3 h-3 bg-background rounded-full"></div>);
        dots.push(<div key="mid-left" className="absolute top-1/2 left-3 transform -translate-y-1/2 w-3 h-3 bg-background rounded-full"></div>);
        dots.push(<div key="mid-right" className="absolute top-1/2 right-3 transform -translate-y-1/2 w-3 h-3 bg-background rounded-full"></div>);
        dots.push(<div key="bottom-left" className="absolute bottom-3 left-3 w-3 h-3 bg-background rounded-full"></div>);
        dots.push(<div key="bottom-right" className="absolute bottom-3 right-3 w-3 h-3 bg-background rounded-full"></div>);
        break;
      default:
        break;
    }
    
    return dots;
  };
  
  return (
    <div>
      <div className="py-8 bg-background rounded-xl mb-6 flex flex-col items-center">
        <div className="mb-6">
          <p className="text-center text-muted-foreground mb-2">Predict the dice roll</p>
          <div className="flex justify-center space-x-3">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <Button
                key={num}
                variant={selectedNumber === num ? "default" : "outline"}
                className={`w-10 h-10 p-0 ${selectedNumber === num ? 'bg-primary' : 'bg-muted'} transition-colors duration-200`}
                onClick={() => selectNumber(num)}
                disabled={isRolling}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="w-20 h-20 bg-white rounded-xl relative">
          {renderDiceFace(currentDice)}
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
              disabled={isRolling || betAmount <= 10}
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
              disabled={isRolling || betAmount >= (user?.balance || 1000)}
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
          onClick={rollDice}
          disabled={isRolling || selectedNumber === null || !user || user.balance < betAmount}
        >
          {isRolling ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M20 9v8a2 2 0 0 1-2 2H7.9a2 2 0 0 1-1.9-2.66L9.08 5.5A2 2 0 0 1 11 4h2.52a4 4 0 0 1 0 8"></path></svg>
              ROLL
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
