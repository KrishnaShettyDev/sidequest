'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: "What is Sidequest?",
    answer: "Sidequest is a platform that connects college students in Hyderabad with part-time gigs at aspirational venues like cafes, bookstores, gyms, co-working spaces, and more. Students can find flexible work opportunities that fit their schedule while gaining real-world experience."
  },
  {
    question: "What are the benefits of joining Sidequest?",
    answer: "Verified Opportunities: Access to verified venues and safe working environments. Flexible Schedule: Find gigs that work around your college timetable - weekends, evenings, or flexible hours. Real Experience: Build your resume with hands-on experience at cool venues. Easy Apply: One-tap application process with your complete profile. Direct Communication: Chat directly with employers after applying. No Fees: Completely free for students to use."
  },
  {
    question: "Who can use Sidequest?",
    answer: "Sidequest is designed for college students in Hyderabad looking for part-time work opportunities. Whether you're in your first year or final year, if you're looking for flexible gigs that don't interfere with your studies, Sidequest is for you."
  },
  {
    question: "What kind of gigs are available?",
    answer: "You'll find diverse opportunities including: Barista roles at cafes, Front desk at gyms and co-working spaces, Sales associates at bookstores and retail, Event staff at venues, Social media and content roles, Customer service positions, and many more across various categories."
  },
  {
    question: "How does Sidequest ensure safety?",
    answer: "We verify all employer venues before they can post gigs on our platform. Each listing includes venue details, location, and reviews. Students can also see employer profiles with photos and descriptions before applying. Our support team is available to help with any concerns."
  },
  {
    question: "How do I get started?",
    answer: "Getting started is easy: 1) Sign up with your Google account, 2) Complete your profile with your skills, availability, and preferences, 3) Browse gigs and apply with one tap, 4) Chat with employers and start your side quest!"
  },
  {
    question: "Is there any fee to use Sidequest?",
    answer: "Sidequest is completely free for students. There are no membership fees, application fees, or hidden charges. Simply sign up and start applying to gigs."
  },
  {
    question: "What areas in Hyderabad are covered?",
    answer: "We cover major areas including Jubilee Hills, Banjara Hills, Madhapur, Gachibowli, HITEC City, Kondapur, Kukatpally, Ameerpet, Secunderabad, and many more localities across Hyderabad."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="section-spacing-sm bg-secondary/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-title mb-4">
            Frequently Asked <span className="italic">Questions</span>
          </h2>
          <p className="text-body-lg text-muted-foreground">
            Everything you need to know about Sidequest
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="card-base overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="px-5 pb-5 text-body text-muted-foreground whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
