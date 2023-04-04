import React from 'react'
import Album from './Album'

export default function App() {
  const [data, setData] = React.useState(() => JSON.parse(localStorage.getItem('albumData')) || [])   // lazy state initialization
  const [formData, setFormData] = React.useState({id:"", userId:"", title:""})

  React.useEffect(() => {
    async function fetchData() {
      if(localStorage.getItem('albumData') === null) {
        // make API call, only if localStorage does not have 'albumData'
        const response = await fetch(`https://jsonplaceholder.typicode.com/albums`)
        const data = await response.json()
        localStorage.setItem('albumData', JSON.stringify(data))
        // update state with the response returned from API call
        setData(data)
      } 
    }
    fetchData()   // fetch data from API and update the state
  }, [])

  React.useEffect(() => {
    // update localStorage
    localStorage.setItem('albumData', JSON.stringify(data))
  }, [data])
  
  // UPADTE:: update album
  function updateAlbums(data) {
    setData((prevState) => {
      const newState = prevState.map((album) => {
        return album.id !== data.id ? album : {...data}
      })
      return newState
    })
  }

  // DELETE:: delete album
  function deleteAlbum(idToDelete) {
    setData((prevState) => {
      return prevState.filter((album) => album.id !== idToDelete)
    })
  }

  // array of component '<Album />'
  const allAlbums = data.map((album) => {
    return <Album data={album} updateAlbums={updateAlbums} deleteAlbum={deleteAlbum}/>
  })

  function handleChange(event) {
    setFormData(prevState => {
      return {
        ...prevState,
        [event.target.name]: event.target.value
      }
    })
  }

  // create new album upon form submission
  async function handleSubmit(event) {
    event.preventDefault()
    const response = await fetch('https://jsonplaceholder.typicode.com/albums', {
      method: 'POST',
      body: JSON.stringify({userId: formData.userId, title: formData.title}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    data.id = JSON.parse(localStorage.getItem('albumData')).length+1
    setData((prevState) => [...prevState, data])
    setFormData({id:"", userId:"", title:""})
  }
  
  return (
    <div id="main">
      <header>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="UserId*" 
                onChange={handleChange}
                name="userId"
                value={formData.userId}
                required
            />
            <input
                type="title"
                placeholder="Title*"
                onChange={handleChange}
                name="title"
                value={formData.title}
                required
            />
            <button>Add</button>
        </form>
        <span id="heading">Albums List</span>
      </header>
      <div id="albums-container">
        {allAlbums}
      </div>
    </div>
  )
}

