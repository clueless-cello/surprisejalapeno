// bubble chart JSX

import React from 'react';
import ReactDOM from 'react-dom';
import ReactBubbleChart from 'react-bubble-chart';

const Tooltip = ({ name, description }) => (
  <div className="tooltip">
    <h3>{name}</h3>
    <p>{description.slice(0, 200)}...</p>
  </div>
);

Tooltip.propTypes = {
  name: React.PropTypes.string,
  description: React.PropTypes.string
};

// const borderStyle = {
//   'border-style': 'solid',
//   'border-width': '10px',
//   'border-color': 'red',
//   'border-radius': 100%,
//   width: '100%',
//   height: '100%'
// };

const setTooltip = (elem, data) => {
  ReactDOM.render(
    <Tooltip
      name={data.data.title}
      description={data.data.description}
    />, elem);
};

const roundSentiment = (sentimentValue) => {
  const num = sentimentValue - 290;
  const value = Math.abs(num);

  const final = 20 * Math.round(value / 20);

  if (num < 0) {
    return `hsl(360, ${final + 20}%, 50%)`;
  } else if (num > 0) {
    return `hsl(250, ${final + 20}%, 50%)`;
  }
  return 'hsl(250, 0%, 50%)';
};

const BubbleChart = ({ data, handleClick }) => (
  <ReactBubbleChart
    // colorLegend={colors}          // this renders everything black if undefined
    legend={false}                     // if true, create and show a legend based on the passed colors
    selectedColor="#737373"            // for when bubble is 'selected'
    selectedTextColor="#d9d9d9"        // for when bubble is 'selected'
    // fixedDomain={{ min: 0, max: 3 }}   // works with color legend - see react-bubble-chart docs
    onClick={handleClick}              // NEED TO SET CLICK HANDLER HERE FOR OPENING NEWS URL:  onClick={}
    tooltip
    tooltipFunc={setTooltip}
    data={
      data.map(d => ({
        _id: d.id,           // string, unique id (required) --> we didn't have this before React
        value: d.rating,             // number, to determine relative size of bubbles (required)
        colorValue: d.newsCategory,  // number, used to determine color
        selected: d.selected,        // boolean, uses selectedColor above for bubble if true
        url: d.url,                  // string, url for the article
        data: d,
        displayText: <img
          src={d.image}
          alt="bubble"
          style={{
            borderStyle: 'solid',
            borderWidth: '5px',
            // 'border-color': `hsl(${d.sentiment[0]}, ${d.sentiment[1]}, 50%)`,
            borderColor: roundSentiment(d.sentiment),
            borderRadius: '100%',
            width: '100%',
            height: '100%'
          }}
        />
      }))
    }
  />
);

BubbleChart.propTypes = {
  data: React.PropTypes.array,
  handleClick: React.PropTypes.func
};

export default BubbleChart;
