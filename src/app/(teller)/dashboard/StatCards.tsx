"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

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
    <Card className="flex-1 min-w-max md:min-w-max">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm md:text-base font-semibold">{cardTitle}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="pb-4 md:pb-6">
        <div className="text-xl xl:text-2xl font-bold break-all">{stats}</div>
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
      className="flex gap-2 justify-center flex-wrap h-max flex-1"
    >
      {data.map((card: DashboardCardTypes, idx: number) => (
        <DashboardCard key={idx} {...card} />
      ))}
    </motion.div>
  );
};

export default StatCards;
