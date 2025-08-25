
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ContactPage() {
  const courses = [
    "Mathematics",
    "Science",
    "History",
    "Arts",
    "English",
    "Social Studies",
    "Computer Science",
    "Music",
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-12 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Send className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Get In Touch</CardTitle>
            <p className="text-muted-foreground">We're here to help and answer any question you might have.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-semibold">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="Enter your phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course" className="font-semibold">Course Interested</Label>
                   <Select>
                    <SelectTrigger id="course">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course} value={course}>{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="font-semibold">Message</Label>
                <Textarea id="message" placeholder="Enter your message" className="min-h-[150px]" />
              </div>
              <Button type="submit" size="lg" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <MapPin className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle>Our Address</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">E-18 KRISHAN VIHAR, NEAR HARIRAM KANJHWALA ROAD, DELHI-110086</p>
                </CardContent>
            </Card>
             <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Phone className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle>Call Us</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">(123) 456-7890</p>
                </CardContent>
            </Card>
             <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle>Email Us</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">contact@idleducation.com</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
