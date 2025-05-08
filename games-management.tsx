import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Game, insertGameSchema } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import GamesTable from "@/components/admin/games-table";

type GameFormValues = z.infer<typeof insertGameSchema>;

export default function GamesManagementTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const { toast } = useToast();
  
  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });
  
  const form = useForm<GameFormValues>({
    resolver: zodResolver(insertGameSchema),
    defaultValues: {
      name: "",
      type: "slots",
      image: "",
      description: "",
      isActive: true,
    }
  });
  
  const createGameMutation = useMutation({
    mutationFn: async (data: GameFormValues) => {
      const res = await apiRequest("POST", "/api/admin/games", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      setDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Game created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create game: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const updateGameMutation = useMutation({
    mutationFn: async (data: { id: number; game: Partial<GameFormValues> }) => {
      const res = await apiRequest("PATCH", `/api/admin/games/${data.id}`, data.game);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      setDialogOpen(false);
      setEditingGame(null);
      form.reset();
      toast({
        title: "Success",
        description: "Game updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update game: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const filteredGames = games?.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (game.description && game.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const openAddGameDialog = () => {
    form.reset({
      name: "",
      type: "slots",
      image: "",
      description: "",
      isActive: true,
    });
    setEditingGame(null);
    setDialogOpen(true);
  };
  
  const openEditGameDialog = (game: Game) => {
    form.reset({
      name: game.name,
      type: game.type,
      image: game.image || "",
      description: game.description || "",
      isActive: game.isActive,
    });
    setEditingGame(game);
    setDialogOpen(true);
  };
  
  const onSubmit = (data: GameFormValues) => {
    if (editingGame) {
      updateGameMutation.mutate({ id: editingGame.id, game: data });
    } else {
      createGameMutation.mutate(data);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          <Input 
            type="text" 
            placeholder="Search games..." 
            className="pl-10 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <Button onClick={openAddGameDialog} className="bg-primary hover:bg-primary/90">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
          Add Game
        </Button>
      </div>
      
      <GamesTable 
        games={filteredGames || []} 
        isLoading={isLoading}
        onEdit={openEditGameDialog} 
      />
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingGame ? 'Edit Game' : 'Add New Game'}</DialogTitle>
            <DialogDescription>
              {editingGame ? 'Update the game details below.' : 'Enter the details for the new game.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Royal Slots" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a game type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="slots">Slots</SelectItem>
                        <SelectItem value="dice">Dice</SelectItem>
                        <SelectItem value="cards">Cards</SelectItem>
                        <SelectItem value="roulette">Roulette</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter game description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>
                        Activate or deactivate this game
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" disabled={createGameMutation.isPending || updateGameMutation.isPending}>
                  {(createGameMutation.isPending || updateGameMutation.isPending) ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : editingGame ? 'Update Game' : 'Add Game'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
