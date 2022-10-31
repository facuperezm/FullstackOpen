import React from "react";
import { Link } from "react-router-dom";

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>
      <strong>Anecdotes</strong>
    </h2>
    <ul>
      {anecdotes.map((anecdote) => (
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}> {anecdote.content} </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default AnecdoteList;
