import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
    <div className="lg:col-span-1 h-full">
      <div className="grid grid-cols-2 gap-4 h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className=" rounded-lg p-4 text-center flex flex-col items-center justify-center"
        >
          <div className="flex items-center justify-center mb-3">
            <Image src="/impact-overview/total-activites.svg" alt="Total activities" width={80} height={0} />
          </div>
          <div className="text-xs text-gray-600">
            Total Activities <span className="text-gray-400">-</span>{' '}
            <span className="text-xl font-semibold text-gray-900 block mt-1">{stats.totalActivities}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className=" rounded-lg p-4 text-center flex flex-col items-center justify-center"
        >
          <div className="flex items-center justify-center mb-3">
            <Image src="/impact-overview/channels.svg" alt="Channels" width={60} height={60} />
          </div>
          <div className="text-xs text-gray-600">
            Channels <span className="text-gray-400">-</span>{' '}
            <span className="text-xl font-semibold text-gray-900 block mt-1">{stats.channels}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className=" rounded-lg p-4 text-center flex flex-col items-center justify-center"
        >
          <div className="flex items-center justify-center mb-3">
            <Image src="/impact-overview/markets.svg" alt="Markets" width={60} height={60} />
          </div>
          <div className="text-xs text-gray-600">
            Markets <span className="text-gray-400">-</span>{' '}
            <span className="text-xl font-semibold text-gray-900 block mt-1">{stats.markets}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className=" rounded-lg p-4 text-center flex flex-col items-center justify-center"
        >
          <div className="flex items-center justify-center mb-3">
            <Image src="/impact-overview/total-coe2.svg" alt="total CO₂e" width={60} height={60} />
          </div>
          <div className="text-xs text-gray-600">
            Total CO₂e <span className="text-gray-400">-</span>{' '}
            <span className="text-xl font-semibold text-gray-900 block mt-1">{stats.totalCO2e.toFixed(5)} kg</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
