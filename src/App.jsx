import React, { useState, useRef, useCallback } from 'react'
import useBookSearch from './useBookSearch'

export default function App() {
    const [query, setQuery] = useState('')
    const [pageNumber, SetPageNumber] = useState(1)
    const { books, hasMore, loading, error } = useBookSearch(query, pageNumber)
    const observer = useRef()
    const lastBookElementRef = useCallback(node => {
        if(loading) return
        if(observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore){
                SetPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if(node) observer.current.observe(node)
    }, [loading, hasMore])

    const handleSearch = (e) => {
        setQuery(e.target.value)
        SetPageNumber(1)
    }

    return (
        <>
            <input type="text" value={query} onChange={handleSearch}/>
            {books.map((book, index) => {
                if(books.length === index + 1) {
                    return <div ref={lastBookElementRef} key={book}>{book}</div>
                } else {
                    return <div key={book}>{book}</div>
                }
            })}
            <div className="">{loading && 'Loading...'}</div>
            <div className="">{error && 'Error'}</div>
        </>
    )
}
