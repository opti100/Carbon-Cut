import { cn } from "@/lib/utils"
import { Marquee } from "./ui/marquee"

const reviews = [
  {
    name: "Sarah Chen",
    username: "@sarahc",
    body: "Outstanding platform that exceeded all expectations. The user experience is seamless and intuitive.",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "Michael Rodriguez",
    username: "@mrodriguez",
    body: "Incredible attention to detail. This solution has transformed how we approach our workflow.",
    img: "https://avatar.vercel.sh/michael",
  },
  {
    name: "Emily Watson",
    username: "@ewatson",
    body: "Professional grade quality with elegant simplicity. Highly recommended for any team.",
    img: "https://avatar.vercel.sh/emily",
  },
  {
    name: "David Kim",
    username: "@davidkim",
    body: "Remarkable innovation that delivers real results. The interface is both powerful and elegant.",
    img: "https://avatar.vercel.sh/david",
  },
  {
    name: "Lisa Thompson",
    username: "@lisaT",
    body: "Exceptional service and outstanding technical execution. This sets a new industry standard.",
    img: "https://avatar.vercel.sh/lisa",
  },
  {
    name: "Alex Parker",
    username: "@aparker",
    body: "Clean, efficient, and remarkably well-designed. Perfect balance of functionality and aesthetics.",
    img: "https://avatar.vercel.sh/alex",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative w-80 cursor-pointer overflow-hidden rounded-lg border p-6 transition-all duration-300",
        // light styles
        "border-gray-200 bg-white hover:border-orange-400 hover:shadow-sm",
        // dark styles
        "dark:border-gray-800 dark:bg-gray-900 dark:hover:border-orange-400"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <img 
            className="h-12 w-12 rounded-full object-cover" 
            alt={`${name} avatar`} 
            src={img} 
          />
          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <figcaption className="font-semibold text-gray-900 dark:text-white truncate">
              {name}
            </figcaption>
            <div className="h-1 w-1 rounded-full bg-green-500 flex-shrink-0"></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{username}</p>
          <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            &quot;{body}&quot;
          </blockquote>
        </div>
      </div>
    </figure>
  )
}

export function MarqueeDemo() {
  return (
    <div className="relative flex max-w-7xl mx-auto px-6 lg:px-8 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-16 rounded-2xl my-20">
      <div className="mb-8 text-center">
        <h3 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black">
          Trusted by professionals
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          See what our clients are saying about their experience
        </p>
      </div>
      
      <Marquee pauseOnHover className="[--duration:25s] py-4">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      
      {/* Gradient fade effects */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-950"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-950"></div>
    </div>
  )
}