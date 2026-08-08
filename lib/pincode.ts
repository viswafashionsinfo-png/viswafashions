// Simulated pincode -> city/state lookup, as requested in the brief
// ("Check Pincode button that simulates auto-filling City and State").
// This is intentionally NOT a real API call. If you later want live lookups,
// swap the body of `lookupPincode` for a fetch to India Post's API
// (https://api.postalpincode.in/pincode/{pincode}) — everything else in
// CheckoutForm.tsx stays the same.

const MOCK_PINCODE_DB: Record<string, { city: string; state: string }> = {
  '500001': { city: 'Hyderabad', state: 'Telangana' },
  '500034': { city: 'Hyderabad', state: 'Telangana' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '560001': { city: 'Bengaluru', state: 'Karnataka' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '110001': { city: 'New Delhi', state: 'Delhi' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat' },
  '411001': { city: 'Pune', state: 'Maharashtra' },
  '682001': { city: 'Kochi', state: 'Kerala' },
};

export function lookupPincode(pincode: string): { city: string; state: string } | null {
  if (MOCK_PINCODE_DB[pincode]) return MOCK_PINCODE_DB[pincode];

  // Fallback so *any* valid-looking 6-digit pincode still demos nicely:
  // first digit of an Indian PIN maps to a broad postal region.
  if (/^\d{6}$/.test(pincode)) {
    const region = pincode[0];
    const regionMap: Record<string, { city: string; state: string }> = {
      '1': { city: 'New Delhi', state: 'Delhi' },
      '2': { city: 'Lucknow', state: 'Uttar Pradesh' },
      '3': { city: 'Jaipur', state: 'Rajasthan' },
      '4': { city: 'Mumbai', state: 'Maharashtra' },
      '5': { city: 'Hyderabad', state: 'Telangana' },
      '6': { city: 'Chennai', state: 'Tamil Nadu' },
      '7': { city: 'Kolkata', state: 'West Bengal' },
      '8': { city: 'Patna', state: 'Bihar' },
    };
    return regionMap[region] ?? null;
  }

  return null;
}
