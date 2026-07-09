import { countryAllocation } from "../mock-data";

export function CountryAllocationCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Country Allocation
      </h2>

      <div className="mt-5 space-y-4">
        {countryAllocation.map((country) => (
          <div key={country.id}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-slate-700">
                {country.country}
              </span>
              <span className="text-slate-500">{country.percentage}%</span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-950"
                style={{ width: `${country.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
