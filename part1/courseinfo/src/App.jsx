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

const course = {
  name: 'Half Stack application development',
  parts: [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]
}

return(
  <div  style={containerStyle}>  
    
    <Header name={course.name}/>
    <Content parts = {course.parts}/> 
    <hr/> 
    <Total  parts = {course.parts}/>
  </div>
  

)



// All of the components :

}

const Header = (props) =>{
  console.log("The heaader prop", props)
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

const Content = (props) => {

  console.log("content param", props)

console.log(props.parts[0].name)
  return (
    <div>
     {<Part name = {props.parts[0].name} exercises={props.parts[0].exercises}/>}
     {<Part name = {props.parts[1].name} exercises={props.parts[1].exercises}/>}
     {<Part name = {props.parts[2].name} exercises={props.parts[2].exercises}/>}
      </div>
  );
};

  const Total = (props) =>{
    console.log(props)

    return (
    
      <p>{props.parts[0].exercises+props.parts[1].exercises+props.parts[2].exercises}</p>
    )
}


export default App
