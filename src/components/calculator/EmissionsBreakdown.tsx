interface EmissionsBreakdownProps {
  totals: {
    total: number;
    byChannel: Record<string, number>;
    byMarket: Record<string, number>;
    byScope: Record<number, number>;
  };
}

export default function EmissionsBreakdown({ totals }: EmissionsBreakdownProps) {
  return (
    <section className="mb-8 p-6 bg-black rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Emissions Breakdown</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">By Channel</h3>
          <div className="bg-black p-4 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left pb-2">Channel</th>
                  <th className="text-right pb-2">CO₂e (kg)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(totals.byChannel)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([channel, co2]) => (
                    <tr key={channel} className="border-b border-gray-700 last:border-b-0">
                      <td className="py-2">{channel}</td>
                      <td className="py-2 text-right">{Math.round(co2 * 100) / 100}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">By Market</h3>
          <div className="bg-black p-4 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left pb-2">Market</th>
                  <th className="text-right pb-2">CO₂e (kg)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(totals.byMarket)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([market, co2]) => (
                    <tr key={market} className="border-b border-gray-700 last:border-b-0">
                      <td className="py-2">{market}</td>
                      <td className="py-2 text-right">{Math.round(co2 * 100) / 100}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">By Scope</h3>
          <div className="bg-black p-4 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left pb-2">Scope</th>
                  <th className="text-right pb-2">CO₂e (kg)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(totals.byScope).map(([scope, co2]) => (
                  <tr key={scope} className="border-b border-gray-700 last:border-b-0">
                    <td className="py-2">{scope}</td>
                    <td className="py-2 text-right">{Math.round(co2 * 100) / 100}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}