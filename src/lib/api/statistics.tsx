import Boat from "@/models/Boats";
import Queue from "@/models/Queue";
import Passenger from "@/models/Passenger";
import User from "@/models/User";

export const getTotalBoats = async () => {
  return await Boat.countDocuments();
};

export const getBoatsByStatus = async () => {
  const statusCounts = await Boat.aggregate([
    { $group: { _id: "$checkingStatus", count: { $sum: 1 } } },
  ]);
  return statusCounts.reduce((acc, status) => {
    acc[status._id] = status.count;
    return acc;
  }, {});
};

export const getQueuesByStatus = async () => {
  const statusCounts = await Queue.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  return statusCounts.reduce((acc, status) => {
    acc[status._id] = status.count;
    return acc;
  }, {});
};

export const getAveragePassengersPerQueue = async () => {
  const queues = await Queue.aggregate([
    { $group: { _id: null, avgPassengers: { $avg: "$passengerCount" } } },
  ]);
  return queues[0]?.avgPassengers || 0;
};

export const getAverageWaitTime = async () => {
  const queues = await Queue.find({ status: "completed" });
  const totalWaitTime = queues.reduce((acc, queue) => {
    const waitTime = (queue.completedAt - queue.queuedAt) / (1000 * 60);
    return acc + waitTime;
  }, 0);
  return queues.length ? totalWaitTime / queues.length : 0;
};

export const getTotalPassengers = async () => {
  return await Passenger.countDocuments();
};

export const getPassengerCountByGender = async () => {
  const genderCounts = await Passenger.aggregate([
    { $group: { _id: "$gender", count: { $sum: 1 } } },
  ]);
  return genderCounts.reduce((acc, gender) => {
    acc[gender._id] = gender.count;
    return acc;
  }, {});
};

export const getAveragePayment = async () => {
  const payments = await Passenger.aggregate([
    { $group: { _id: null, avgPayment: { $avg: "$amountPaid" } } },
  ]);
  return payments[0]?.avgPayment || 0;
};

export const prepareBoatStatusDataForChart = async () => {
  const boatsByStatus = await getBoatsByStatus();
  return Object.keys(boatsByStatus).map((status) => ({
    name: status,
    value: boatsByStatus[status],
  }));
};

export const prepareQueueStatusDataForChart = async () => {
  const queuesByStatus = await getQueuesByStatus();
  return Object.keys(queuesByStatus).map((status) => ({
    name: status,
    value: queuesByStatus[status],
  }));
};

export const preparePassengerGenderDataForChart = async () => {
  const passengersByGender = await getPassengerCountByGender();
  return Object.keys(passengersByGender).map((gender) => ({
    name: gender,
    value: passengersByGender[gender],
  }));
};

export const getBoatsByStatusInRange = async (range) => {
  const { start, end } = range;
  const statusCounts = await Boat.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    { $group: { _id: "$checkingStatus", count: { $sum: 1 } } },
  ]);

  return statusCounts.reduce((acc, status) => {
    acc[status._id] = status.count;
    return acc;
  }, {});
};

import Queue from "./models/Queue";

export const getQueueStatusInRange = async (range) => {
  const { start, end } = range;
  const statusCounts = await Queue.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  return statusCounts.reduce((acc, status) => {
    acc[status._id] = status.count;
    return acc;
  }, {});
};

export const getAverageWaitTimeInRange = async (range) => {
  const { start, end } = range;
  const queues = await Queue.find({
    completedAt: { $gte: start, $lte: end },
  });

  const totalWaitTime = queues.reduce((acc, queue) => {
    const waitTime = (queue.completedAt - queue.queuedAt) / (1000 * 60);
    return acc + waitTime;
  }, 0);

  return queues.length ? totalWaitTime / queues.length : 0;
};

export const getTotalPassengersInRange = async (range) => {
  const { start, end } = range;
  return await Passenger.countDocuments({
    createdAt: { $gte: start, $lte: end },
  });
};

export const getPassengerCountByGenderInRange = async (range) => {
  const { start, end } = range;
  const genderCounts = await Passenger.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    { $group: { _id: "$gender", count: { $sum: 1 } } },
  ]);

  return genderCounts.reduce((acc, gender) => {
    acc[gender._id] = gender.count;
    return acc;
  }, {});
};