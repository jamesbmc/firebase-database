import React, { Component } from 'react';
import Auth from './Auth';
import firebase from 'firebase/app';
import 'firebase/database';
import Tweet from './Tweet';
import "./App.css";
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            tweets: {},
            tweetText: ''
        };
    }

    // Begin listening to authentication *and* database on Mount()
    componentDidMount() {
        // Listen to state authentication state change
        firebase.auth().onAuthStateChanged((user) => {
            // If there is a user, set the state of `user`
            if (user) {
                this.setState({
                    user: user
                });
            } else {
                this.setState({ user: null });
            }
        });

        // Create a reference to the "tweets" reference on the database
        this.tweetsRef = firebase.database().ref('tweets');

        // When the "tweets" *value* changes, update the state appropriately (`tweets`)
        this.tweetsRef.on('value', (snapshot) => {
            let tweets = snapshot.val();
            this.setState({tweets: tweets});
        })

    }

    // Method to push tweet to the firebase database
    sendTweet() {
        // Construct `tweet` object to push to firebase
        // Include the user's displayName, the text, number of likes (0), and a timestamp
        let tweet = {
            user: firebase.auth().currentUser.displayName,
            text: this.state.tweetText,
            likes: 0,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }
        // Push the tweet to the database
        this.tweetsRef.push(tweet);
    }

    // Method for updating the likes on a tweet
    updateLikes(tweetId) {
        // Create a reference to the number of likes
        let likes = this.tweetsRef.child(tweetId + '/likes')

        // Issue a transaction on the number of likes to increase it by 1
        likes.transaction((d) => d + 1);

    }

    render() {
        // Sort the keys of the tweets in descending order (by timestamp)
        console.log(this.state.tweets);
        let sortedKeys = this.state.tweets == null ? [] : Object.keys(this.state.tweets).sort((a, b) => {
            return this.state.tweets[b].timestamp - this.state.tweets[a].timestamp;
        });
        return (
            <div className="App">
                {/* Only display the auth if there is *not* a user */
                    !this.state.user && <Auth />}
                {/* Only display the twitter content if there *is* a user */
                    this.state.user &&
                    <div className="container">
                        Welcome, {this.state.user.displayName}!
                        <div>
                            {/* Create an input that holds (and updates) the state of tweetText*/}
                            <input value={this.state.tweetText} className='form-control' onChange={(e) => {this.setState({tweetText: e.target.value})}} />

                            {/* Create a button that, on click, executes the sendTweet() method*/}
                            <button className='btn btn-primary' onClick={() => this.sendTweet()}>Tweet</button>
                        </div>
                        <div className="tweetContainer">
                            {
                                /* For each key in sortedKeys, return a <Tweet />
                                    - Make sure to pass in the tweet info, id, and an update() method
                                */
                                sortedKeys.map(d => {
                                    return <Tweet id={d} info={this.state.tweets[d]} key={d} update={(d) => this.updateLikes(d)} />
                                })
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default App;
