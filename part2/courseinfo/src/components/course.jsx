/*
Component structure as follows

course
    header
        content
            part
            part...



so destruct and map to li

added comlexity multiple courses so map that and inside that map the parts

*/

const Course = (props) => {
  const course = props.course;

  return (
    <>
      {course.map((course) => (
        <div key={course.id}>
          <h2>{course.name}</h2>

          <ul>
            {course.parts.map((parts) => (
              <li key={parts.id}>
                {" "}
                {parts.name} {parts.exercises}
              </li>
            ))}
            <strong>
              Total of{" "}
              {course.parts.reduce((total, part) => total + part.exercises, 0)}{" "}
              exercises
            </strong>
          </ul>
        </div>
      ))}
    </>
  );
};

export default Course;
