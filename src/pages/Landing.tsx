import { Button } from "@/components/ui/button"; import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; import { Badge } from "@/components/ui/badge"; import { MessageCircle, Zap, Users, BarChart3, ShieldCheck, ArrowRight, Clock, Workflow, CheckCircle2, } from "lucide-react";

/**

MARKETING LANDING PAGE

Fully aligned with existing dashboard theme (shadcn + Tailwind tokens) */ export default function LandingPage() { return (

 <div className="min-h-screen bg-background text-foreground">
   {/* ================= HERO ================= */}
   <section className="max-w-7xl mx-auto px-6 pt-28 pb-24 text-center">
     <Badge variant="secondary" className="mb-5">
       WhatsApp Business Automation
     </Badge><h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
   Turn WhatsApp Conversations<br />
   Into <span className="text-primary">Leads, Sales & Growth</span>
 </h1>

 <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
   Automate replies, capture qualified leads, and send high‑converting broadcasts — all from a single dashboard designed for serious businesses.
 </p>

 <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
   <Button size="lg" className="gap-2">
     Start Free <ArrowRight className="w-4 h-4" />
   </Button>
   <Button size="lg" variant="outline">
     Book Live Demo
   </Button>
 </div>

 <p className="mt-4 text-sm text-muted-foreground">
   No credit card required • Setup in minutes
 </p>

   </section>{/* ================= TRUST / PROBLEM ================= */}

   <section className="bg-muted/30 border-y">
     <div className="max-w-6xl mx-auto px-6 py-20">
       <div className="grid md:grid-cols-3 gap-6">
         <Problem
           icon={Clock}
           title="Slow Manual Replies"
           desc="Customers expect instant responses. Delays cost trust and sales." />
         <Problem
           icon={Workflow}
           title="Untracked WhatsApp Leads"
           desc="Important conversations disappear in chat history." />
         <Problem
           icon={BarChart3}
           title="No Visibility or Control"
           desc="You send messages but have no idea what converts." />
       </div>
     </div>
   </section>{/* ================= SOLUTION ================= */}

   <section className="max-w-7xl mx-auto px-6 py-28">
     <div className="text-center mb-16">
       <h2 className="text-3xl md:text-4xl font-bold">
         One Platform. Total WhatsApp Control.
       </h2>
       <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
         We replace manual chatting with smart automation that works 24/7 — without breaking WhatsApp rules.
       </p>
     </div><div className="grid md:grid-cols-3 gap-6">
   <Feature
     icon={Zap}
     title="Smart Auto‑Reply Engine"
     desc="Respond instantly using keywords, intent signals, and synonym matching — never miss a customer." />
   <Feature
     icon={Users}
     title="Lead Capture & Qualification"
     desc="Every chat becomes a structured lead with status, intent, and history." />
   <Feature
     icon={MessageCircle}
     title="Broadcast Campaigns"
     desc="Send targeted WhatsApp campaigns that feel personal, not spammy." />
   <Feature
     icon={BarChart3}
     title="Real‑Time Analytics"
     desc="Track delivery, replies, conversions, and campaign performance." />
   <Feature
     icon={ShieldCheck}
     title="Secure Session Management"
     desc="QR‑based login with session persistence and safety controls." />
   <Feature
     icon={Workflow}
     title="Built for Scale"
     desc="Multiple numbers, teams, templates, and future automation layers." />
 </div>

   </section>{/* ================= HOW IT WORKS ================= */}

   <section className="bg-muted/30 border-y">
     <div className="max-w-6xl mx-auto px-6 py-28">
       <h2 className="text-3xl font-bold text-center mb-14">How It Works</h2><div className="grid md:grid-cols-4 gap-6">
     <Step n={1} title="Connect WhatsApp" desc="Securely scan QR and go live." />
     <Step n={2} title="Create Automation" desc="Set replies, keywords, and flows." />
     <Step n={3} title="Capture Leads" desc="Chats become structured data." />
     <Step n={4} title="Track & Optimize" desc="Measure what converts." />
   </div>
 </div>

   </section>{/* ================= USE CASES ================= */}

   <section className="max-w-7xl mx-auto px-6 py-28">
     <h2 className="text-3xl font-bold text-center mb-16">
       Who Is This Built For?
     </h2><div className="grid md:grid-cols-3 gap-6">
   <UseCase title="Online Businesses" items={["Instant replies", "Lead follow‑ups", "Sales automation"]} />
   <UseCase title="Agencies & Marketers" items={["Campaign broadcasts", "Lead tagging", "Client reporting"]} />
   <UseCase title="SMEs & Enterprises" items={["Support automation", "Multi‑agent teams", "Analytics"]} />
 </div>

   </section>{/* ================= FINAL CTA ================= */}

   <section className="bg-primary text-primary-foreground">
     <div className="max-w-6xl mx-auto px-6 py-28 text-center">
       <h2 className="text-4xl font-bold">
         Stop Managing Chats.<br />Start Scaling Conversations.
       </h2>
       <p className="mt-5 text-primary-foreground/80 max-w-2xl mx-auto">
         Businesses using automation respond faster, convert more, and waste less time.
       </p>
       <Button size="lg" variant="secondary" className="mt-10 gap-2">
         Get Started Free <ArrowRight className="w-4 h-4" />
       </Button>
     </div>
   </section>{/* ================= FOOTER ================= */}

   <footer className="border-t">
     <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-muted-foreground flex flex-col md:flex-row justify-between gap-4">
       <span>© {new Date().getFullYear()} WhatsApp Automator</span>
       <div className="flex gap-6">
         <a className="hover:text-foreground" href="#">Privacy</a>
         <a className="hover:text-foreground" href="#">Terms</a>
         <a className="hover:text-foreground" href="#">Contact</a>
       </div>
     </div>
   </footer>
 </div>
); }

/* ================= SUB COMPONENTS ================= */ function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) { return ( <Card className="border-muted/60"> <CardHeader> <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center"> <Icon className="w-5 h-5" /> </div> <CardTitle className="text-lg mt-4">{title}</CardTitle> </CardHeader> <CardContent className="text-sm text-muted-foreground">{desc}</CardContent> </Card> ); }

function Problem({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) { return ( <Card className="border-muted/60"> <CardHeader> <div className="w-9 h-9 rounded-md bg-destructive/10 text-destructive flex items-center justify-center"> <Icon className="w-4 h-4" /> </div> <CardTitle className="text-lg mt-3">{title}</CardTitle> </CardHeader> <CardContent className="text-sm text-muted-foreground">{desc}</CardContent> </Card> ); }

function Step({ n, title, desc }: { n: number; title: string; desc: string }) { return ( <Card className="text-center border-muted/60"> <CardHeader> <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold"> {n} </div> <CardTitle className="text-base mt-4">{title}</CardTitle> </CardHeader> <CardContent className="text-sm text-muted-foreground">{desc}</CardContent> </Card> ); }

function UseCase({ title, items }: { title: string; items: string[] }) { return ( <Card className="border-muted/60"> <CardHeader> <CardTitle className="text-lg">{title}</CardTitle> </CardHeader> <CardContent className="space-y-2"> {items.map((i) => ( <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground"> <CheckCircle2 className="w-4 h-4 text-primary" /> {i} </div> ))} </CardContent> </Card> ); }