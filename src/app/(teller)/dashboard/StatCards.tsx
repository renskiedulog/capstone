"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface DashboardCardTypes {
  cardTitle: string;
  icon: any;
  stats: string | number;
  info: string;
}

const DashboardCard = ({
  cardTitle,
  icon,
  stats,
  info,
}: DashboardCardTypes) => {
  return (
    <Card className="w-[45%] md:w-[23%] min-w-40">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{cardTitle}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl font-bold break-all">{stats}</div>
        <p className="text-xs text-muted-foreground">{info}</p>
      </CardContent>
    </Card>
  );
};

const StatCards = ({ data }: { data: DashboardCardTypes[] }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      layout
      className="flex gap-3 md:gap-5 justify-center flex-wrap md:flex-nowrap"
    >
      {data.map((card: DashboardCardTypes, idx: number) => (
        <DashboardCard key={idx} {...card} />
      ))}
    </motion.div>
  );
};

export default StatCards;
