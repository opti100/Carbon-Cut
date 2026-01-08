"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SwipeSection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const panels = containerRef.current.querySelectorAll(".panel");
    panelsRef.current = Array.from(panels) as HTMLElement[];

    // Set initial state for entrance animation
    gsap.set(containerRef.current, {
      opacity: 0,
      y: 60,
    });

    gsap.set(panels, {
      yPercent: (i) => (i === 0 ? 0 : 100),
      opacity: 0,
    });

    // Entrance animation triggered by Standards section
    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#standards-section",
        start: "bottom center",
        toggleActions: "play none none reverse",
      }
    });

    entranceTl
      .to(containerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      })
      .to(panels, {
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      }, "-=0.4");

    // Create scroll trigger for each panel slide-up
    panels.forEach((panel, index) => {
      if (index === 0) return;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: () => `top+=${index * 100}% top`,
        end: () => `top+=${(index + 1) * 100}% top`,
        scrub: 1,
        onEnter: () => {
          gsap.to(panel, {
            yPercent: 0,
            duration: 1,
            ease: "power2.inOut",
          });
        },
        onLeaveBack: () => {
          gsap.to(panel, {
            yPercent: 100,
            duration: 1,
            ease: "power2.inOut",
          });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <div className="swipe-section" ref={containerRef}>
        <section className="panel red">
          <div className="panel-content">
            <h2 className="text-5xl font-bold mb-4">Carbon Impact</h2>
            <p className="text-xl">Reducing emissions for a sustainable future</p>
          </div>
        </section>
        <section className="panel purple">
          <div className="panel-content">
            <h2 className="text-5xl font-bold mb-4">Climate Action</h2>
            <p className="text-xl">Join the movement towards net-zero emissions</p>
          </div>
        </section>
        <section className="panel blue">
          <div className="panel-content">
            <h2 className="text-5xl font-bold mb-4">Verified Projects</h2>
            <p className="text-xl">Supporting certified carbon offset initiatives</p>
          </div>
        </section>
        <section className="panel orange">
          <div className="panel-content">
            <h2 className="text-5xl font-bold mb-4">Global Reach</h2>
            <p className="text-xl">Making a difference across continents</p>
          </div>
        </section>
      </div>

      <div style={{ height: "100vh", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h2 className="text-4xl font-semibold text-gray-800">Rest of the page</h2>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .swipe-section {
          position: relative;
          height: 400vh;
          width: 100%;
        }

        .swipe-section .panel {
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .panel {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 600;
          color: white;
          padding: 10px;
        }

        .panel-content {
          text-align: center;
          max-width: 800px;
          padding: 2rem;
        }

        .red {
          background-color: #dc2626;
        }
        .purple {
          background-color: #7c3aed;
        }
        .blue {
          background-color: #2563eb;
        }
        .orange {
          background-color: #ea580c;
        }
      `}</style>
    </>
  );
};

export default SwipeSection;