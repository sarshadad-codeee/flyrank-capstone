"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ShadcnDemo() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="keys">
        <TabsList variant="line">
          <TabsTrigger value="keys">Keys</TabsTrigger>
          <TabsTrigger value="focus">Focus</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="keys">Arrow keys move between tabs.</TabsContent>
        <TabsContent value="focus">Only one tab is in the Tab order.</TabsContent>
        <TabsContent value="roles">Tablist, tab and tabpanel roles.</TabsContent>
      </Tabs>
      <Dialog>
        <DialogTrigger className="rounded border border-gray-400 px-4 py-2 font-medium">
          Open shadcn dialog
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>shadcn dialog</DialogTitle>
            <DialogDescription>
              Press Escape to close it and return to the button.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
