import { cva } from "class-variance-authority";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: "up" | "down";
  trendValue: string;
  color: "blue" | "green" | "yellow" | "purple" | "red";
}

const iconColorVariants = cva("w-10 h-10 rounded-full bg-opacity-20 flex items-center justify-center", {
  variants: {
    color: {
      blue: "bg-blue-500 text-blue-500",
      green: "bg-green-500 text-green-500",
      yellow: "bg-yellow-500 text-yellow-500",
      purple: "bg-purple-500 text-purple-500",
      red: "bg-red-500 text-red-500",
    },
  },
  defaultVariants: {
    color: "blue",
  },
});

const trendColorVariants = cva("text-sm", {
  variants: {
    trend: {
      up: "text-green-500",
      down: "text-red-500",
    },
  },
  defaultVariants: {
    trend: "up",
  },
});

export default function StatCard({ title, value, icon, trend, trendValue, color }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-muted-foreground font-medium">{title}</h3>
        <div className={iconColorVariants({ color })}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className={trendColorVariants({ trend }) + " mt-2"}>
        {trend === "up" ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1 h-4 w-4"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1 h-4 w-4"><path d="m5 12 7 7 7-7"></path><path d="M12 5v14"></path></svg>
        )} 
        {trendValue} from last month
      </p>
    </div>
  );
}
