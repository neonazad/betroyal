import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CrashGame from "@/components/games/crash-game";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function CrashGamePage() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Spaceman Crash - BetRoyal Casino</title>
        <meta name="description" content="Play the exciting Spaceman Crash game - bet and cash out before the rocket crashes to win big!" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Spaceman Crash</h1>
              <p className="text-muted-foreground">Watch the rocket fly and cash out before it crashes for big wins!</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button 
                variant="outline" 
                onClick={() => navigate("/games")}
                className="flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="15 18 9 12 15 6"></polyline></svg>
                Back to Games
              </Button>
            </div>
          </div>
          
          <CrashGame user={user} />
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">How to Play</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                  <span className="text-primary text-xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Place Your Bet</h3>
                <p className="text-muted-foreground">Choose your bet amount and set an auto-cashout multiplier if desired.</p>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                  <span className="text-primary text-xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Watch The Rocket</h3>
                <p className="text-muted-foreground">The rocket will take off and the multiplier will increase as it climbs higher.</p>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                  <span className="text-primary text-xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Cash Out in Time</h3>
                <p className="text-muted-foreground">Cash out before the rocket crashes to win your bet multiplied by the current multiplier.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}