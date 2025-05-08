import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function BrandAmbassador() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Ambassador Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-[4/3] bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-md mx-auto">
                  {/* Profile image with glowing effect */}
                  <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-secondary/50 shadow-[0_0_30px_rgba(255,180,0,0.5)]">
                    <img 
                      src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80" 
                      alt="Jr. A - Brand Ambassador" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Name tag */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-card px-6 py-3 rounded-full border border-secondary/30 shadow-lg">
                    <h3 className="text-center text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Jr. A</h3>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/20 blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-secondary/20 blur-xl"></div>
            </div>
          </div>
          
          {/* Ambassador Info */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-block mb-3 px-4 py-1 bg-secondary/10 text-secondary rounded-full font-medium text-sm">
              Official Brand Ambassador
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-poppins">Meet Our Ambassador <span className="text-secondary">Jr. A</span></h2>
            <p className="text-muted-foreground mb-6">
              We're proud to announce our partnership with the charismatic and talented Jr. A as our official brand ambassador. 
              With his dynamic personality and passion for excellence, Jr. A embodies the excitement and thrill that BetRoyal Casino stands for.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="min-w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Exclusive Promotions</h3>
                  <p className="text-muted-foreground">Get access to exclusive bonuses and promotions curated by Jr. A himself.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="min-w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-secondary"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.9L5 6.5A6 6 0 0 1 19 8l-2.8 2h5Z"></path><path d="M14 14a2 2 0 1 0-2 2"></path></svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Live Events</h3>
                  <p className="text-muted-foreground">Join Jr. A's live streaming events and tournaments with special prizes.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="min-w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"></path><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"></path><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"></path></svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Gaming Tips</h3>
                  <p className="text-muted-foreground">Learn strategies and tips from Jr. A to enhance your gaming experience.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/auth?tab=register">
                <Button className="purple-gradient hover:opacity-90 text-white">
                  Join Jr. A's Community
                </Button>
              </Link>
              
              <Link href="/promotions">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Jr. A's Special Offers
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Social proof section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8">Connect with <span className="text-secondary">Jr. A</span> on Social Media</h3>
          <div className="flex justify-center gap-6">
            <a href="#" className="bg-card hover:bg-card/80 p-4 rounded-full transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#1DA1F2]"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" className="bg-card hover:bg-card/80 p-4 rounded-full transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#C13584]"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
            <a href="#" className="bg-card hover:bg-card/80 p-4 rounded-full transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#FF0000]"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path></svg>
            </a>
            <a href="#" className="bg-card hover:bg-card/80 p-4 rounded-full transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="#" className="bg-card hover:bg-card/80 p-4 rounded-full transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-600"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}