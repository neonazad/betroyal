export default function FeaturesSection() {
  const features = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-2xl"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m14.5 9-5 5"></path><path d="m9.5 9 5 5"></path></svg>,
      title: "Secure Payments",
      description: "Industry-leading encryption and secure payment methods to protect your transactions."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-2xl"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4z"></path></svg>,
      title: "Generous Bonuses",
      description: "Get amazing welcome bonuses and regular promotions to boost your gameplay."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-2xl"><path d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"></path><path d="M1.5 12a10.5 10.5 0 1 1 21 0 10.5 10.5 0 0 1-21 0Z"></path><path d="m8 15 2-2m0 0 2-2m-2 2-2-2m2 2 2 2"></path></svg>,
      title: "24/7 Support",
      description: "Our dedicated support team is available around the clock to assist with any queries."
    }
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-card rounded-xl p-6 text-center hover:border-primary transition-all duration-300 border border-transparent"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full purple-gradient flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 font-poppins">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
