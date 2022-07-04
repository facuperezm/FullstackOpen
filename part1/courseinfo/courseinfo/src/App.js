const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  );
};

const Part = (props) => {
  return (
    <>
      <p>
        {props.part} {props.exe}
      </p>
    </>
  );
};

const Content = (props) => {
  return (
    <>
      <Part part={props.part} exe={props.exe} />
    </>
  );
};

const Total = (props) => {
  return (
    <>
      <p>Number of exercises {props.total}</p>
    </>
  );
};

const App = () => {
  const course = {
    name: 'Half Stack Application Development',
    parts: [
      {
        name: 'Fundamentals of React',
        exe: 10,
      },
      {
        name: 'Using props to pass data',
        exe: 7,
      },
      {
        name: 'State of a component',
        exe: 14,
      },
    ],
  };
  return (
    <>
      <Header course={course.name} />
      {course.parts.map((part) => {
        return <Content part={part.name} exe={part.exe} />;
      })}
      <Total
        total={course.parts[0].exe + course.parts[1].exe + course.parts[2].exe}
      />
    </>
  );
};

export default App;
