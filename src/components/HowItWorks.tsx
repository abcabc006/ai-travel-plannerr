import { motion } from "motion/react";
import { FormInput, Sparkles, Map } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: FormInput,
    color: "text-core-blue",
    bg: "bg-core-blue/10",
    title: "Fill the Form",
    description: "Tell us your destination, dates, travel style, and budget"
  },
  {
    id: 2,
    icon: Sparkles,
    color: "text-accent-yellow",
    bg: "bg-accent-yellow/10",
    title: "AI Builds Your Plan",
    description: "Our AI crafts a day-by-day itinerary with top spots, food, timing & deals"
  },
  {
    id: 3,
    icon: Map,
    color: "text-fresh-green",
    bg: "bg-fresh-green/10",
    title: "Explore & Go",
    description: "Browse your full plan, track expenses, and find aggregated booking links"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#EBF4FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-16">
          <span className="text-fresh-green text-[13px] font-bold uppercase tracking-widest">How it works?</span>
          <h2 className="text-deep-navy text-4xl font-bold mt-4">Plan your dream trip in 3 simple steps</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Animated arrows would go here in a more complex SVG setup */}
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white p-8 rounded-card shadow-card hover:-translate-y-1 hover:border-t-3 hover:border-primary-red transition-all group"
            >
              <div className="relative mb-8 inline-block">
                <div className={step.bg + " p-5 rounded-2xl"}>
                  <step.icon className={step.color + " w-8 h-8"} />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary-red/5 rounded-full flex items-center justify-center text-primary-red font-display text-2xl font-bold opacity-20 group-hover:opacity-100 transition-opacity">
                  {step.id}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-text text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
