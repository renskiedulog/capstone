"use client";

import { Trash, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { CardContent, Card } from "@/components/ui/card";

const Board = () => {
  const [cards, setCards] = useState(DEFAULT_CARDS);

  return (
    <div className="flex md:w-8/12 gap-3 mb-10">
      <Column
        title="In Queue"
        column="queue"
        headingColor="text-black"
        cards={cards}
        setCards={setCards}
        addQueue={true}
      />
    </div>
  );
};

const Column = ({ title, headingColor, column, cards, setCards, addQueue }) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e?.dataTransfer?.setData("cardId", card?.id);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();

    indicators?.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators?.reduce(
      (closest, child) => {
        const box = child?.getBoundingClientRect();
        const offset = e.clientX - (box.left + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else return closest;
      },
      {
        offset: Number?.NEGATIVE_INFINITY,
        element: indicators[indicators?.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document?.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = (e) => {
    setActive(false);
    clearHighlights();
  };

  const handleDragEnd = (e) => {
    setActive(false);
    clearHighlights();
    const cardId = e.dataTransfer.getData("cardId");
    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;

      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const filteredCards = cards?.filter((c) => c.column === column);
  return (
    <div className="w-full">
      <div className="mb-3 flex justify-between">
        <div className="flex items-center gap-1">
          <h3 className={`font-medium ${headingColor}`}>{title}</h3>
          <span className="rounded text-black">{filteredCards?.length}</span>
        </div>
      </div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        className={`h-full flex w-full flex-row-reverse justify-end transition-colors ${
          active ? "bg-[#0005]" : "bg-transparent"
        }`}
      >
        {filteredCards?.map(
          (c, idx) =>
            idx < 5 && (
              <QueueCard key={c?.id} {...c} handleDragStart={handleDragStart} />
            )
        )}
        <DropIndicator beforeId="-1" column={column} />
      </div>
    </div>
  );
};

const QueueCard = ({ title, id, column, handleDragStart }) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        draggable="true"
        layout
        layoutId={id}
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className="cursor-grab w-[19%] rounded border border-neutral-700 bg-white active:cursor-grabbing"
      >
        <Card className="p-3 rounded h-full">
          <p className="text-xs md:text-sm text-black/50">{title}</p>
        </Card>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-[98%] w-1 bg-blue-700 opacity-0"
    />
  );
};

const DEFAULT_CARDS = [
  // BACKLOG
  { title: "Look into render bug in dashboard", id: "1", column: "queue" },
  { title: "SOX compliance checklist", id: "2", column: "queue" },
  { title: "[SPIKE] Migrate to Azure", id: "3", column: "queue" },
  { title: "Document Notifications service", id: "4", column: "queue" },
  // TODO
  {
    title: "Research DB options for new microservice",
    id: "5",
    column: "queue",
  },
  { title: "Postmortem for outage", id: "6", column: "queue" },
  { title: "Sync with product on Q3 roadmap", id: "7", column: "queue" },

  // DOING
  {
    title: "Refactor context providers to use Zustand",
    id: "8",
    column: "queue",
  },
  { title: "Add logging to daily CRON", id: "9", column: "queue" },
  // DONE
  {
    title: "Set up DD dashboards for Lambda listener",
    id: "10",
    column: "queue",
  },
];

export default Board;
