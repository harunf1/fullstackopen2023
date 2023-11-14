const App = () => {
 
    console.log("just making some changes to the react component")
  const timenow = new Date()
  const a = 10
  const b = 20
  console.log("a and b is :" , a+b)

  return (
    <div>
    <p>Hello world, The time is <br    /><br/> : {timenow.toString()}</p>
    <p> Funilly enough this is a react web component called "App"</p>
    <p> 
    {a} + {b} is equal to {a+b}
    </p>
    <Hello/>


    <p>Here im using a props staement to pass in to the function compoent named names_props:</p>
    <Name_props name = "harun"/>
    <Name_props name = "Hheisenberg"/>


    </div>
  )
}

const Hello = () =>
{
console.log("This is another component called Hello")
return (
  <div>
    <p>Hello world  this is another react component.</p>
  </div>
)

}

const Name_props = (props) =>{

console.log("Here theres a component that uses a properties (props) statement to pass arguments in the function component")
return (
<div>
  <p>hello to the person {props.name}</p>
</div>


)
}


export default App
