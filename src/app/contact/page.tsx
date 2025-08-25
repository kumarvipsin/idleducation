import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Get in Touch</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80">
          We'd love to hear from you! Whether you have a question about our platform, features, or anything else, our team is ready to answer all your questions.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-6 h-6 text-primary" />
              Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Enter your message" className="min-h-[150px]" />
              </div>
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-base sm:text-lg">
                    <div className="flex items-start sm:items-center gap-4">
                        <MapPin className="w-6 h-6 text-primary mt-1 sm:mt-0" />
                        <span>E-18 KRISHAN VIHAR, NEAR HARIRAM KANJHWALA ROAD, DELHI-110086</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="w-6 h-6 text-primary" />
                        <span>(123) 456-7890</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail className="w-6 h-6 text-primary" />
                        <span>contact@idleducation.com</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
