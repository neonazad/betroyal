import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  content: string;
  author: {
    name: string;
    image: string;
    memberSince: string;
  };
  rating: number;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      content: "BetRoyal has the best slots games I've played. The bonuses are generous and withdrawals are fast. Highly recommended!",
      author: {
        name: "Rahul Sharma",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        memberSince: "Member since 2022"
      },
      rating: 5
    },
    {
      content: "Customer support is excellent and the game variety is amazing. I especially enjoy the poker tournaments. Great platform!",
      author: {
        name: "Priya Patel",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        memberSince: "Member since 2021"
      },
      rating: 4
    },
    {
      content: "The mobile experience is fantastic. I can play my favorite games on the go, and the interface is very user-friendly. Love it!",
      author: {
        name: "Arjun Kapoor",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        memberSince: "Member since 2023"
      },
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-poppins mb-12 text-center">What Our <span className="text-secondary">Players Say</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background">
              <CardContent className="p-6">
                <div className="flex text-secondary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill={i < testimonial.rating ? "currentColor" : "none"}
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="h-4 w-4"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <Avatar className="w-10 h-10 rounded-full mr-3">
                    <AvatarImage src={testimonial.author.image} alt={testimonial.author.name} />
                    <AvatarFallback>{testimonial.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{testimonial.author.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.author.memberSince}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
