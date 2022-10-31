import React from "react";
import { useParams } from "react-router-dom";

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id;
  const anecdote = anecdotes.find((anecdote) => anecdote.id === id);

  return (
    <div>
      <h2>
        {anecdote.content} {anecdote.author}
      </h2>
    </div>
  );
};

export default Anecdote;
