"use client";

import { Trash, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const Board = () => {
  const [cards, setCards] = useState(DEFAULT_CARDS);

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="In Queue"
        column="queue"
        headingColor="text-black"
        cards={cards}
        setCards={setCards}
        addQueue={true}
      />
      <Column
        title="Loading Passengers"
        column="loading"
        headingColor="text-black"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Sailed"
        column="sailed"
        headingColor="text-black"
        cards={cards}
        setCards={setCards}
      />
      <DeleteColumn setCards={setCards} />
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
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

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
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-black">
          {filteredCards?.length}
        </span>
      </div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        className={`h-full w-full transition-colors ${
          active ? "bg-[#0005]" : "bg-transparent"
        }`}
      >
        {filteredCards?.map((c) => (
          <Card key={c?.id} {...c} handleDragStart={handleDragStart} />
        ))}
        {addQueue && <AddCard />}
        <DropIndicator beforeId="-1" column={column} />
      </div>
    </div>
  );
};

const AddCard = () => {
  return <motion.div layout>Add</motion.div>;
};

const Card = ({ title, id, column, handleDragStart }) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        draggable="true"
        layout
        layoutId={id}
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className="cursor-grab rounded border border-neutral-700 bg-white p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-black/50">{title}</p>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-blue-400 opacity-0"
    />
  );
};

const DeleteColumn = ({ setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e) => {
    const cardId = e?.dataTransfer?.getData("cardId");

    setCards((pv) => pv?.filter((c) => c?.id !== cardId));

    setActive(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragEnd}
      className={`mt-10 transition grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-500 bg-red-500/50 text-red-700"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <Trash2 className="animate-bounce" /> : <Trash />}
    </div>
  );
};

const DEFAULT_CARDS = [
  // BACKLOG
  { title: "Look into render bug in dashboard", id: "1", column: "queue" },
  { title: "SOX compliance checklist", id: "2", column: "queue" },
  { title: "[SPIKE] Migrate to Azure", id: "3", column: "queue" },
  { title: "Document Notifications service", id: "4", column: "loading" },
  // TODO
  {
    title: "Research DB options for new microservice",
    id: "5",
    column: "sailed",
  },
  { title: "Postmortem for outage", id: "6", column: "sailed" },
  { title: "Sync with product on Q3 roadmap", id: "7", column: "sailed" },

  // DOING
  {
    title: "Refactor context providers to use Zustand",
    id: "8",
    column: "queue",
  },
  { title: "Add logging to daily CRON", id: "9", column: "sailed" },
  // DONE
  {
    title: "Set up DD dashboards for Lambda listener",
    id: "10",
    column: "loading",
  },
];

export default Board;
