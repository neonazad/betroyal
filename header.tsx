import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { UserDropdown } from "@/components/ui/user-dropdown";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/games", label: "Games" },
    { href: "/promotions", label: "Promotions" },
    { href: "/support", label: "Support" },
  ];
  
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <span className="text-secondary font-bold text-3xl font-poppins cursor-pointer">Bet<span className="text-white">Royal</span></span>
            </Link>
          </div>
          
          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`font-medium transition duration-200 cursor-pointer ${location === link.href ? 'text-white border-b-2 border-secondary' : 'text-muted-foreground hover:text-white'}`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="py-1 px-3 bg-muted rounded-full text-sm font-medium hidden sm:flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4 text-secondary"><path d="M12 2v6.5"></path><path d="M17.5 5 12 2 6.5 5"></path><path d="M3 5c0 8.9 7.5 16.1 9 16.1s9-7.2 9-16.1"></path><path d="M19.2 15.1c-.3 1.4-1.1 2-2.3 1.8"></path></svg>
                  <span className="font-medium">৳{user.balance.toLocaleString()}</span>
                </div>
                <UserDropdown />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button className="purple-gradient hover:opacity-90">
                    Register
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span 
                        className={`block py-2 px-4 rounded-lg font-medium cursor-pointer ${location === link.href ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                  
                  {user ? (
                    <div className="pt-4 space-y-4">
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-medium">{user.fullName 
                              ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() 
                              : user.username.slice(0, 2).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium">{user.fullName || user.username}</p>
                            <p className="text-xs text-muted-foreground">@{user.username}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-secondary"><path d="M12 2v6.5"></path><path d="M17.5 5 12 2 6.5 5"></path><path d="M3 5c0 8.9 7.5 16.1 9 16.1s9-7.2 9-16.1"></path><path d="M19.2 15.1c-.3 1.4-1.1 2-2.3 1.8"></path></svg>
                            <span className="font-medium text-foreground">৳{user.balance.toLocaleString()}</span>
                            <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full ml-auto">Balance</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M22 18.1V6.3a2.3 2.3 0 0 0-2.3-2.3H4.3A2.3 2.3 0 0 0 2 6.3v11.8a2.3 2.3 0 0 0 2.3 2.3h15.4a2.3 2.3 0 0 0 2.3-2.3Z"></path><path d="m4.8 7.5 5.7 3.4c.9.6 2.1.6 3 0l5.7-3.4"></path></svg>
                            <span className="truncate text-xs">{user.email}</span>
                          </div>
                          
                          {user.mobileNumber && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                              <span className="text-xs">{user.mobileNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Link href="/profile">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                          My Profile
                        </Button>
                      </Link>
                      
                      <Button 
                        className="w-full text-destructive bg-destructive/10 hover:bg-destructive/20"
                        variant="ghost"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logoutMutation.mutate();
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-4 space-y-2">
                      <Link href="/auth">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth?tab=register">
                        <Button 
                          className="w-full purple-gradient"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Register
                        </Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
