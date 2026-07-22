const Persons = ({ persons, removeName }) => {
  return (
    <ul>
      {persons.map((person) => (
        <li key={person.id}>{person.name}: {person.number} <button onClick={() => removeName(person.id)}>delete</button></li>
      ))}
    </ul>
  )
}

export default Persons