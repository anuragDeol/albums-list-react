import React from 'react'
import '../styles/App.css'

export default function Album(props) {
    const [isUpdating, setIsUpdating] = React.useState(false)
    const [formData, setformData] = React.useState({...props.data})
    
    async function handleUpdateClick(event) {
        event.preventDefault()
        setIsUpdating(prevState => !prevState)
    }
    
    // update album
    async function handleFormSubmit(event) {
        event.preventDefault()
        const {id, userId, title} = formData
        setIsUpdating(prevState => !prevState)
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
                method: 'PUT',
                body: JSON.stringify({userId: userId, title: title}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            props.updateAlbums(data)
        } catch {
            // since dummy API, so for id > 100, we do like this
            props.updateAlbums({id, userId, title})
        }
    }

    function handleOnChange(event) {
        setformData(prevState => {
            return {
                ...prevState,
                [event.target.name]: event.target.value 
            }
        })
    }

    async function handleDelete() {
        if(props.data.id <= 100) {
            const response = await fetch(`https://jsonplaceholder.typicode.com/albums/${props.id}`, {
                method: 'DELETE',
            })
            const data = await response.json()
            console.log(response)
            console.log(data)
        }
        props.deleteAlbum(props.data.id)
    }

    return (
        <div className="album">
            {
            isUpdating 
            ? 
            <>
                <form onSubmit={handleFormSubmit}>
                    <span>Title: <input type="text" name="title" value={formData.title} onChange={handleOnChange} style={{display: "inline"}}></input></span>
                    <span>Id: <b>{props.data.id}</b></span>
                    <span>UserId: <input type="text" name="userId" value={formData.userId} onChange={handleOnChange} style={{display: "inline"}}></input></span>
                    <div id="button-container">
                        <button type="submit" id="btn-confirm-changes">Confirm Changes</button>
                    </div>
                </form>
            </>
            :
            <>
                <span>Title: <b>{props.data.title}</b></span>
                <span>Id: <b>{props.data.id}</b></span>
                <span>UserId: <b>{props.data.userId}</b></span>
                <div id="button-container">
                    <button onClick={handleUpdateClick} id="btn-update">Update</button>
                    <button onClick={handleDelete} id="btn-delete">Delete</button>
                </div>
            </>
            }
        </div>
    )
}