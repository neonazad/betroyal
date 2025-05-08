import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <span className="text-secondary font-bold text-3xl font-poppins">Bet<span className="text-white">Royal</span></span>
            <p className="mt-4 text-muted-foreground">Experience the thrill of online casino gaming with the most trusted platform in Bangladesh.</p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-white hover:bg-primary transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-white hover:bg-primary transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-white hover:bg-primary transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-white hover:bg-primary transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 font-poppins">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/"><span className="text-muted-foreground hover:text-white transition duration-200 cursor-pointer">Home</span></Link></li>
              <li><Link href="/games"><span className="text-muted-foreground hover:text-white transition duration-200 cursor-pointer">Games</span></Link></li>
              <li><Link href="/promotions"><span className="text-muted-foreground hover:text-white transition duration-200 cursor-pointer">Promotions</span></Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-white transition duration-200">VIP Program</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-white transition duration-200">Tournaments</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 font-poppins">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-white transition duration-200">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-white transition duration-200">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-white transition duration-200">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-white transition duration-200">Responsible Gaming</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-white transition duration-200">Terms & Conditions</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 font-poppins">Newsletter</h3>
            <p className="text-muted-foreground mb-4">Subscribe for updates on bonuses and promotions</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="bg-background border border-border rounded-l-lg px-4 py-2 w-full" />
              <button className="bg-primary hover:bg-primary/90 transition duration-300 text-white rounded-r-lg px-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
              </button>
            </div>
            <div className="mt-6">
              <p className="text-muted-foreground">Available Payment Methods</p>
              <div className="flex space-x-3 mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-muted-foreground"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-muted-foreground"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-muted-foreground"><rect width="20" height="12" x="2" y="6" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-muted-foreground"><path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z"></path><path d="M3 10h18"></path></svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">© 2023 BetRoyal. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-white text-sm">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-white text-sm">Cookies Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
