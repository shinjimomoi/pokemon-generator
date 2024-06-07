import React, { useEffect, useRef, useState } from "react";
import { addPokemon, changeBalance, useFetchPokemon } from '../pokemonService';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";


// interface SlotMachineProps {
//   handleGetPokemon: () => void;
// }

const SlotMachine: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const doorsRef = useRef<HTMLDivElement[]>([]);
  const items = [
    "💎",
    // "🍒",
    // "🍒",
    // "💎",
    // "🍒",
  ];

  useEffect(() => {
    init();
  }, []); // Run only once on component mount

  const handleGetPokemon = async () => {
    const data = await useFetchPokemon();
    addPokemon(data);
};

  const init = (reset = true, groups = 1, duration = 1) => {
    const doors = document.querySelectorAll<HTMLDivElement>(".door");
    doorsRef.current = Array.from(doors);
    const arr: string[] = [];
    const reelsArr: string[] = [];
    setMessage("");

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
          const combination = reelsArr.join("");
          switch (combination) {
            case "💎💎💎":
              setTimer(1200, () => setMessage("You won a card!"));
              setTimer(2400, handleGetPokemon);
              
              break;
            case "🍒🍒🍒":
              setTimer(1200, () => {setMessage("You won $500!"); changeBalance(500);});
            break;
            case "🔔🔔🔔":
              setTimer(1200, () => {setMessage("You won $300!"); changeBalance(300);});
              break;
            default:
              setMessage("You Won! +$500");
              break;
          }
        } else {
          setTimer(1400, () => setMessage("Try Again!"));          
        }
      }
    }
  };

  async function spin() {
    const balanceChanged = await changeBalance(-100);
    if (!balanceChanged) {
      console.error('Insufficient balance');
      setMessage('Insufficient money to play.');
      setTimeout(() => {
        setMessage('');        
      }, 1200);
      return;
    }
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
      <h1>Pachinko</h1>
      <p>You have to pay $100 to play.</p>
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
          <FontAwesomeIcon icon={faPlay}/>
        </button>
        <button id="reseter" onClick={() => init()}>
          Reset
        </button>
      </div>
    </div>
  );
  
};


export default SlotMachine;
