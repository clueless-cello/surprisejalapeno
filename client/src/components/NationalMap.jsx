import React from 'react';
import d3 from 'd3';
import topojson from 'topojson';

const node = document.createElement('div');

const width = 960;

const height = 500;

const path = d3.geo.path();

const svg = d3.select(node).append('svg')
    .attr('width', width)
    .attr('height', height);

d3.json('../../mapPlain.json', (error, topology) => {
  if (error) throw error;

  svg.append('path')
      .datum(topojson.feature(topology, topology.objects.land))
      .attr('d', path);
});
