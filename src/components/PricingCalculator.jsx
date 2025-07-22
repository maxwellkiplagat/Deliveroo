import React, { useState, useEffect } from 'react';
import { Calculator, Info, Package } from 'lucide-react';

function PricingCalculator({ weight, onPriceCalculated }) {
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [breakdown, setBreakdown] = useState({});

  const pricingTiers = [
    { min: 0, max: 1, rate: 12, label: 'Light Package (0-1kg)', color: 'text-green-600' },
    { min: 1, max: 5, rate: 10, label: 'Medium Package (1-5kg)', color: 'text-blue-600' },
    { min: 5, max: 20, rate: 8, label: 'Heavy Package (5-20kg)', color: 'text-orange-600' },
    { min: 20, max: Infinity, rate: 6, label: 'Extra Heavy (20kg+)', color: 'text-red-600' },
  ];

  const additionalFees = {
    base: 3,
    insurance: 1.5,
    handling: 2.5,
    fuel: 1,
  };

  useEffect(() => {
    if (weight > 0) {
      calculatePrice(weight);
    }
  }, [weight]);

  const calculatePrice = (weightValue) => {
    const tier = pricingTiers.find(t => weightValue > t.min && weightValue <= t.max);
    const basePrice = weightValue * tier.rate;
    const feesTotal = Object.values(additionalFees).reduce((sum, fee) => sum + fee, 0);
    const total = basePrice + feesTotal;
    
    const priceBreakdown = {
      weight: weightValue,
      tier: tier.label,
      tierColor: tier.color,
      rate: tier.rate,
      basePrice,
      fees: additionalFees,
      feesTotal,
      total: Math.round(total * 100) / 100,
    };

    setCalculatedPrice(priceBreakdown.total);
    setBreakdown(priceBreakdown);
    
    if (onPriceCalculated) {
      onPriceCalculated(priceBreakdown.total);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center space-x-2 mb-3">
        <Package className="h-4 w-4 text-emerald-600" />
        <h4 className="font-medium text-gray-900">Price Calculator</h4>
      </div>

      {weight > 0 && breakdown.total && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className={`font-medium ${breakdown.tierColor}`}>{breakdown.tier}</span>
            <span className="text-gray-600">${breakdown.rate}/kg</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base Cost ({breakdown.weight}kg × ${breakdown.rate})</span>
            <span>${breakdown.basePrice.toFixed(2)}</span>
          </div>
          
          <div className="border-t pt-2 space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Service Fee</span>
              <span>${breakdown.fees.base.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Insurance</span>
              <span>${breakdown.fees.insurance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Handling</span>
              <span>${breakdown.fees.handling.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Fuel Surcharge</span>
              <span>${breakdown.fees.fuel.toFixed(2)}</span>
            </div>
          </div>
          
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-emerald-600">${breakdown.total}</span>
          </div>
          
          <div className="flex items-start space-x-2 mt-3 p-2 bg-emerald-50 rounded">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-emerald-700">
              <strong>Savings:</strong> Heavier packages get better rates per kg!
            </p>
          </div>
        </div>
      )}

      {weight === 0 && (
        <p className="text-sm text-gray-500">Enter weight to calculate price</p>
      )}
      
      {weight === 0 && (
        <div className="mt-3 space-y-2">
          <h5 className="text-sm font-medium text-gray-700">Pricing Tiers:</h5>
          {pricingTiers.map((tier, index) => (
            <div key={index} className="flex justify-between text-xs">
              <span className={tier.color}>{tier.label}</span>
              <span className="text-gray-600">${tier.rate}/kg</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PricingCalculator;