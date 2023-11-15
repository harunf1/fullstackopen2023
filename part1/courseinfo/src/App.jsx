const App = () =>




{

  
//define constants as array of items ( name ; number of exercises)
const course_header = "Half stack development"
// <Header name={course_header}/>

const course_parts = [
  { name: 'Fundamentals of React', exercises: 10 },
  { name: 'Using props to pass data', exercises: 7 },
  { name: 'State of a component', exercises: 14}
]

  const total_courses = course_parts[0].exercises +  course_parts[1].exercises


const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  maxWidth: '600px',
  margin: 'auto',
  padding: '20px',
  textAlign: 'center',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

return(
  <div  style={containerStyle}>  
    
    <Header name={course_header}/>

    <Content parts={course_parts} />
<hr></hr>
      <Total total = {total_courses}/>
  </div>
  
  

)


}

const Header = (props) =>{
  console.log(props)
return (
  <h1>{props.name}</h1>
)
}


const Part = ({ name, exercises }) => {
  return (
    <p>
      {name}: {exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part, index) => (
        <Part key={index} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  );
};

  const Total = (props) =>{
    console.log(props)
    return (
      
      <p>Total number of parts: {props.total}</p>
    )
    }



export default App
