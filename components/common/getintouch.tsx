"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DivideCircle } from "lucide-react"

export default function GetinTouchModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="cursor-pointer flex flex-row gap-2 bg-black rounded-full py-2 px-4 hover:px-6 my-2 text-center text-sm transition-all duration-500 text-white w-max group">
                    Get in touch
                    <p className="rotate-45 group-hover:rotate-90 transition-all duration-500">&uarr;</p>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Get in Touch</DialogTitle>
                    <DialogDescription>
                        Send us a message and we'll get back to you as soon as possible with answers to all your queries.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            defaultValue=""
                            className="col-span-3"
                            placeholder="Your Name"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            defaultValue=""
                            className="col-span-3"
                            placeholder="email@example.com"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Message
                        </Label>
                        <textarea
                            id="message"
                            defaultValue=""
                            className="col-span-3 border border-gray-200 rounded-md text-sm p-2"
                            placeholder="Your message here"
                        >
                        </textarea>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Send Message</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
