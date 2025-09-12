interface StatsOverviewProps {
  totals: {
    total: number;
    byScope: Record<number, number>;
  };
}

export default function StatsOverview({ totals }: StatsOverviewProps) {
  return (
    <section className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="p-4 bg-black rounded-lg text-center">
        <h3 className="text-sm font-medium text-gray-400 mb-1">Total CO₂e (kg)</h3>
        <p className="text-2xl font-bold">{totals.total}</p>
      </div>
      <div className="p-4 bg-black rounded-lg text-center">
        <h3 className="text-sm font-medium text-gray-400 mb-1">Scope 1</h3>
        <p className="text-2xl font-bold">{Math.round(totals.byScope[1] * 100) / 100}</p>
      </div>
      <div className="p-4 bg-black rounded-lg text-center">
        <h3 className="text-sm font-medium text-gray-400 mb-1">Scope 2</h3>
        <p className="text-2xl font-bold">{Math.round(totals.byScope[2] * 100) / 100}</p>
      </div>
      <div className="p-4 bg-black rounded-lg text-center">
        <h3 className="text-sm font-medium text-gray-400 mb-1">Scope 3</h3>
        <p className="text-2xl font-bold">{Math.round(totals.byScope[3] * 100) / 100}</p>
      </div>
    </section>
  );
}