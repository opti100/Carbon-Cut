import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import UniversalHeading from "../UniversalHeading";

export default function ProblemWeareSolving() {
  return (
    <section className="w-full max-w-7xl mx-auto py-16 px-4 space-y-24">

      {/* Heading */}
     <UniversalHeading title="The Problem We're Solving" />

      {/* ----------- BLOCK 1 ----------- */}
      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* Image card */}
        <div className="bg-green-50 rounded-2xl p-6 border">
          <div className="w-full h-64 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
            <span className="text-gray-500">Image / mockup here</span>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-4">
          

          <h3 className="text-xl font-semibold">
           Traditional carbon accounting wasn't built for digital businesses.
          </h3>

          <ul className="space-y-2 text-sm">
            <li>If you're running an e-commerce platform, a SaaS product, or a streaming service, the old rules don't apply. Standard carbon calculators focus on manufacturing, shipping, and office spaces.</li>
            <li>They completely miss the elephant in the room: your digital infrastructure, where thrid of the customer are care about sustainability and prefer buying form companies which is environmental conscious.</li>
          </ul>
        </div>
      </div>

      {/* ----------- BLOCK 2 ----------- */}
      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* Text */}
        {/* <div className="space-y-4 order-2 md:order-1">
          <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
            Précision
          </span>

          <h3 className="text-xl font-semibold">
            Plus de 4 000 rapports GES livrés : Générez le vôtre
          </h3>

          <ul className="space-y-2 text-sm">
            <li>• Analysez les scopes 1, 2, 3 avec données activité & dépenses.</li>
            <li>• Accédez à des analyses granulaires (unités, sites, etc.).</li>
            <li>• Base de +350 000 facteurs d'émission.</li>
          </ul>
        </div> */}

         <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />

        {/* Image */}
        <div className="bg-green-900 rounded-2xl p-6 border order-1 md:order-2">
          <div className="w-full h-64 bg-green-800 rounded-xl flex items-center justify-center">
            <span className="text-gray-300">Logos / database mockup</span>
          </div>
        </div>
      </div>

      {/* ----------- BLOCK 3 ----------- */}
      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* Image */}
        <div className="bg-green-50 rounded-2xl p-6 border">
          <div className="w-full h-64 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
            <span className="text-gray-500">Table / objectives mockup</span>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-4">
          <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
            Impact
          </span>

          <h3 className="text-xl font-semibold">
            Maximisez l'impact avec une feuille de route générée par l'IA
          </h3>

          <ul className="space-y-2 text-sm">
            <li>• Passez de l’analyse à l’action en quelques secondes.</li>
            <li>• Ajoutez les données fournisseurs automatiquement.</li>
            <li>• Compatible SBTi, stratégie complète intégrée.</li>
          </ul>
        </div>
      </div>

    </section>
  );
}


const testimonials = [
  {
    quote:
      " No visibility into internet emissions from websites, apps, and cloud services",
    title: "Blind Spots",
  },
  {
    quote:
      " Enterprise carbon platforms cost $50K-$200K annually",
    title: "Expensive Tools",
  },
  {
    quote: " Months of implementation with specialised consultants",
    title: "Complex Setup",
  },
  {
    quote:
      "Annual or quarterly reports that are obsolete by the time you see them",
    title: "Outdated Data",
  },
  {
    quote:
      "Separate tools for ads, websites, cloud - no unified view",
    title: "Fragmented Picture",
  },
  {
    quote:
      "New climate disclosure laws with no clear way to comply",
    title: "Regulatory Pressure",
  },
];
