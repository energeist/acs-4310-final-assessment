async function loadData() {
  let data = await d3.csv('./2019.csv');

  console.log(data);

  data = data.sort((a,b) => a.overallRank - b.overallRank); // This is already sorted, but just for funsies here's a quicksort

  console.log(data);

  data = data.filter(d => d.overallRank <= 10); // modified headers in data to be less awful to work with

  console.log(data);

  // d3 stuff here:
  const margin = { top: 30, right: 125, bottom: 100, left: 100 };
  const width = 800;
  const height = 550;

  // SCALES
  // x scale
  const xScale = d3.scaleBand()
    .range([0, width])
    .domain(data.map(d => d.countryOrRegion))
    .padding(0.1);
  
  // y scale

  const yMin = Math.floor(d3.min(data, d => d.score)); // Find min and max rounded to nearest whole int mathematically
  const yMax = Math.ceil(d3.max(data, d => d.score));
  
  console.log(yMin, yMax);
  
  const yExtent = d3.extent(data, d => d.score);
  
  const yScale = d3.scaleLinear()
    .range([0, height])
    .domain([yMax, yMin]);

  const colourScale = d3.scaleSequential().domain([0, data.length]).interpolator(d3.interpolateRainbow);
  
  // DRAWING STUFF
  const svg = d3.select("#svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // X AXIS
  svg.append('g')
    .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .attr("transform", "translate(-10, 0) rotate(-45)")
    .style("text-anchor", "end")
    .attr('font-size', '0.8rem')
    .attr('font-family', 'helvetica');

  // X AXIS LABEL
  svg.append('text')
    .attr('class', 'x-axis-label')
    .attr('text-anchor', 'middle')
    .attr('font-family', 'helvetica')
    .attr('x', width / 2 + margin.left)
    .attr('y', height + margin.top + margin.bottom - 10)
    .text('Country');

  // Y AXIS
  svg.append('g')
    .call(d3.axisLeft(yScale))
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Y AXIS LABEL
  svg.append('text')
    .attr('class', 'y-axis-label')
    .attr('text-anchor', 'middle')
    .attr('font-family', 'helvetica')
    .attr('x', -(height / 2) - margin.top)
    .attr('y', margin.left / 2)
    .attr('transform', 'rotate(-90)')
    .text('Happiness Score');

  // BARS
  const barGroup = svg.append('g')
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  barGroup
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.countryOrRegion))
    .attr('y', d => yScale(d.score))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - yScale(d.score))
    .attr('fill', (d, i) => colourScale(i));

  barGroup
    .selectAll('.bar-label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'bar-label')
    .attr('x', d => xScale(d.countryOrRegion) + 20)
    .attr('y', d => yScale(d.score) - 5)
    .text(d => d.score)
      .attr('font-size', '0.8rem')
      .attr('font-family', 'helvetica');
}

loadData();