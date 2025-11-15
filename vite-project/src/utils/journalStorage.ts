import { type JournalItem } from "../components/sideBar";
import { type Message } from "../components/MessageList";

// localStorage keys
const JOURNALS_KEY = "echomind_journals";
const JOURNAL_MESSAGES_KEY = (journalId: number) =>
  `echomind_messages_${journalId}`;
const ACTIVE_JOURNAL_KEY = "echomind_active_journal";

// Initialize default journals
const DEFAULT_JOURNALS: JournalItem[] = [
  { id: 1, title: "Morning Reflections" },
  { id: 2, title: "Weekend Adventures" },
];

// localStorage utility functions
export const journalStorage = {
  getJournals: (): JournalItem[] => {
    const stored = localStorage.getItem(JOURNALS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_JOURNALS;
  },
  saveJournals: (journals: JournalItem[]) => {
    localStorage.setItem(JOURNALS_KEY, JSON.stringify(journals));
  },
  getMessages: (journalId: number): Message[] => {
    const stored = localStorage.getItem(JOURNAL_MESSAGES_KEY(journalId));
    return stored ? JSON.parse(stored) : [];
  },
  saveMessages: (journalId: number, messages: Message[]) => {
    localStorage.setItem(
      JOURNAL_MESSAGES_KEY(journalId),
      JSON.stringify(messages)
    );
  },
  getActiveJournal: (): number => {
    const stored = localStorage.getItem(ACTIVE_JOURNAL_KEY);
    return stored ? JSON.parse(stored) : 1;
  },
  setActiveJournal: (journalId: number) => {
    localStorage.setItem(ACTIVE_JOURNAL_KEY, JSON.stringify(journalId));
  },
};
