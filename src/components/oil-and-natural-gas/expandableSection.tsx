"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { BlurFade } from "../ui/blur-fade";

export function ExpandableSection() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null!);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>

    <div className="mt-20 font-mono">
            <BlurFade delay={0.1} inView className="mb-6 text-right max-w-7xl mx-auto px-4">
              <p className="text-[#6c5f31] text-sm sm:text-base md:text-lg leading-relaxed">
               Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, doloremque?
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#6c5f31] leading-[1.15]">
                Expandable section
              </h2>
            </BlurFade>
          </div>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-[#6c5f31] text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row ">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-4 py-2 text-sm rounded-full  bg-[#d1cebb] hover:bg-[#6c5f31] hover:text-white text-black mt-4 md:mt-0"
            >
              {card.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "subheading 1",
    title: "title one",
    src: "/nature-carbon.jpg",
    ctaText: "view  more",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit, iure dicta pariatur cumque nisi asperiores aliquam magni consequatur, quidem quis sequi beatae corrupti nostrum officia harum quos ex nemo laborum eveniet enim iusto? Animi, suscipit dolorum. Eos commodi natus aliquam soluta cum ea sunt, accusantium expedita, error totam ipsam incidunt? Mollitia minima perferendis placeat excepturi veritatis! Dicta repellat perspiciatis odit aliquid consequuntur ut a expedita repudiandae neque voluptas error molestiae iusto iste dignissimos animi ipsam at blanditiis, corporis, labore laudantium tempore!
        </p>
      );
    },
  },
  {
    description: "subheading 2",
    title: "title two",
    src: "/abstract-gray.jpg",
    ctaText: "view more",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
         Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, unde rerum! Quaerat, praesentium accusamus error illum dolor aliquid quam veniam facere provident delectus nostrum voluptates placeat velit recusandae quae quidem sit itaque ad sapiente repudiandae reprehenderit, quis incidunt ullam. Consequatur repellendus cupiditate nobis magnam beatae natus corrupti explicabo quasi omnis sunt ex excepturi, voluptate minima eos dignissimos aut eius soluta quas. Ullam repudiandae velit voluptas molestiae debitis amet cumque distinctio, sit repellat perferendis illo. Nulla doloribus minima modi, labore unde quasi laboriosam necessitatibus ipsa temporibus nobis mollitia quis nesciunt deserunt at dolor, voluptas exercitationem esse repudiandae officia! Consectetur, ut perferendis.
        </p>
      );
    },
  },

  {
    description: "subheading 3",
    title: "title three",
    src: "/hero.jpg",
    ctaText: "view more",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi, iure eos? Tenetur repellendus minima porro soluta saepe consectetur officiis eveniet, illo ipsum nulla incidunt minus commodi sed nam velit dicta ea aperiam nostrum voluptate sapiente accusamus aspernatur voluptates labore nisi. Nam, corporis perspiciatis eos explicabo, culpa ut ipsam modi provident repellendus eius fuga quasi cumque ab accusantium, veritatis hic dolor!
        </p>
      );
    },
  },
  {
    description: "subheading 4",
    title: "title four",
    src: "/green-moss.jpg",
    ctaText: "view more",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
         Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi eos, esse, omnis vel optio dignissimos deleniti magni sit dolore necessitatibus maxime et quaerat obcaecati voluptate totam debitis consectetur odio corrupti ipsum suscipit! Expedita, id voluptatum eum fugiat itaque, quo quae autem quasi fuga rem corporis quidem libero dolores tempore, facilis molestias ut beatae ipsum accusantium asperiores aliquid ipsa consequuntur. Molestias deleniti recusandae vel esse culpa facere aliquid quo et vero omnis dicta voluptatum consectetur harum, quaerat, ex sit repellendus laborum, ipsam doloribus ducimus sequi! Perferendis nisi dolor maxime deleniti deserunt.
        </p>
      );
    },
  },
  {
    description: "subheading 5",
    title: "title five",
    src: "/auth-hero.jpg",
    ctaText: "view more",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea tempore asperiores rem adipisci doloremque ab delectus est reiciendis sit accusantium, atque voluptate porro voluptas facilis at omnis dignissimos eaque. Saepe consectetur repellat perferendis quibusdam assumenda dolorem, ratione nesciunt id nobis placeat facere qui molestias consequuntur nisi omnis quo dicta veniam? Inventore corporis nam, possimus tempora fuga distinctio excepturi saepe animi.
        </p>
      );
    },
  },
];
