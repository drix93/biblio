import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  let [books, setBooks] = useState([])
  useEffect(() => {
    async function getImage(href) {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      let response = await fetch(href, requestOptions)
      let result = await response.json()
      const source_url = result?.media_details?.sizes?.full?.source_url
      return source_url
    }
    async function getTaxonomy(href) {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      let response = await fetch(href, requestOptions)
      let result = await response.json()
      // console.log("href",result)
      const subjects = result?.map((data) => data.name)
      return subjects
    }
    async function init() {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      let response = await fetch("https://api-biblio.officebureau.ca/wp-json/wp/v2/posts", requestOptions)
      let result = await response.json()
      let filtered = []
      for (let data of result) {
        const title = data?.title?.rendered
        const isbn = data?.acf?.isbn
        // console.log(data?._links["wp:featuredmedia"])
        const imageUrl = await getImage(data?._links["wp:featuredmedia"][0]?.href)
        let arr = data?._links["wp:term"].filter((data) => {
          if (data.taxonomy == "subject") {
            return true;
          }
          return false
        })
        const subjects = await getTaxonomy(arr[0]?.href)
        // console.log({ title, isbn, imageUrl, subjects })
        filtered.push({ title, isbn, imageUrl, subjects })
      }
      // console.log(filtered)
      setBooks(filtered)
    }

    init()
  }, [])
  return (
    <div className="App">
      <div className='flex flex-col'>
        <div className='flex w-full h-10 bg-black'><div className='font-bold text-md ml-5 mt-2 text-white'>Biblio</div></div>
        <div className='flex flex-wrap space-x-14 space-y-10'>
          <div></div>
          {books && books.map((data) => {
            return (
              <>
                <div className='flex flex-col w-80 h-80'>
                  <div className='flex ml-10 mt-10'>
                    <img className='w-52 h-60' src={data.imageUrl}></img>
                  </div>
                  <div className='flex flex-col  ml-10'>
                    <div className='flex'><span className='font-bold mr-2 mb-3'>Title:</span> {data.title}</div>
                    <div className='flex'><span className='font-bold mr-2 mb-3'>ISBN:</span> {data.isbn}</div>
                    <div className='flex'><span className='font-bold mr-2'>Subjects:</span> {data.subjects.join(", ")}</div>
                  </div>
                </div>
              </>)
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
