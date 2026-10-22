'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SnowCap } from '@/components/ui/snow-cap';

export function ContactForm() {
  return (
    <Card className="relative overflow-visible">
      <SnowCap size="lg" />
      <form action="https://formsubmit.co/contact@evanpranawa.my.id" method="POST">
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your Name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="your@email.com" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="Your message..." className="min-h-[120px]" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full relative overflow-visible">
            <SnowCap size="sm" />
            <span>Send Message</span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
