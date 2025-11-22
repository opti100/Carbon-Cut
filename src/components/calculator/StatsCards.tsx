import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChartColumn, Globe, Recycle, SplitIcon } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalActivities: number;
    channels: number;
    markets: number;
    totalCO2e: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="lg:col-span-1 h-full pt-15">
      <div className="grid grid-cols-2 gap-x-4 gap-y-20" >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg p-2 text-center flex flex-col items-center justify-center"
          style={{ backgroundColor: "", border: "" }}
        >
          {/* Circle with ChartColumn inside */}
          <div
            className="flex items-center justify-center mb-2 rounded-full"
            style={{
              width: "120px",
              height: "120px",
              backgroundColor: "#d1cebb",
            }}
          >
            <div className="flex items-center justify-center">
              <ChartColumn width={50} height={50} className="text-[#6c5f31]" />
            </div>
          </div>

          <div
            className="flex items-center justify-center flex-nowrap whitespace-nowrap"
            style={{ color: "#6c5f31" }}
          >
            Total Activities
            <span style={{ color: "#d1cebb" }} className="mx-1">
              -
            </span>
            <span
              className="text-xl font-semibold"
              style={{ color: "#6c5f31" }}
            >
              {stats.totalActivities}
            </span>
          </div>
        </motion.div>

       <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg p-2 text-center flex flex-col items-center justify-center"
          style={{ backgroundColor: "", border: "" }}
        >
          {/* Circle with ChartColumn inside */}
          <div
            className="flex items-center justify-center mb-2 rounded-full"
            style={{
              width: "120px",
              height: "120px",
              backgroundColor: "#d1cebb",
            }}
          >
            <div className="flex items-center justify-center">
              <SplitIcon width={50} height={50} className="text-[#6c5f31]" />
            </div>
          </div>

          <div
            className="flex items-center justify-center flex-nowrap whitespace-nowrap"
            style={{ color: "#6c5f31" }}
          >
            Channels
            <span style={{ color: "#d1cebb" }} className="mx-1">
              -
            </span>
            <span
              className="text-xl font-semibold"
              style={{ color: "#6c5f31" }}
            >
              {stats.channels}
            </span>
          </div>
        </motion.div>

         <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg p-2 text-center flex flex-col items-center justify-center"
          style={{ backgroundColor: "", border: "" }}
        >
          {/* Circle with ChartColumn inside */}
          <div
            className="flex items-center justify-center mb-2 rounded-full"
            style={{
              width: "120px",
              height: "120px",
              backgroundColor: "#d1cebb",
            }}
          >
            <div className="flex items-center justify-center">
              <Globe width={50} height={50} className="text-[#6c5f31]" />
            </div>
          </div>

          <div
            className="flex items-center justify-center flex-nowrap whitespace-nowrap"
            style={{ color: "#6c5f31" }}
          >
            Markets
            <span style={{ color: "#d1cebb" }} className="mx-1">
              -
            </span>
            <span
              className="text-xl font-semibold"
              style={{ color: "#6c5f31" }}
            >
              {stats.markets}
            </span>
          </div>
        </motion.div>

         <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg p-2 text-center flex flex-col items-center justify-center"
          style={{ backgroundColor: "", border: "" }}
        >
          {/* Circle with ChartColumn inside */}
          <div
            className="flex items-center justify-center mb-2 rounded-full"
            style={{
              width: "120px",
              height: "120px",
              backgroundColor: "#d1cebb",
            }}
          >
            <div className="flex items-center justify-center">
              <Recycle width={50} height={50} className="text-[#6c5f31]" />
            </div>
          </div>

          <div
            className="flex items-center justify-center flex-nowrap whitespace-nowrap"
            style={{ color: "#6c5f31" }}
          >
            Total  CO <sub>2</sub>e
            <span style={{ color: "#d1cebb" }} className="mx-1">
              -
            </span>
            <span
              className="text-xl font-semibold"
              style={{ color: "#b0ea1d" }}
            >
              {stats.totalCO2e.toFixed(2)} kg
            </span>
          </div>
        </motion.div>
      </div>
    </div>
   
  );
}
