import React, { useEffect, useRef, useState } from "react";

interface SlotMachineProps {
  handleFetchPokemon: () => void;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ handleFetchPokemon }) => {
  const [message, setMessage] = useState<string>("");
  const doorsRef = useRef<HTMLDivElement[]>([]);
  const items = [
    // "💎",
    // "🔔",
    "🍒",
    // "💎",
    // "🔔",
    "🍒",
    // "💎",
    // "🔔",
    "🍒",
    // "💎",
    // "🔔",
    "🍒",
    // "💎",
    // "🔔",
    "🍒",
  ];

  useEffect(() => {
    init();
  }, []); // Run only once on component mount

  const init = (reset = true, groups = 1, duration = 1) => {
    const doors = document.querySelectorAll<HTMLDivElement>(".door");
    doorsRef.current = Array.from(doors);
    const arr: string[] = [];
    const reelsArr: string[] = [];
    setMessage("");
    console.log(message, "the message should be empty")

    for (const door of doorsRef.current) {
      if (reset) {
        door.dataset.spinned = "0";
      } else if (door.dataset.spinned === "1") {
        return;
      }

      const boxes = door.querySelector(".boxes");
      if (!boxes) continue;

      const boxesClone = boxes.cloneNode(false) as HTMLDivElement;
      const pool = ["❓"];

      if (!reset) {
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
        pool.push(...shuffle(arr));

        boxesClone.addEventListener(
          "transitionstart",
          function () {
            door.dataset.spinned = "1";
            this.querySelectorAll(".box").forEach((box: Element) => {
              (box as HTMLElement).style.filter = "blur(1px)";
            });
          },
          { once: true }
        );

        boxesClone.addEventListener(
          "transitionend",
          function () {
            this.querySelectorAll(".box").forEach(
              (box: Element, index: number) => {
                (box as HTMLElement).style.filter = "blur(0)";
                if (index > 0) this.removeChild(box);
              }
            );
          },
          { once: true }
        );
      }

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.style.width = door.clientWidth + "px";
        box.style.height = door.clientHeight + "px";
        box.textContent = pool[i];
        boxesClone.appendChild(box);
      }

      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${
        door.clientHeight * (pool.length - 1)
      }px)`;
      door.replaceChild(boxesClone, boxes);
      const el: string =
        door.querySelector<HTMLDivElement>("div.box")?.innerHTML ?? "";
      reelsArr.push(el);
      if (!reset && reelsArr.length === 3) {
        if (reelsArr.every((val, _, arr) => val === arr[0] && val !== "❓")) {
          setTimer(1600, () => setMessage("You Won!"));

          setTimer(2400, handleFetchPokemon);
        } else {
          setTimer(1400, () => setMessage("Try Again!"));
        }
      }
    }
  };

 
  async function spin() {
    console.log("spinning")
    init(false, 1, 1);

    for (const door of doorsRef.current) {
      const boxes = door.querySelector(".boxes") as HTMLElement; // Type assertion
      if (!boxes) {
        continue; // Skip to the next iteration if 'boxes' is null or undefined
      }
      const duration = parseInt(getComputedStyle(boxes).transitionDuration);
      boxes.style.transform = "translateY(0)";
      await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }
  }

  const shuffle = ([...arr]: string[]): string[] => {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  };

  const setTimer = (time: number, action: () => void) => {
    return setTimeout(() => {
      action();
    }, time);
  };

  return (
    <div id="slot-machine">
      <div className="doors">
        <div className="door" ref={(el) => el && (doorsRef.current[0] = el)}>
          <div className="boxes"></div>
        </div>
        <div className="door" ref={(el) => el && (doorsRef.current[1] = el)}>
          <div className="boxes"></div>
        </div>
        <div className="door" ref={(el) => el && (doorsRef.current[2] = el)}>
          <div className="boxes"></div>
        </div>
      </div>
      {message && <h2 className="msg">{message}</h2>}
      <div className="buttons">
        <button id="spinner" onClick={spin}>
          Play
        </button>
        <button id="reseter" onClick={() => init()}>
          Reset
        </button>
      </div>
    </div>
  );
  
};


export default SlotMachine;
