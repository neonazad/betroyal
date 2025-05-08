import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function PaymentMethods() {
  const { user } = useAuth();
  
  const paymentMethods = [
    {
      name: "bKash",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-3xl text-primary"><path d="M15 4h6v6h-6z"></path><path d="M9 20H3v-6h6z"></path><path d="M3 8V5c0-1.1.9-2 2-2h3"></path><path d="M19 16v3c0 1.1-.9 2-2 2h-3"></path><path d="M21 12H3"></path><path d="M12 3v18"></path></svg>
    },
    {
      name: "SSLCommerz",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-3xl text-primary"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
    },
    {
      name: "Bank Transfer",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-3xl text-primary"><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path><rect width="18" height="12" x="3" y="10" rx="2"></rect><circle cx="8" cy="16" r="2"></circle><circle cx="16" cy="16" r="2"></circle></svg>
    },
    {
      name: "Nagad",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-3xl text-primary"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-poppins mb-10 text-center">Trusted <span className="text-secondary">Payment Methods</span></h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {paymentMethods.map((method, index) => (
            <div key={index} className="bg-card rounded-xl p-6 flex items-center justify-center hover:shadow-md transition duration-300">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white flex items-center justify-center">
                  {method.icon}
                </div>
                <h3 className="text-lg font-medium">{method.name}</h3>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          {!user ? (
            <Link href="/auth?tab=register">
              <Button className="px-8 py-3 text-lg font-medium rounded-lg gold-gradient hover:opacity-90 transition duration-300">
                Sign Up & Deposit Now
              </Button>
            </Link>
          ) : (
            <Link href="/deposit">
              <Button className="px-8 py-3 text-lg font-medium rounded-lg gold-gradient hover:opacity-90 transition duration-300">
                Deposit Now
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
