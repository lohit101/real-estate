import { BarChart3, Home, FileText, Users, MessageSquare, Megaphone } from "lucide-react"

export default function Highlights() {
  const services = [
    {
      icon: BarChart3,
      title: "Market Analysis",
      description: "In-depth understanding of market trends to guide pricing and strategy.",
    },
    {
      icon: Home,
      title: "Property Valuation",
      description: "Accurate assessments to determine the true value of your favourite apartment, cottage etc.",
    },
    {
      icon: FileText,
      title: "Legal Assistance",
      description: "Helping clients navigate the complexities of legal paperwork to ensure a smooth transaction.",
    },
    {
      icon: Users,
      title: "Post-Sale Support",
      description:
        "Providing assistance even after the sale, ensuring clients feel supported throughout their journey.",
    },
    {
      icon: MessageSquare,
      title: "Negotiation Skills",
      description: "In-depth understanding of market trends to guide pricing and strategy.",
    },
    {
      icon: Megaphone,
      title: "Tailored Marketing Plans",
      description: "Developing customized strategies to showcase properties and attract buyers.",
    },
  ]

  return (
    <div className="container mx-auto px-5 sm:px-40 sm:py-16">
      <h2 className="text-center text-[2.5rem] leading-tight font-bold text-[#0a1629] mb-16">
        Highlights of Our
        <br />
        Real-Estate Expertise
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col gap-1 p-8">
            <service.icon className="w-6 h-6 text-gray-800" strokeWidth={2.5} />
            <h3 className="text-md font-bold text-gray-900">{service.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

