import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

// Components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clipboard, Check, RefreshCw } from "lucide-react";

// Define form schema
const depositFormSchema = z.object({
  amount: z.string().refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 100 && num <= 100000;
  }, {
    message: "Amount must be between ৳100 and ৳100,000",
  }),
  method: z.enum(["bKash", "Nagad", "SSLCommerz", "Bank Transfer"]),
  transactionId: z.string().min(6, {
    message: "Transaction ID must be at least 6 characters",
  }),
});

type DepositFormValues = z.infer<typeof depositFormSchema>;

export default function DepositPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [paymentStep, setPaymentStep] = useState(1);
  const [currentMethod, setCurrentMethod] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Payment methods details
  const paymentDetails = {
    Nagad: {
      number: "9856000698038516",
      type: "Personal",
      instructions: [
        "Open your Nagad app",
        "Select 'Send Money'",
        "Enter the number: 9856000698038516",
        "Enter the amount you want to deposit",
        "Add your name in the reference",
        "Complete the payment and note the Transaction ID",
        "Enter the Transaction ID below"
      ]
    },
    bKash: {
      number: "01712345678",
      type: "Merchant",
      instructions: [
        "Open your bKash app",
        "Select 'Send Money'",
        "Enter the number: 01712345678",
        "Enter the amount you want to deposit",
        "Add your name in the reference",
        "Complete the payment and note the Transaction ID",
        "Enter the Transaction ID below"
      ]
    },
    SSLCommerz: {
      instructions: [
        "Choose SSLCommerz as your payment method",
        "Enter the amount you want to deposit",
        "Click 'Continue' to be redirected to the SSLCommerz payment gateway",
        "Choose your preferred payment option (credit/debit card, mobile banking, etc.)",
        "Complete the payment process",
        "You'll be redirected back upon completion"
      ]
    },
    "Bank Transfer": {
      accountName: "BetRoyal Limited",
      accountNumber: "2010145632",
      bankName: "Bangladesh Bank",
      branchName: "Gulshan Branch",
      instructions: [
        "Transfer the amount to the account details provided",
        "Use your username as the reference",
        "After completing the transfer, enter the transaction reference number below"
      ]
    }
  };

  // Form initialization
  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: "",
      method: "Nagad",
      transactionId: "",
    },
  });

  // Watch for method changes
  const watchMethod = form.watch("method");
  
  // Handle method change
  const handleMethodChange = (value: string) => {
    setCurrentMethod(value);
    form.setValue("method", value as any);
    setPaymentStep(1);
  };

  // Copy payment number to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Submit deposit
  const depositMutation = useMutation({
    mutationFn: async (data: DepositFormValues) => {
      const res = await apiRequest("POST", "/api/transactions", {
        amount: Number(data.amount),
        type: "deposit",
        method: data.method,
        status: "pending",
        notes: `Transaction ID: ${data.transactionId}`,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Deposit request submitted",
        description: "Your deposit is being processed. It will be credited to your account soon.",
      });
      form.reset();
      setPaymentStep(1);
    },
    onError: (error: Error) => {
      toast({
        title: "Deposit failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Submit handler
  function onSubmit(data: DepositFormValues) {
    depositMutation.mutate(data);
  }

  // Next step handler
  const handleNextStep = () => {
    if (paymentStep === 1) {
      const amount = form.getValues("amount");
      if (!amount || isNaN(Number(amount)) || Number(amount) < 100 || Number(amount) > 100000) {
        form.setError("amount", { 
          type: "manual", 
          message: "Please enter a valid amount between ৳100 and ৳100,000" 
        });
        return;
      }
      setPaymentStep(2);
    }
  };

  // If user is not logged in, redirect to auth page
  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <Helmet>
        <title>Deposit - BetRoyal Casino</title>
        <meta name="description" content="Deposit funds to your BetRoyal account using various payment methods" />
      </Helmet>

      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Deposit Funds</h1>
        <p className="text-muted-foreground mb-8">Add funds to your BetRoyal account to start playing</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Payment methods */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div 
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${watchMethod === "Nagad" ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => handleMethodChange("Nagad")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
                      </div>
                      <div>
                        <p className="font-medium">Nagad</p>
                        <p className="text-xs text-muted-foreground">Send money to 9856000698038516</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${watchMethod === "bKash" ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => handleMethodChange("bKash")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M15 4h6v6h-6z"></path><path d="M9 20H3v-6h6z"></path><path d="M3 8V5c0-1.1.9-2 2-2h3"></path><path d="M19 16v3c0 1.1-.9 2-2 2h-3"></path><path d="M21 12H3"></path><path d="M12 3v18"></path></svg>
                      </div>
                      <div>
                        <p className="font-medium">bKash</p>
                        <p className="text-xs text-muted-foreground">Fast and secure mobile banking</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${watchMethod === "SSLCommerz" ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => handleMethodChange("SSLCommerz")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
                      </div>
                      <div>
                        <p className="font-medium">SSLCommerz</p>
                        <p className="text-xs text-muted-foreground">Credit/debit cards and more</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${watchMethod === "Bank Transfer" ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => handleMethodChange("Bank Transfer")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path><rect width="18" height="12" x="3" y="10" rx="2"></rect><circle cx="8" cy="16" r="2"></circle><circle cx="16" cy="16" r="2"></circle></svg>
                      </div>
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-xs text-muted-foreground">Direct bank transfer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Deposit form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{paymentStep === 1 ? "Enter Deposit Amount" : `Deposit via ${watchMethod}`}</CardTitle>
                <CardDescription>
                  {paymentStep === 1 
                    ? "Enter the amount you wish to deposit" 
                    : "Follow the instructions to complete your deposit"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {paymentStep === 1 && (
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (৳)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
                                <Input 
                                  placeholder="1000" 
                                  className="pl-8" 
                                  {...field} 
                                  type="number"
                                  min="100"
                                  max="100000"
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Min: ৳100 | Max: ৳100,000
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {paymentStep === 2 && watchMethod === "Nagad" && (
                      <div className="space-y-6">
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Send money to this Nagad account</h3>
                          <div className="flex items-center justify-between bg-background p-3 rounded-md mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Nagad Number</p>
                              <p className="font-medium text-lg">{paymentDetails.Nagad.number}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => copyToClipboard(paymentDetails.Nagad.number)}
                              className="h-8"
                            >
                              {copied ? <Check className="h-4 w-4 mr-1" /> : <Clipboard className="h-4 w-4 mr-1" />}
                              {copied ? "Copied" : "Copy"}
                            </Button>
                          </div>
                          <div className="bg-background p-3 rounded-md">
                            <p className="text-xs text-muted-foreground mb-1">Amount to send</p>
                            <p className="font-medium text-lg">৳{form.getValues("amount")}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-3">Instructions</h3>
                          <ol className="space-y-2 ml-5 list-decimal">
                            {paymentDetails.Nagad.instructions.map((item, index) => (
                              <li key={index} className="text-muted-foreground">{item}</li>
                            ))}
                          </ol>
                        </div>

                        <Separator />

                        <FormField
                          control={form.control}
                          name="transactionId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transaction ID</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter Nagad transaction ID" {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter the transaction ID you received from Nagad
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {paymentStep === 2 && watchMethod === "bKash" && (
                      <div className="space-y-6">
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Send money to this bKash account</h3>
                          <div className="flex items-center justify-between bg-background p-3 rounded-md mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">bKash Number</p>
                              <p className="font-medium text-lg">{paymentDetails.bKash.number}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => copyToClipboard(paymentDetails.bKash.number)}
                              className="h-8"
                            >
                              {copied ? <Check className="h-4 w-4 mr-1" /> : <Clipboard className="h-4 w-4 mr-1" />}
                              {copied ? "Copied" : "Copy"}
                            </Button>
                          </div>
                          <div className="bg-background p-3 rounded-md">
                            <p className="text-xs text-muted-foreground mb-1">Amount to send</p>
                            <p className="font-medium text-lg">৳{form.getValues("amount")}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-3">Instructions</h3>
                          <ol className="space-y-2 ml-5 list-decimal">
                            {paymentDetails.bKash.instructions.map((item, index) => (
                              <li key={index} className="text-muted-foreground">{item}</li>
                            ))}
                          </ol>
                        </div>

                        <Separator />

                        <FormField
                          control={form.control}
                          name="transactionId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transaction ID</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter bKash transaction ID" {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter the transaction ID you received from bKash
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {paymentStep === 2 && watchMethod === "Bank Transfer" && (
                      <div className="space-y-6">
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Bank account details</h3>
                          <div className="space-y-3">
                            <div className="bg-background p-3 rounded-md">
                              <p className="text-xs text-muted-foreground mb-1">Account Name</p>
                              <p className="font-medium">{paymentDetails["Bank Transfer"].accountName}</p>
                            </div>
                            <div className="bg-background p-3 rounded-md">
                              <p className="text-xs text-muted-foreground mb-1">Account Number</p>
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{paymentDetails["Bank Transfer"].accountNumber}</p>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => copyToClipboard(paymentDetails["Bank Transfer"].accountNumber)}
                                  className="h-8"
                                >
                                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Clipboard className="h-4 w-4 mr-1" />}
                                  {copied ? "Copied" : "Copy"}
                                </Button>
                              </div>
                            </div>
                            <div className="bg-background p-3 rounded-md">
                              <p className="text-xs text-muted-foreground mb-1">Bank Name</p>
                              <p className="font-medium">{paymentDetails["Bank Transfer"].bankName}</p>
                            </div>
                            <div className="bg-background p-3 rounded-md">
                              <p className="text-xs text-muted-foreground mb-1">Branch Name</p>
                              <p className="font-medium">{paymentDetails["Bank Transfer"].branchName}</p>
                            </div>
                            <div className="bg-background p-3 rounded-md">
                              <p className="text-xs text-muted-foreground mb-1">Amount to transfer</p>
                              <p className="font-medium">৳{form.getValues("amount")}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-3">Instructions</h3>
                          <ol className="space-y-2 ml-5 list-decimal">
                            {paymentDetails["Bank Transfer"].instructions.map((item, index) => (
                              <li key={index} className="text-muted-foreground">{item}</li>
                            ))}
                          </ol>
                        </div>

                        <Separator />

                        <FormField
                          control={form.control}
                          name="transactionId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transaction Reference</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter bank transfer reference number" {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter the reference number from your bank transfer
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {paymentStep === 2 && watchMethod === "SSLCommerz" && (
                      <div className="space-y-6">
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">SSLCommerz Payment Gateway</h3>
                          <div className="bg-background p-3 rounded-md">
                            <p className="text-xs text-muted-foreground mb-1">Amount to pay</p>
                            <p className="font-medium text-lg">৳{form.getValues("amount")}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-3">Instructions</h3>
                          <ol className="space-y-2 ml-5 list-decimal">
                            {paymentDetails.SSLCommerz.instructions.map((item, index) => (
                              <li key={index} className="text-muted-foreground">{item}</li>
                            ))}
                          </ol>
                        </div>

                        <div className="border border-border rounded-lg p-4 bg-background/50">
                          <p className="text-center text-muted-foreground">Click "Continue to Pay" to proceed to the SSLCommerz payment gateway</p>
                        </div>

                        <FormField
                          control={form.control}
                          name="transactionId"
                          render={({ field }) => (
                            <FormItem className="hidden">
                              <FormControl>
                                <Input {...field} value="SSL_AUTO_GENERATED" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    <div className="flex justify-between mt-6">
                      {paymentStep === 2 && (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setPaymentStep(1)}
                        >
                          Back
                        </Button>
                      )}
                      
                      {paymentStep === 1 ? (
                        <Button 
                          type="button" 
                          onClick={handleNextStep}
                          className="ml-auto"
                        >
                          Continue
                        </Button>
                      ) : (
                        watchMethod === "SSLCommerz" ? (
                          <Button 
                            type="submit"
                            className="ml-auto gold-gradient"
                            disabled={depositMutation.isPending}
                          >
                            {depositMutation.isPending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                            Continue to Pay
                          </Button>
                        ) : (
                          <Button 
                            type="submit"
                            className="ml-auto"
                            disabled={depositMutation.isPending}
                          >
                            {depositMutation.isPending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Deposit
                          </Button>
                        )
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}