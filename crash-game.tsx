import { useState, useEffect, useRef } from "react";
import { User } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface CrashGameProps {
  user: User | null;
}

export default function CrashGame({ user }: CrashGameProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [betAmount, setBetAmount] = useState("10");
  const [autoStop, setAutoStop] = useState(2.0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasCashed, setHasCashed] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [showExplosion, setShowExplosion] = useState(false);
  const animationFrameId = useRef<number | null>(null);
  const gameEndTimer = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTimeRef = useRef<number>(0);
  const rocketX = useRef<number>(0);
  const rocketY = useRef<number>(0);
  const starPositions = useRef<Array<{x: number, y: number, size: number, alpha: number}>>([]);
  const startTime = useRef<number>(0);
  const gameWillCrashAt = useRef<number>(1 + Math.random() * 10); // Random crash between 1x and 11x

  // Generate initial stars
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        starPositions.current = Array(100).fill(0).map(() => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 0.5 + Math.random() * 1.5,
          alpha: 0.3 + Math.random() * 0.7
        }));
      }
    }
  }, []);

  // Resize canvas when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
          
          // Reset rocket position for new dimensions
          rocketX.current = canvas.width / 2;
          rocketY.current = canvas.height - 60;
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation loop for game
  const animate = (time: number) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate time delta for smooth animation
    const deltaTime = time - (lastTimeRef.current || time);
    lastTimeRef.current = time;
    
    // Draw stars (background)
    ctx.save();
    starPositions.current.forEach(star => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Move stars down slowly to create flying effect
      star.y += deltaTime * 0.02;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });
    ctx.restore();
    
    if (isRunning && !hasCashed && !showExplosion) {
      // Calculate new multiplier based on time
      const elapsed = (time - startTime.current) / 1000; // seconds
      const newMultiplier = 1 + (elapsed * 0.5); // Increase by 0.5x per second
      setCurrentMultiplier(parseFloat(newMultiplier.toFixed(2)));
      
      // Move rocket up
      const speedFactor = Math.min(1.5, 1 + (elapsed * 0.05));
      rocketY.current -= deltaTime * 0.05 * speedFactor;
      
      // Draw rocket
      drawRocket(ctx, rocketX.current, rocketY.current);
      
      // Draw flame
      drawFlame(ctx, rocketX.current, rocketY.current + 25, time);
      
      // Check for auto cash out
      if (newMultiplier >= autoStop && !hasCashed) {
        handleCashout();
      }
      
      // Check for crash
      if (newMultiplier >= gameWillCrashAt.current) {
        handleCrash();
      }
    } else if (showExplosion) {
      // Draw explosion
      drawExplosion(ctx, rocketX.current, rocketY.current, time);
    } else if (!isRunning) {
      // Draw rocket on ground
      drawRocket(ctx, rocketX.current, rocketY.current);
    }
    
    // Draw multiplier
    drawMultiplier(ctx, currentMultiplier);
    
    animationFrameId.current = requestAnimationFrame(animate);
  };
  
  // Draw rocket function
  const drawRocket = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.save();
    
    // Rocket body
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x + 15, y + 20);
    ctx.lineTo(x - 15, y + 20);
    ctx.closePath();
    ctx.fill();
    
    // Rocket window
    ctx.fillStyle = '#72c2ec';
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    
    // Rocket fins
    ctx.fillStyle = '#ff6b6b';
    
    // Left fin
    ctx.beginPath();
    ctx.moveTo(x - 15, y + 15);
    ctx.lineTo(x - 25, y + 25);
    ctx.lineTo(x - 5, y + 15);
    ctx.closePath();
    ctx.fill();
    
    // Right fin
    ctx.beginPath();
    ctx.moveTo(x + 15, y + 15);
    ctx.lineTo(x + 25, y + 25);
    ctx.lineTo(x + 5, y + 15);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  };
  
  // Draw flame
  const drawFlame = (ctx: CanvasRenderingContext2D, x: number, y: number, time: number) => {
    ctx.save();
    
    // Flame flicker effect
    const flicker = Math.sin(time * 0.01) * 0.2 + 0.8;
    
    // Main flame
    const gradient = ctx.createLinearGradient(x, y, x, y + 30 * flicker);
    gradient.addColorStop(0, '#ff9500');
    gradient.addColorStop(0.5, '#ff5a00');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.quadraticCurveTo(x, y + 40 * flicker, x + 10, y);
    ctx.closePath();
    ctx.fill();
    
    // Inner flame
    const innerGradient = ctx.createLinearGradient(x, y, x, y + 20 * flicker);
    innerGradient.addColorStop(0, '#ffffcc');
    innerGradient.addColorStop(1, 'rgba(255, 166, 0, 0)');
    
    ctx.fillStyle = innerGradient;
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.quadraticCurveTo(x, y + 25 * flicker, x + 5, y);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  };
  
  // Draw explosion
  const drawExplosion = (ctx: CanvasRenderingContext2D, x: number, y: number, time: number) => {
    ctx.save();
    
    // Explosion effect
    const size = 50 + Math.sin(time * 0.01) * 10;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, '#ffffcc');
    gradient.addColorStop(0.2, '#ff9500');
    gradient.addColorStop(0.4, '#ff5a00');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Particles
    for (let i = 0; i < 20; i++) {
      const angle = i * Math.PI * 2 / 20;
      const dist = 20 + Math.sin(time * 0.01 + i) * 20;
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist;
      
      ctx.fillStyle = i % 2 === 0 ? '#ff9500' : '#ff5a00';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };
  
  // Draw multiplier
  const drawMultiplier = (ctx: CanvasRenderingContext2D, multiplier: number) => {
    ctx.save();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    
    // Determine text color based on multiplier
    let textColor = '#ffffff';
    if (multiplier >= 2) textColor = '#ffcc00';
    if (multiplier >= 5) textColor = '#ff9900';
    if (multiplier >= 10) textColor = '#ff0000';
    
    ctx.fillStyle = textColor;
    ctx.fillText(`${multiplier.toFixed(2)}x`, canvas.width / 2, 70);
    
    ctx.restore();
  };

  // Start game animation
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        
        // Set initial rocket position
        rocketX.current = canvas.width / 2;
        rocketY.current = canvas.height - 60;
        
        // Start animation loop
        animationFrameId.current = requestAnimationFrame(animate);
      }
    }
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (gameEndTimer.current) {
        clearTimeout(gameEndTimer.current);
      }
    };
  }, []);

  // Create transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/transactions", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    }
  });

  // Start game
  const handleStart = () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please login to play games",
        variant: "destructive",
      });
      return;
    }
    
    const betAmountNumber = parseFloat(betAmount);
    
    if (isNaN(betAmountNumber) || betAmountNumber <= 0) {
      toast({
        title: "Invalid bet amount",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      });
      return;
    }
    
    if (user.balance < betAmountNumber) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance to place this bet",
        variant: "destructive",
      });
      return;
    }
    
    // Deduct bet amount from balance
    createTransactionMutation.mutate({
      amount: betAmountNumber,
      type: "loss",
      method: "game",
      status: "completed",
      notes: "Crash Game Bet",
    });
    
    // Reset game state
    setIsRunning(true);
    setHasCashed(false);
    setShowExplosion(false);
    setCurrentMultiplier(1.0);
    
    // Reset rocket position and start time
    if (canvasRef.current) {
      rocketY.current = canvasRef.current.height - 60;
    }
    startTime.current = performance.now();
    
    // Set random crash point between 1.1x and 10x
    gameWillCrashAt.current = 1 + Math.random() * 10;
    
    // For testing purposes, log the crash point
    console.log("Game will crash at:", gameWillCrashAt.current);
  };

  // Cash out
  const handleCashout = () => {
    if (!isRunning || hasCashed || !user) return;
    
    setHasCashed(true);
    
    // Calculate win amount
    const betAmountNumber = parseFloat(betAmount);
    const winAmount = betAmountNumber * currentMultiplier;
    
    // Add win amount to balance
    createTransactionMutation.mutate({
      amount: winAmount,
      type: "win",
      method: "game",
      status: "completed",
      notes: `Crash Game Win (${currentMultiplier.toFixed(2)}x)`,
    });
    
    // Show success message
    toast({
      title: "Cashed out!",
      description: `You won ৳${winAmount.toFixed(2)} (${currentMultiplier.toFixed(2)}x)`,
    });
    
    // Continue showing rocket going up for a bit, then reset
    gameEndTimer.current = setTimeout(() => {
      setIsRunning(false);
      if (canvasRef.current) {
        rocketY.current = canvasRef.current.height - 60;
      }
    }, 2000);
  };

  // Handle crash
  const handleCrash = () => {
    setShowExplosion(true);
    
    // Show crash message
    toast({
      title: "Crashed!",
      description: `The rocket crashed at ${currentMultiplier.toFixed(2)}x`,
      variant: "destructive",
    });
    
    // Reset game after a delay
    gameEndTimer.current = setTimeout(() => {
      setIsRunning(false);
      setShowExplosion(false);
      if (canvasRef.current) {
        rocketY.current = canvasRef.current.height - 60;
      }
    }, 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/20 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-6 w-6 text-primary"
                >
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                  <path d="M9 18h6"></path>
                  <path d="M10 22h4"></path>
                </svg>
                Spaceman Crash
              </CardTitle>
              <CardDescription>
                Place your bet and cash out before the rocket crashes!
              </CardDescription>
            </div>
            
            {user && (
              <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-lg">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-5 w-5 text-secondary"
                >
                  <path d="M12 2v6.5"></path>
                  <path d="M17.5 5 12 2 6.5 5"></path>
                  <path d="M3 5c0 8.9 7.5 16.1 9 16.1s9-7.2 9-16.1"></path>
                  <path d="M19.2 15.1c-.3 1.4-1.1 2-2.3 1.8"></path>
                </svg>
                <span className="font-medium">৳{user.balance.toLocaleString()}</span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="relative w-full" style={{ height: "400px" }}>
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full bg-gradient-to-b from-background to-blue-900/20"
            />
            
            {!isRunning && !showExplosion && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  size="lg" 
                  className="text-lg font-medium purple-gradient hover:opacity-90"
                  onClick={handleStart}
                  disabled={createTransactionMutation.isPending}
                >
                  {createTransactionMutation.isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing
                    </>
                  ) : (
                    "Launch Rocket"
                  )}
                </Button>
              </div>
            )}
            
            {isRunning && !hasCashed && !showExplosion && (
              <div className="absolute bottom-5 inset-x-0 flex items-center justify-center">
                <Button 
                  variant="destructive" 
                  size="lg" 
                  className="text-lg font-medium animate-pulse"
                  onClick={handleCashout}
                >
                  CASH OUT ({currentMultiplier.toFixed(2)}x)
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col md:flex-row gap-6 p-6 bg-muted/10 border-t border-border">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="betAmount">Bet Amount (৳)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
                <Input 
                  id="betAmount"
                  type="number" 
                  placeholder="10" 
                  min="10"
                  className="pl-8" 
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  disabled={isRunning}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {[10, 50, 100, 500].map((amount) => (
                <Button 
                  key={amount}
                  variant="outline" 
                  size="sm"
                  onClick={() => setBetAmount(amount.toString())}
                  disabled={isRunning}
                  className={betAmount === amount.toString() ? "border-primary text-primary" : ""}
                >
                  ৳{amount}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="autoStop">Auto Cashout (x{autoStop.toFixed(2)})</Label>
              </div>
              <Slider
                id="autoStop"
                defaultValue={[2]}
                min={1.1}
                max={10}
                step={0.1}
                value={[autoStop]}
                onValueChange={(value) => setAutoStop(value[0])}
                disabled={isRunning}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1.1x</span>
                <span>5x</span>
                <span>10x</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {[1.5, 2, 5, 10].map((multiplier) => (
                <Button 
                  key={multiplier}
                  variant="outline" 
                  size="sm"
                  onClick={() => setAutoStop(multiplier)}
                  disabled={isRunning}
                  className={autoStop === multiplier ? "border-primary text-primary" : ""}
                >
                  {multiplier}x
                </Button>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}