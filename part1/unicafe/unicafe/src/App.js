import { useState } from 'react';

const Button = ({ handleClick, tag }) => (
  <button onClick={handleClick}>{tag}</button>
);

const Statistics = ({ good, bad, neutral }) => {
  const all = good + neutral + bad;
  const average = (good * 1 + neutral * 0 + bad * -1) / all;
  const positive = `${(good / all) * 100}%`;
  return (
    <div>
      <h3>Data</h3>
      <table>
        <tbody>
          <StatisticLine tag="Good" value={good} />
          <StatisticLine tag="Neutral" value={neutral} />
          <StatisticLine tag="Bad" value={bad} />
          <StatisticLine tag="Average" value={average} />
          <StatisticLine tag="Positive" value={positive} />
        </tbody>
      </table>
    </div>
  );
};

const StatisticLine = ({ tag, value }) => (
    <tr>
      <td>{tag}</td>
      <td>{value}</td>
    </tr>
  );

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGood = () => setGood(good + 1);
  const handleNeutral = () => setNeutral(neutral + 1);
  const handleBad = () => setBad(bad + 1);

  return (
    <div>
      <h1>Feedback to Unicafe!</h1>
      <Button handleClick={handleGood} tag="Good" />
      <Button handleClick={handleNeutral} tag="Neutral" />
      <Button handleClick={handleBad} tag="Bad" />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  );
};

export default App;
