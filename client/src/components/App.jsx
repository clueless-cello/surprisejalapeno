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
    const locObj = loc;

    const getRating = () => {
      const ratings = [4, 6, 8, 10, 11, 8, 20];
      return ratings[Math.floor(Math.random() * ratings.length)];
    };

    const getGif = (query) =>
      new Promise((resolve, reject) => {
        $.ajax({
          method: 'GET',
          url: 'http://api.giphy.com/v1/gifs/search',
          dataType: 'json',
          data: {
            q: query,
            api_key: 'dc6zaTOxFJmzC'
          },
          rejectUnauthorized: false,
          success: (d) => {
            resolve(d.data[0].images.original.url);
            //console.log('GIF DATA: ', d);
            //testObj.image = d.data[0].images.original.url;
            //reqCount--;
            //if (reqCount === 0) {
              //this.setState({ data });
            //}
          },
          error: (err) => {
            console.log('Get GIF error: ', err);
          }
        });
      });

    const socket = io.connect(`ws://${location.host}`);

    socket.on('connect', (data) => {
      console.log('conected');
      socket.emit('request articles', locObj);
    });

    socket.on('new articles', (data) => {
      data = data.slice(0, 50);

      let reqCount = 0;
      data.forEach((storyObj) => {
        storyObj.rating = getRating();
        reqCount++;
        getGif(storyObj.title)
          .then((url) => {
            console.log(url);
            storyObj.image = url;
            this.setState({ data: this.state.data.concat(storyObj) });
          });
      });
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
