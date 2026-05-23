import { ContactForm } from '@/components/contact-form';

import { Button } from '@/components/ui/button';

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Me</h2>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-xl">
          Contact me to collaborate in the field of computer science.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-xl">
          <ContactForm />
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="w-full sm:w-64">
              <a href="https://s.id/chargerleptp" rel="noopener noreferrer">
                More Contact Details
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
