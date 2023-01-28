import React from 'react'

export default function Post() {
  return (
    <div className="post">
      <div className="image">
        <img
          src="https://techcrunch.com/wp-content/uploads/2023/01/PotterWand-1-e1674823637841.jpg?w=1390&crop=1"
          alt=""
        />
      </div>
      <div className="texts">
        <h2>Warner Bros. swiped our Harry Potter wand IP, says Kano</h2>
        <p className="info">
          <a className="author">Paul Sawers</a>
          <time>2023-01-28 01:40</time>
        </p>
        <p className="summary">
          Kano, the venture-backed U.K. startup known for its build-your-own computer kits and software for teaching
          coding and associated STEM skills, has accused Warner Bros. of copying one of its products and infringing on
          its intellectual property (IP).
        </p>
      </div>
    </div>
  )
}
