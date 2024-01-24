import { Component } from "solid-js";

export interface QueryInputProps {
  onSubmit: (query: string) => void;
}

export const QueryInput: Component<QueryInputProps> = ({ onSubmit }) => {
  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const query = formData.get("query") as string;
        onSubmit(query);
      }}
    >
      <input
        name="query"
        type="search"
        placeholder="Enter your query..."
      />
      <input type="submit" value="Query" />
    </form>
  );
};
