import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function Faq() {
    const faqs = [
        {
            question: "What is the process of buying a commercial property?",
            answer: "The process involves securing financing, finding a suitable property, conducting due diligence, making an offer, and closing the deal."
        },
        {
            question: "How do I determine my budget for a commercial property?",
            answer: "Consider your business's financial health, projected income, expenses, and how much you can afford for a down payment. It's also important to get pre-approved for a commercial mortgage."
        },
        {
            question: "What should I look for in a commercial property location?",
            answer: "Consider factors like accessibility, zoning regulations, proximity to suppliers and customers, and the overall economic health of the area."
        },
        {
            question: "How can I find a good commercial real estate agent?",
            answer: "Look for agents with experience in commercial properties, good reviews, ask for recommendations from business associates, and interview multiple agents to find one you are comfortable with."
        },
        {
            question: "What are the typical closing costs for commercial properties?",
            answer: "Closing costs for commercial properties include loan origination fees, title insurance, appraisal fees, environmental assessments, and legal fees."
        }
    ];

    return (
        <div className="container mx-auto px-5 sm:px-40 py-16">
            <h2 className="text-center text-[2.5rem] leading-tight font-bold text-[#0a1629] mb-16">
                Frequently Asked
                <br />
                Questions
            </h2>

            <Accordion type="single" collapsible className="w-full px-5 sm:px-20">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index + 1}`}>
                        <AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
                        <AccordionContent className="font-medium">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
