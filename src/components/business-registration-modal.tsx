import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { insertBusinessSchema, businessCategorySchema, type InsertBusiness } from "@/types/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface BusinessRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BusinessRegistrationModal({
  isOpen,
  onClose,
}: BusinessRegistrationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const form = useForm<InsertBusiness>({
    resolver: zodResolver(insertBusinessSchema),
    defaultValues: {
      name: "",
      category: "shop",
      description: "",
      phone: "",
      address: "",
      is_open: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertBusiness) => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const { data: business, error } = await supabase
        .from('businesses')
        .insert({
          ...data,
          owner_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return business;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.invalidateQueries({ queryKey: ["my-businesses"] });
      toast({
        title: "Success",
        description: "Business registered successfully!",
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to register business. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating business:", error);
    },
  });

  const onSubmit = (data: InsertBusiness) => {
    createMutation.mutate(data);
  };

  const categoryOptions = [
    { value: "shop", label: "Shop/Retail" },
    { value: "service", label: "Service" },
    { value: "food", label: "Food & Dining" },
    { value: "health", label: "Health & Wellness" },
    { value: "other", label: "Other" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Register Your Business
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Business Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter business name"
                      className="px-3 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Category
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="px-3 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="Enter phone number"
                      className="px-3 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter business address"
                      className="px-3 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      rows={2}
                    />
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
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Brief description of your business"
                      className="px-3 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full py-3 rounded-xl font-medium"
            >
              {createMutation.isPending ? "Registering..." : "Register Business"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}