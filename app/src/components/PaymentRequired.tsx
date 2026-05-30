import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { AlertCircle, CreditCard } from "lucide-react";

export function PaymentRequired() {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-8 mb-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="bg-yellow-100 rounded-full p-3">
          <AlertCircle className="w-6 h-6 text-yellow-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-yellow-900 mb-2">
            🔒 Payment Required
          </h3>
          <p className="text-yellow-800 mb-4 leading-relaxed">
            Complete your payment to unlock all features, access the exclusive community, 
            and secure your spot at the May 29, 2026 event.
          </p>
          <div className="flex gap-3">
            <Link to="/join">
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                <CreditCard className="w-4 h-4 mr-2" />
                Complete Payment
              </Button>
            </Link>
            <Link to="/join">
              <Button variant="outline" className="border-yellow-300 text-yellow-800 hover:bg-yellow-100">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
