"use client"

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GetinTouchModal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("messages").insert([{ name, email, message }]);

    if (error) {
      console.error("Error submitting message:", error);
    } else {
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    }

    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer flex flex-row gap-2 bg-black rounded-full py-2 px-4 hover:px-6 my-2 text-center text-sm transition-all duration-500 text-white w-max group">
          Get in touch
          <p className="rotate-45 group-hover:rotate-90 transition-all duration-500">&uarr;</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Get in Touch</DialogTitle>
          <DialogDescription>
            Send us a message and we'll get back to you as soon as possible with answers to all your queries.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-full"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="email" className="text-right">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full"
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="col-span-3 border border-gray-200 rounded-2xl text-sm p-2 w-full"
                placeholder="Your message here"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <button type="submit" disabled={loading} className="cursor-pointer flex flex-row gap-2 bg-black rounded-full py-2 px-4 hover:px-6 my-2 text-center text-sm transition-all duration-500 text-white w-max group">
              {loading ? "Sending..." : "Send Message"}
              <p className="rotate-45 group-hover:rotate-90 transition-all duration-500">&uarr;</p>
            </button>
          </DialogFooter>
        </form>
        {success && <p className="text-green-500 mt-4 text-xs">Message sent successfully!</p>}
      </DialogContent>
    </Dialog>
  );
}
