import { Navbar } from "@/components/navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 pb-16 pt-28 md:px-10 lg:px-16">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">About Me</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/80 md:text-lg">
          I build software that protects freedom and privacy. This page is a stub and
          will be expanded with background, principles, and the work I am focused on.
        </p>
      </section>
    </main>
  );
}
