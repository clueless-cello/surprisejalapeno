import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
// import rd3 from 'react-d3-library';

import Search from './Search.jsx';
import BubbleChart from './BubbleChart.jsx';
// import node from './NationalMap.jsx'; // NODE FILE

// const USA = rd3.Component;


class App extends React.Component {
  constructor(props) {
    super(props);

    // //////start testing//////////
    // to assign a random category (will come from db later)
    // const getCategory = () => Math.floor(Math.random() * 4);

    // // to assign a random rating (will come from db later)
    // const getRating = () => {
    //   const ratings = [4, 6, 8, 10, 11, 8, 20];
    //   const rating = ratings[Math.floor(Math.random() * ratings.length)];
    //   return rating;
    // };

    // console.log(getRating());

    // const moodFactor = (obj) => {
    //   const sentimentLevel = {
    //     '-1': 0,
    //     '-0.75': 1,
    //     '-0.50': 2,
    //     '-0.25': 3,
    //     0: 4,
    //     0.25: 5,
    //     0.50: 6,
    //     0.75: 7,
    //     1: 8
    //   };
    //   if (obj.sentimentScore) {
    //     return sentimentLevel[obj.sentimentScore];
    //   }
    //   return sentimentLevel[0];
    // };

    this.state = {
      location: '',
      // remember to change back to empty array after done using dummy data
      data: [],
      numBubbles: 0,
      d3: '',
      map: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/H1N1_USA_Map_by_confirmed_deaths.svg'
    };

    // this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleSuggestionSelect = this.handleSuggestionSelect.bind(this);
    this.getNewsByLocation = this.getNewsByLocation.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  // componentDidMount() {
  //   this.setState({ d3: node });
  // }

  getNewsByLocation(loc) {
    console.log('inside getNewsByLocation');
    console.log('location: ', loc);
    // const query = loc.split(' ').join('+');
    // console.log('joined query: ', query);
    // const encoded = encodeURIComponent(query);
    // console.log('encoded: ', encoded);
    /* global $ */
    const locObj = JSON.stringify(loc);

    // Put the socket emit within this
    // const socket = io.connect(`ws://${location.host}`);

    // socket.on('connect', (data) => {
    //   console.log('connected!');
    //   socket.emit('request articles');
    // });

    // socket.on('new articles', (data) => {
    //   console.log('articles: ', data);
    // });

    $.ajax({
      method: 'GET',
      url: '/query',
      dataType: 'json',
      data: { q: locObj },
      success: (data) => {
        // data = dummyData; //FOR TESTING - NEED TO REMOVE THIS LINE
        console.log('Success fetching data from /query: ', data);
        // to assign a random category (will come from db later)
        const getCategory = () => Math.floor(Math.random() * 4);

        // to assign a random rating (will come from db later)
        const getRating = () => {
          const ratings = [4, 6, 8, 10, 11, 8, 20];
          const rating = ratings[Math.floor(Math.random() * ratings.length)];
          return rating;
        };

        data = data.slice(0, 50);
        console.log('rendering', data.length, ' gifs');

        // iterate through story objects and assign random category and rating
        let reqCount = 0;
        data.forEach((storyObj) => {
          const testObj = storyObj;
          const rating = getRating();
          testObj.rating = rating;

          reqCount++;
          // Don't know why, but adding rejectUnauthorized: false makes the circles load.
          $.ajax({
            method: 'GET',
            url: 'http://api.giphy.com/v1/gifs/search',
            dataType: 'json',
            data: {
              q: storyObj.title,
              api_key: 'dc6zaTOxFJmzC'
            },
            rejectUnauthorized: false,
            success: (d) => {
              // console.log('GIF DATA: ', d);
              testObj.image = d.data[0].images.original.url;
              reqCount--;
              if (reqCount === 0) {
                this.setState({ data });
              }
            },
            error: (err) => {
              console.log('Get GIF error: ', err);
            }
          });
        });

        // changed from data.value
        this.setState({ data });
      },
      error: (err) => {
        console.log('getNews err ', err);
      }
    });
  }

  handleSuggestionSelect(e) {
    console.log('selection e:', e);
    const loc = e.label;
    this.setState({ location: loc });
    this.getNewsByLocation(e);
  }

  // Possible redundant code --> It is getting passed down to submit
    // But it is never being called
  // handleSearchSubmit(e) {
  //   console.log('inside handleSearchSubmit');
  //   e.preventDefault();
  //   const location = this.state.location;
  //   if (!location) {
  //     return;
  //   }

  //   this.getNewsByLocation(location);
  // }

  handleSearchChange(e) {
    console.log('inside handleSearchChange');
    e.preventDefault();
    this.setState({ location: e.target.value });
  }

  handleClick(d, e) {
    console.log('inside handleClick, d:', d, this, e);
    window.open(d.url);
  }

  render() {
    return (
      <div>
        <div>
          <section>
            <Search
              props={this.props}
              handleSearchChange={this.handleSearchChange}
              handleSearchSubmit={this.handleSearchSubmit}
              handleSuggestionSelect={this.handleSuggestionSelect}
            />
          </section>
          <section>
            <BubbleChart
              data={this.state.data}
              handleClick={this.handleClick}
            />
          </section>
        </div>
        <div>
          <img src={this.state.map} alt="US Map" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
