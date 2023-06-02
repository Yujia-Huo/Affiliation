
// const width =1300;
// const height = 900;


function parseCountries(d) {


    if(d.CountryCode === '578'){

        return{
            country: d.CountryCombined,
            year: +d.WaveYear,
            source: d.project_main, 
            belong: d.belonging_combined === "No religion" ? 0 : 1,
            public: +d.rlgatnd52 < 0.23 ? 0 : 1,
            indiWeekly: +d.pray52< 0.5 ? 0:1,
            sdr: +d.sdr_01F
        }
    }

}

d3.csv('./data/dimr_13.02.csv', parseCountries).then(function(data){



    let groupedData = d3.group(data, d => d.year);
    let dataByYear = Array.from(groupedData, ([key, value]) => ({
        year: key, 
        public: d3.mean(value, d => d.public),
        belong: d3.mean(value, d => d.belong)
    }));


    dataByYear.sort((a, b) => a.year - b.year);
    




    let groupedDataSource = d3.group(data, d => d.source);
let dataBySource = Array.from(groupedDataSource, ([key, value]) => ({
  source: key, 
  // public: d3.mean(value, d => d.public),
  belong: d3.mean(value, d => d.belong),
  // total: value.length
}));
dataBySource.sort((a, b) => d3.ascending(a.source, b.source));

//     let count = 0;
// data.forEach(d => {
//   if (d.sdr > 0.5) {
//     count++;
//   }
// });
console.log(dataBySource);

    // console.log(dataByYearSDR);

// console.log(data);
let margin = { top: 100, right: 150, bottom: 80, left: 130 };
let width = 1200;
let height = 500;

// Define scales
let xScale = d3.scaleLinear().range([0, width]);
let yScale = d3.scaleLinear().range([height, 0]);

let lineBelong= d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.belong));
    // .curve(d3.curveBasis);


// Define line generator
let line = d3.line()
  .x(d => xScale(d.year))
  .y(d => yScale(d.public));
