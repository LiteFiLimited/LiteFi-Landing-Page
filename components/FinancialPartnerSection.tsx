import { Button } from "@/components/ui/button"

export default function FinancialPartnerSection() {
  return (
    <section className="bg-black text-white py-16">
      <div className="container mx-auto container-padding">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
          <h2 className="font-bold text-3xl md:text-4xl leading-tight md:leading-tight text-left">
          Your All-in-One<br />Financial Partner
          </h2>
          </div>

          <div>
            <p className="text-gray-400 mb-6">
            With LiteFi, you can easily access quick loans using your car as collateral and grow your wealth through diverse investment opportunities. 
            Join thousands of Nigerians who trust LiteFi for a convenient and reliable financial experience.
            </p>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white no-radius px-8 py-3 h-auto text-base font-medium w-48">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
