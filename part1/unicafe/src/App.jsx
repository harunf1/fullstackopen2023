import { useState } from "react";

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const addgood = () => {
    setGood(good + 1);
  };
  const addnuetral = () => {
    setNeutral(neutral + 1);
  };
  const addbad = () => {
    setBad(bad + 1);
  };
  const allclicks = good + bad + neutral;

  return (
    <div>
      <h1>Set Feedback</h1>
      <Button text="good" onclick={addgood} />
      <Button text="bad" onclick={addbad} />
      <Button text="nuetral" onclick={addnuetral} />

      {allclicks > 0 ? (
        <div>
          <Stastics good={good} neutral={neutral} bad={bad}></Stastics>
        </div>
      ) : (
        <Nostats></Nostats>
      )}
    </div>
  );
};

const Stastics = (props) => {
  const allclicks = props.good + props.bad + props.neutral;
  const positive = Math.round((props.good / allclicks) * 100);
  const percentage = `${positive}%`;

  const roundTo = function (num, places) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };
  const average = (props.good - props.bad) / allclicks;
  const roundedaverage = roundTo(average, 2);

  console.log("Good:", props.good);
  console.log("bad:", props.bad);
  console.log("neutral:", props.neutral);
  console.log("allclicks", allclicks);

  return (
    <table>
      <tbody>
        <Stasticline name="good" value={props.good} />
        <Stasticline name="bad" value={props.bad} />
        <Stasticline name="nuetral" value={props.neutral} />
        <Stasticline name="all votes" value={allclicks} />
        <Stasticline name="average votes" value={roundedaverage} />
        <Stasticline name="Positive" value={percentage} />
      </tbody>
    </table>
  );
};

const Nostats = () => {
  return (
    <div>
      <p>No feedback provided</p>
    </div>
  );
};

const Stasticline = (props) => {
  return (
    <tr>
      <th> {props.name}</th>
      <td>{props.value}</td>
    </tr>
  );
};

const Button = (props) => {
  return <button onClick={props.onclick}>{props.text}</button>;
};
export default App;
