import { FC, useEffect, useReducer } from "react";
import { entriesApi } from "../../apis";

import { Entry } from "../../interfaces";

import { EntriesContext, entriesReducer } from "./";

export interface EntriesState {
  entries: Entry[];
}

const Entries_INITIAL_STATE: EntriesState = {
  entries: [],
};

export const EntriesProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE);

  const addNewEntry = async (description: string) => {
    const resp = await entriesApi.post<Entry>("entries", { description });

    dispatch({ type: "[Entry] Add-Entry", payload: resp.data });
  };
  const updateEntry = async (entry: Entry) => {
    const { data: updateEntry } = await entriesApi.put<Entry>(
      `entries/${entry._id}`,
      entry
    );

    dispatch({ type: "[Entry] Entry-Updated", payload: updateEntry });
  };

  const refreshEntries = async () => {
    const { data: newEntry } = await entriesApi.get<Entry[]>("/entries");
    dispatch({ type: "[Entry] Entry-Refresh", payload: newEntry });
  };

  useEffect(() => {
    refreshEntries();
  }, []);

  return (
    <EntriesContext.Provider
      value={{
        ...state,

        // Methods
        addNewEntry,
        updateEntry,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};
