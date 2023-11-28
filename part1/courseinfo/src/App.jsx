const App = () =>

{

  //styling for containers
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

 
//define constants as array of items ( name ; number of exercises)
const course_header = "Half stack development"
// <Header name={course_header}/>

const course_parts = [
  { name: 'Fundamentals of React', exercises: 10 },
  { name: 'Using props to pass data', exercises: 7 },
  { name: 'State of a component', exercises: 14}
]

// Now using Objects for course parts

const part1 = { name: 'Fundamentals of React', exercises: 10};
const part2 = { name: 'Using props to pass data', exercises: 7};
const part3 =  { name: 'State of a component', exercises: 14}


const total_courses = part1.exercises + part2.exercises + part3.exercises  


return(
  <div  style={containerStyle}>  
    
    <Header name={course_header}/>

    <Part name = {part1.name} exercises={part1.exercises}></Part>
    <Part name = {part2.name} exercises={part2.exercises}></Part>
    <Part name = {part3.name} exercises={part3.exercises}></Part>
<hr></hr>
      <Total total = {total_courses}/>
  </div>
  

)
//<Content parts={course_parts} />




// All of the components :

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

const Content = ({ part1 }) => {
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
