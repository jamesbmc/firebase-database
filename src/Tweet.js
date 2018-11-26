import React from 'react';
import './Tweet.css';

// Create a functional component to return the HTMl that looks like a tweet
function Tweet(props) {
    // Format date
    let date = new Date(props.info.timestamp);
    let formattedDate = date.toLocaleTimeString();

    /* Return a div that contains the following information:
        - A div that has the user name (in bold) and the formatted date (use the className "date")
        - A div that has the text (use className "tweetText")
        - A div that has the number of likes (with className "likes"). On click, this should do the update function
    */

    return (
        <div className="tweet">
            <div className="user"><strong>{props.info.user + " "}</strong><span className="date">{formattedDate}</span></div>
            <div className="tweetText">{props.info.text}</div>
            <div className="likes" onClick={() => props.update(props.id)}>Likes: {props.info.likes}</div>
        </div>
    )
}

export default Tweet;