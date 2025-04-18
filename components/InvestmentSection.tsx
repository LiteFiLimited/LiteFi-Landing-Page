import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Settings, Lock } from "lucide-react"
import image1 from "@/assets/images/image1.png"
import invest1 from "@/assets/images/invest1.png"

export default function InvestmentSection() {
  return (
    <section className="bg-white text-black section-padding">
      <div className="container mx-auto container-padding">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="section-title-red mb-4">WHY CHOOSE LITEFI INVESTMENT?</div>
            <h2 className="heading-secondary text-black mb-6">Earn Up to 30% Returns on Your Investments.</h2>
            <p className="text-gray-600 mb-8">
              Take control of your financial future with LiteFi's smart and secure investment options. Watch your money
              grow faster with potential returns of up to 30% per year. We offer flexible investment plans to help you
              reach your financial goals, whether it's short-term or long-term wealth building.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-center">
                <div className="bg-black circle-container w-10 h-10 md:w-12 md:h-12 flex items-center justify-center p-2 mr-4">
                  <Settings className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Flex Investment:</h3>
                  <p className="text-sm text-gray-600">
                    Enjoy the freedom of free withdrawals while earning high interest.
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-black circle-container w-10 h-10 md:w-12 md:h-12 flex items-center justify-center p-2 mr-4">
                  <Lock className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Goal Investment:</h3>
                  <p className="text-sm text-gray-600">
                    Set specific financial goals and save consistently with attractive returns.
                  </p>
                </div>
              </div>
            </div>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white no-radius px-8 py-3 h-auto text-base font-medium w-48">
              Get Started
            </Button>
          </div>

          <div className="relative">
            {/* Stacked Images */}
            <div className="relative h-[400px]">
              <div className="absolute right-0 bottom-20 w-[90%] z-10">
                <Image
                  src={invest1}
                  alt="Investment 1"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute left-0 bottom-0 w-[35%] z-20">
                <Image
                  src={image1}
                  alt="Investment 2"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
