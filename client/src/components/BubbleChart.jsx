// bubble chart JSX

import React from 'react';
import ReactDOM from 'react-dom';
import ReactBubbleChart from 'react-bubble-chart';

const colorLegend = [
  // COLOR SCALE EXAMPLE - WILL UPDATE
  // reds from dark to light
  { color: '#67000d', textColor: '#fee0d2', text: 'Negative' },
  // { color: '#a50f15', textColor: '#fee0d2' },
  // { color: '#cb181d', textColor: '#fee0d2' },
  // '#ef3b2c',
  // '#fb6a4a',
  // '#fc9272',
  // '#fcbba1',
  // '#fee0d2',
  // // neutral grey
  { color: '#f0f0f0', text: 'Neutral' },
  // // blues from light to dark
  // '#deebf7',
  // '#c6dbef',
  // '#9ecae1',
  // '#6baed6',
  // '#4292c6',
  // { color: '#2171b5', textColor: '#deebf7' },
  // { color: '#08519c', textColor: '#deebf7' },
  { color: '#08306b', textColor: '#deebf7', text: 'Positive' }
];

let idCounter = 0;

const getID = () => {
  idCounter++;
  const stringID = idCounter.toString();
  return stringID;
};

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

const setTooltip = (elem, data) => {
  ReactDOM.render(
    <Tooltip
      name={data.data.title}
      description={data.data.description}
    />, elem);
  console.log(elem, data);
};

console.log('INSIDE BUBBLECHART');
const BubbleChart = ({ data, handleClick }) => (
  <ReactBubbleChart
    colorLegend={colorLegend}          // this renders everything black if undefined
    legend={false}                     // if true, create and show a legend based on the passed colors
    selectedColor="#737373"            // for when bubble is 'selected'
    selectedTextColor="#d9d9d9"        // for when bubble is 'selected'
    fixedDomain={{ min: 0, max: 3 }}   // works with color legend - see react-bubble-chart docs
    onClick={handleClick}              // NEED TO SET CLICK HANDLER HERE FOR OPENING NEWS URL:  onClick={}
    tooltip
    tooltipFunc={setTooltip}
    data={
      data.map(d => ({
        _id: getID(),           // string, unique id (required) --> we didn't have this before React
        value: d.rating,             // number, to determine relative size of bubbles (required)
        colorValue: d.newsCategory,  // number, used to determine color
        selected: d.selected,        // boolean, uses selectedColor above for bubble if true
        url: d.url,                  // string, url for the article
        data: d,
        displayText: <img src={d.image} alt="bubble" />
      }))
    }
  />
);

BubbleChart.propTypes = {
  data: React.PropTypes.array,
  handleClick: React.PropTypes.func
};

export default BubbleChart;
