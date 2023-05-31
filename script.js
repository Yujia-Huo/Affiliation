
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
    

//     let count = 0;
// data.forEach(d => {
//   if (d.sdr > 0.5) {
//     count++;
//   }
// });
console.log(dataByYear);

    // console.log(dataByYearSDR);

// console.log(data);
let margin = { top: 100, right: 150, bottom: 80, left: 90 };
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
.call(d3.axisBottom(xScale).ticks(dataByYear.length).tickFormat(d3.format("d")));

svg.append("g")
  .call(d3.axisLeft(yScale).tickFormat(d3.format(".0%")));



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
    .attr("cx", width-260)
    .attr("cy", -20)
    .attr("r", 6)
    .attr('stroke-width',2)
    .attr('stroke','#4e79a7')
    .attr('fill','rgb(241, 241, 241)')

// Append the label for the 'public' line
svg.append("text")
    .attr("x",  width-240)
    .attr("y", -20)
    .text("% Population attend Public Practice weekly")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");

// Append the circle for the 'sdr' line
svg.append("circle")
    .attr("cx", width-260)
    .attr("cy", -50)
    .attr("r", 6)
    .attr('stroke','#59a14f')
    .attr('stroke-width',2)
    .attr('fill','rgb(241, 241, 241)');

// Append the label for the 'sdr' line
svg.append("text")
    .attr("x",width-240)
    .attr("y", -50)
    .text("% Population has Religious Affiliation")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");



    svg.append("text")
  .attr("x", width/2)
  .attr("y", height + margin.bottom-20)
  .style("text-anchor", "middle")
  .style('font-size', '10pt')
  .style('opacity', .5)
  .text("Year");


  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left+30)
  .attr("x", 0 - (height / 2))
  .style('font-size', '10pt')
  .style("text-anchor", "middle")
  .style('opacity', .5)
  .text("Percentage of total population");

})