//   .curve(d3.curveBasis);


  let svg = d3.select("#viz").append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
  .attr("viewBox", `0 0 ${ width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);


  xScale.domain(d3.extent(dataByYear, d => +d.year));
  yScale.domain([0, 1]);


    // Append x-axis
svg.append("g")
.attr("transform", `translate(0,${height})`)
.call(d3.axisBottom(xScale).ticks(dataByYear.length).tickFormat(d3.format("d")))
.style("font-size", "14px");

svg.append("g")
  .call(d3.axisLeft(yScale).tickFormat(d3.format(".0%")))
  .style("font-size", "14px");



  svg.append("g")			
  .attr("class", "grid")
  .call(d3.axisLeft(yScale)
    .tickSize(-width)
    .tickFormat("")
  )
  .select(".domain").remove();




  svg.append("path")
  .datum(dataByYear)
  .attr("fill", "none")
  .attr("stroke", "#4e79a7")
  .attr("stroke-width", 3)
  .attr("d", line);

svg.append("path")
  .datum(dataByYear)
  .attr("fill", "none")
  .attr("stroke", "#59a14f")
  .attr("stroke-width", 3)
  .attr("d", lineBelong);


  let blongCircle = svg.append("g")
  .selectAll('circle')
  .data(dataByYear)
  .enter()
  .append('circle')
  .attr('cx', d => xScale(d.year))
  .attr('cy', d => yScale(d.belong))
  .attr('r', 4)
  .attr('stroke','#59a14f')
  .attr('stroke-width',2)
  .attr('fill','rgb(241, 241, 241)')


    let publicCirlce =svg.append('g')
    .selectAll('circle')
    .data(dataByYear)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.year))
    .attr('cy', d => yScale(d.public))
    .attr('r', 4)
    .attr('stroke-width',2)
    .attr('stroke','#4e79a7')
    .attr('fill','rgb(241, 241, 241)')

// Append the circle for the 'public' line
svg.append("circle")
    .attr("cx", width-310)
    .attr("cy", -20)
    .attr("r", 6)
    .attr('stroke-width',2)
    .attr('stroke','#4e79a7')
    .attr('fill','rgb(241, 241, 241)')

// Append the label for the 'public' line
svg.append("text")
    .attr("x",  width-300)
    .attr("y", -20)
    .text("% Population attend Public Practice Monthly")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");

// Append the circle for the 'sdr' line
svg.append("circle")
    .attr("cx", width-310)
    .attr("cy", -50)
    .attr("r", 6)
    .attr('stroke','#59a14f')
    .attr('stroke-width',2)
    .attr('fill','rgb(241, 241, 241)');

// Append the label for the 'sdr' line
svg.append("text")
    .attr("x",width-300)
    .attr("y", -50)
    .text("% Population has Religious Affiliation")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");



    svg.append("text")
  .attr("x", width/2)
  .attr("y", height + margin.bottom-20)
  .style("text-anchor", "middle")
  .style('font-size', '12pt')
  .style('opacity', .5)
  .text("Year");


  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left+50)
  .attr("x", 0 - (height / 2))
  .style('font-size', '12pt')
  .style("text-anchor", "middle")
  .style('opacity', .5)
  .text("Percentage of total population");










  /****************Bar Chart********* */

  let totalAvg = d3.mean(dataBySource, d => d.belong);

  console.log(totalAvg);

  let svg2 = d3.select("#viz2").append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 ${ width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create scales
let yScale2 = d3.scaleBand()
    .range([0, height])
    .padding(0.6);
let xScale2 = d3.scaleLinear()
    .range([0, width]);

yScale2.domain(dataBySource.map(d => d.source));
xScale2.domain([0, 1]);

svg2.append("g")			
.attr("class", "grid")
.attr("transform", `translate(0,${height})`)  // Adjust the transformation here
.call(d3.axisBottom(xScale2)
  .tickSize(-height)  // should be height, not width
  .tickFormat("")
)

.select(".domain").remove();

// Create bars
svg2.selectAll(".bar")
    .data(dataBySource)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("y", d => yScale2(d.source))
    .attr("height", yScale2.bandwidth())
    .attr("x", 0)
    .attr('fill', '#4e79a7')
    .attr("width", d => xScale2(d.belong));

// Add x-axis
svg2.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale2).tickFormat(d3.format(".0%")))
    .style("font-size", "14px");

// Add y-axis
svg2.append("g")
    .call(d3.axisLeft(yScale2))
    .style("font-size", "14px");


    let xPos = xScale2(totalAvg);

svg2.append("line")
    .attr("x1", xPos)  // x position of the start and end of the line
    .attr("x2", xPos)
    .attr("y1", 0)  // y position of the start of the line (top of the chart area)
    .attr("y2", height)  // y position of the end of the line (bottom of the chart area)
    .attr("stroke", "#76b7b2")  // color of the line
    .attr("stroke-width", 2)  // width of the line
    // .attr("stroke-dasharray", "5,5");

    svg2.append("text")
    .attr("x", xPos + 10)  // x position of the text (slightly right from the line)
    .attr("y", 0)  // y position of the text (near the top of the chart area)
    .text("Total Average Percentage of Affiliation")  // the text to display (the average rounded to 2 decimal places)
    // .attr("font-family", "sans-serif")  // font of the text
    .attr("font-size", "16px")  // size of the text
    .attr("fill", "#76b7b2"); 


    svg2.append("text")
    .attr("x", width/2)
    .attr("y", height + margin.bottom-20)
    .style("text-anchor", "middle")
    .style('font-size', '14pt')
    .style('opacity', .5)
    .text("Percentage of total population");


    svg2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+60)
    .attr("x", 0 - (height / 2))
    .style('font-size', '14pt')
    .style("text-anchor", "middle")
    .style('opacity', .5)
    .text("Source");

})