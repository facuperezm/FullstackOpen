import React from 'react';

const Header = ({ course }) => {
  return (
    <>
      <h2>{course.name}</h2>
    </>
  );
};

const Part = (props) => {
  return (
    <>
      <p>
        {props.part.name} {props.part.exercises}
      </p>
    </>
  );
};

const Content = ({ course }) => {
  return (
    <>
      {course.parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </>
  );
};

const Total = ({ course }) => {
  const initialValue = 0;
  const total = course.parts.reduce(
    (previousValue, CurrentValue) => previousValue + CurrentValue.exercises,
    initialValue
  );
  return (
    <>
      <strong>total of {total} exercises</strong>
    </>
  );
};

const Course = ({ course }) => {
  return (
    <>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </>
  );
};

export default Course;
