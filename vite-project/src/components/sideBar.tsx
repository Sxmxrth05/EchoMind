import { Menu, Plus } from "lucide-react";

// You need to export this interface so App.tsx can use it
export interface JournalItem {
  id: number;
  title: string;
}

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  history: JournalItem[];
  activeId?: number;
}

function Sidebar({ isOpen, toggle, history, activeId }: SidebarProps) {
  return (
    <div
      className={`
        flex flex-col h-screen text-gray-700 flex-shrink-0
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-20"}
      `}
      style={{ backgroundColor: "#E0F2F7" }}
    >
      {/* Top section with toggle and logo */}
      <div
        className={`
          flex items-center h-16 flex-shrink-0
          ${isOpen ? "justify-between px-4" : "justify-center"}
        `}
      >
        {/* Logo (only shown when open) */}
        {isOpen && (
          <h1 className="text-2xl font-semibold" style={{ color: "#00796B" }}>
            EchoMind
          </h1>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => {
            // call the passed toggle handler and log for debugging
            toggle();
            // eslint-disable-next-line no-console
            console.log("Sidebar toggle clicked");
          }}
          className="bg-transparent border-none p-2 rounded-lg transition-colors hover:cursor-pointer"
          style={{ color: "#78909C", cursor: "pointer" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#B2EBF2")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Menu size={24} />
        </button>
      </div>

      {/* New Journal Button - Deep Teal accent */}
      <button
        className={`
          flex items-center border-none rounded-lg p-3 my-4 cursor-pointer text-base
          whitespace-nowrap text-white transition-colors
          ${isOpen ? "mx-4" : "justify-center mx-2"}
        `}
        style={{ backgroundColor: "#00796B" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#00695C")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#00796B")
        }
      >
        <Plus size={20} />
        {isOpen && <span className="ml-3">New Journal</span>}
      </button>

      {/* Journal History */}
      <div
        className={`
          overflow-y-auto overflow-x-hidden flex-1
          ${isOpen ? "mx-4" : "mx-2 flex flex-col items-center"}
        `}
      >
        {isOpen && (
          <h2
            className="text-xs uppercase font-semibold tracking-wider px-2 mb-2"
            style={{ color: "#78909C" }}
          >
            Recent
          </h2>
        )}
        <ul className="list-none p-0 m-0 w-full">
          {history.map((item) => (
            <li
              key={item.id}
              className={`
                flex items-center p-3 my-1 rounded-lg cursor-pointer font-medium
                whitespace-nowrap transition-colors
                ${isOpen ? "justify-start" : "justify-center"}
              `}
              style={{
                backgroundColor:
                  activeId === item.id ? "#00796B" : "transparent",
                color: activeId === item.id ? "white" : "#37474F",
              }}
              onMouseEnter={(e) => {
                if (activeId !== item.id) {
                  e.currentTarget.style.backgroundColor = "#B2EBF2";
                }
              }}
              onMouseLeave={(e) => {
                if (activeId !== item.id) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {/* Show text when open, dot when collapsed */}
              {isOpen ? (
                <span className="overflow-hidden text-ellipsis">
                  {item.title}
                </span>
              ) : (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: activeId === item.id ? "white" : "#78909C",
                  }}
                  title={item.title}
                ></div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
