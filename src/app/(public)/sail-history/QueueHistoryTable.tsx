"use client";
import React from "react";
import BoardingInfo from "../queue/BoardingInfo";

const QueueHistoryTable = ({ initData, sailInfo }) => {
  return (
    <>
      <BoardingInfo boatInfo={sailInfo} open isSailing deleteFn={() => null} />
    </>
  );
};

export default QueueHistoryTable;
