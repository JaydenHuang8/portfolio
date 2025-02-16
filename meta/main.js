

// let data = [];
// let commits = []; 
// let brushSelection = null;
// let xScale, yScale;  


// async function loadData() {
//   data = await d3.csv('loc.csv', (row) => ({
//     ...row,
//     line: Number(row.line), // or just +row.line
//     depth: Number(row.depth),
//     length: Number(row.length),
//     date: new Date(row.date + 'T00:00' + row.timezone),
//     datetime: new Date(row.datetime),
//   }));
//   processCommits();
//   displayStats();
//   createScatterplot();
// }

// document.addEventListener('DOMContentLoaded', async () => {
//   await loadData();
  
//   brushSelector();
// });

// function processCommits() {
//   commits = d3
//     .groups(data, (d) => d.commit)
//     .map(([commit, lines]) => {
//       // Each 'lines' array contains all lines modified in this commit
//       // All lines in a commit have the same author, date, etc.
//       // So we can get this information from the first line
//       let first = lines[0];

//       // What information should we return about this commit?
//       let { author, date, time, timezone, datetime } = first;
//       let ret = {
//         id: commit,
//         url: 'https://github.com/JaydenHuang8/portfolio/commit/' + commit,
//         author,
//         date,
//         time,
//         timezone,
//         datetime,
//         // Calculate hour as a decimal for time analysis
//         // e.g., 2:30 PM = 14.5
//         hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
//         // How many lines were modified?
//         totalLines: lines.length,
//       };

//       Object.defineProperty(ret, 'lines', {
//         value: lines,
//         // What other options do we need to set?
//         // Hint: look up configurable, writable, and enumerable
//       });
//       return ret;
//     });
// }

// function displayStats() {
//   // Create the dl element
//   //const dl = d3.select('#stats').append('dl').attr('class', 'stats');
//   const dl = d3.select('#stats').append('dl').attr('id', 'profile-stats');

//   // Add total LOC
//   dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
//   dl.append('dd').text(data.length);

//   // Add total commits
//   dl.append('dt').text('Commits');
//   dl.append('dd').text(commits.length);

//   // Add more stats as needed...

//   // **Number of files in the codebase**
//   let uniqueFiles = new Set(data.map((d) => d.file)).size;
//   dl.append('dt').text('Files');
//   dl.append('dd').text(uniqueFiles);

//   // **Maximum file length (in lines)**
//   let maxFileLength = d3.max(data, (d) => d.length) || 0;
//   dl.append('dt').text('Max Lines');
//   dl.append('dd').text(maxFileLength);

//   // **First and last commit dates**
//   let sortedCommits = [...commits].sort((a, b) => a.datetime - b.datetime);
//   let firstCommitDate = sortedCommits[0]?.date || "N/A";
//   let lastCommitDate = sortedCommits[sortedCommits.length - 1]?.date || "N/A";

//   // **Day of the week most work is done**
//   let dayOfWeekFrequency = d3.rollup(
//     commits,
//     (v) => v.length,
//     (d) => d.datetime.getDay() // Get day of the week (0=Sunday, 6=Saturday)
//   );

//   let mostActiveDayIndex = [...dayOfWeekFrequency.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
//   let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//   let mostActiveDay = daysOfWeek[mostActiveDayIndex] || "N/A";

//   dl.append('dt').text('Top workday');
//   dl.append('dd').text(mostActiveDay);

//   // **Most active commit hour**
//   let hourFrequency = d3.rollup(
//     commits,
//     (v) => v.length,
//     (d) => Math.floor(d.hourFrac) // Group by hour
//   );

//   let mostActiveHour = [...hourFrequency.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
//   dl.append('dt').text('Top hour');
//   dl.append('dd').text(mostActiveHour + ":00");
// }

// function createScatterplot() {
//   const width = 1000;
//   const height = 600;


//   const margin = { top: 10, right: 10, bottom: 30, left: 20 };
//   const usableArea = {
//     top: margin.top,
//     right: width - margin.right,
//     bottom: height - margin.bottom,
//     left: margin.left,
//     width: width - margin.left - margin.right,
//     height: height - margin.top - margin.bottom,
//   };

//   const svg = d3
//       .select('#chart')
//       .append('svg')
//       .attr('viewBox', `0 0 ${width} ${height}`)
//       .style('overflow', 'visible');

//   // Update scales with new ranges
//   xScale = d3.scaleTime()
//     .domain(d3.extent(commits, (d) => d.datetime)) // Get min/max date
//     .range([usableArea.left, usableArea.right]) // Use adjusted area
//     .nice();

//   // Use adjusted area
//   yScale = d3.scaleLinear()
//     .domain([0, 24]) // 0 to 24 hours
//     .range([usableArea.top, usableArea.bottom]); 

//   // Update scales with new ranges
//   xScale.range([usableArea.left, usableArea.right]);
//   yScale.range([usableArea.bottom, usableArea.top]);

//   // Create the axes
//   const xAxis = d3.axisBottom(xScale);
//   const yAxis = d3
//     .axisLeft(yScale)
//     .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');

//   // Add X axis
//   svg
//     .append('g')
//     .attr('transform', `translate(0, ${usableArea.bottom})`)
//     .call(xAxis);

//   // Add Y axis
//   svg
//     .append('g')
//     .attr('transform', `translate(${usableArea.left}, 0)`)
//     .call(yAxis);
 

//   const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
  
//   updateTooltipVisibility(false);

//   const rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([5, 25]); 
//   // adjust these values based on your experimentation

//   const dots = svg.append('g').attr('class', 'dots');
//   dots
//     .selectAll('circle')
//     .data(commits)
//     .join('circle')
//     .attr('cx', (d) => xScale(d.datetime))
//     .attr('cy', (d) => yScale(d.hourFrac))
//     .attr('r', 5)
//     .attr('fill', 'steelblue')
//     .attr('r', (d) => rScale(d.totalLines))
//     .style('fill-opacity', 0.7) // Add transparency for overlapping dots
//     .on('mouseenter', (event, commit) => {
//       d3.select(event.currentTarget).style('fill-opacity', 1); // Full opacity on hover
//       updateTooltipContent(commit);
//       updateTooltipVisibility(true);
//       updateTooltipPosition(event);
//     })
//     .on('mouseleave', () => {
//       d3.select(event.currentTarget).style('fill-opacity', 0.7); // Full opacity on hover
//       updateTooltipContent({}); // Clear tooltip content
//       updateTooltipVisibility(false);
//     });

//     // Sort commits by total lines in descending order
//     const sortedCommits = d3.sort(commits, (d) => -d.totalLines);

//     // Use sortedCommits in your selection instead of commits
//     dots.selectAll('circle').data(sortedCommits).join('circle');



//   // Add gridlines BEFORE the axes
//   const gridlines = svg
//   .append('g')
//   .attr('class', 'gridlines')
//   .attr('transform', `translate(${usableArea.left}, 0)`);

//   // Create gridlines as an axis with no labels and full-width ticks
//   gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));
// }

// function updateTooltipContent(commit) {
//   const link = document.getElementById('commit-link');
//   const date = document.getElementById('commit-date');

//   if (Object.keys(commit).length === 0) return;

//   link.href = commit.url;
//   link.textContent = commit.id;
//   date.textContent = commit.datetime?.toLocaleString('en', {
//     dateStyle: 'full',
//   });
// }

// function updateTooltipVisibility(isVisible) {
//   const tooltip = document.getElementById('commit-tooltip');
//   tooltip.hidden = !isVisible;
// }

// function updateTooltipPosition(event) {
//   const tooltip = document.getElementById('commit-tooltip');
//   tooltip.style.left = `${event.clientX}px`;
//   tooltip.style.top = `${event.clientY}px`;
// }



// function brushed(event) {
//   brushSelection = event.selection;
//   updateSelection();
// }

// function isCommitSelected(commit) {
//   if (!brushSelection) {
//     return false;
//   }
//   const min = { x: brushSelection[0][0], y: brushSelection[0][1] };
//   const max = { x: brushSelection[1][0], y: brushSelection[1][1] };

//   const x = xScale(commit.datetime); 
//   const y = yScale(commit.hourFrac); 

//   return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
// }

// function updateSelection() {
//   // Update visual state of dots based on selection
//   d3.selectAll('circle').classed('selected', (d) => isCommitSelected(d));
// }


// function brushSelector() {
//   const svg = document.querySelector('svg');

//   // Create brush
//   d3.select(svg).call(d3.brush().on('start brush end', brushed));

//   // Raise dots and everything after overlay
//   d3.select(svg).selectAll('.dots, .overlay ~ *').raise();

  
// }

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let data = [];
let commits = [];
let brushSelection = null
let xScale, yScale;

async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
        ...row,
        line: Number(row.line), // or just +row.line
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime),
      }));

    processCommits();
    displayStats();
    createScatterplot();
}


function processCommits() {
    commits = d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
  
        // What information should we return about this commit?
        let ret = {
          id: commit,
          url: 'https://github.com/YOUR_REPO/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length
        };

        Object.defineProperty(ret, 'lines', {
            value: lines,
            enumerable: false, // Prevents cluttering console output
            writable: false,   // Makes it read-only
            configurable: false

          });
        
        return ret;
      });

    console.log(commits);
}

function displayStats() {
    // Process commits first
    processCommits();

    // Create the dl element
    const dl = d3.select('#stats').append('dl').attr('class', 'stats')

    // Add total LOC
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);

    // Add total commits
    dl.append('dt').text('Commits');
    dl.append('dd').text(commits.length);

    const uniqueFiles = new Set(data.map(d => d.file)).size;
    dl.append('dt').text('Files');
    dl.append('dd').text(uniqueFiles);

    // // Add maximum depth
    // const maxDepth = d3.max(data, d => d.depth);
    // dl.append('dt').text('Max depth');
    // dl.append('dd').text(maxDepth);

    // // Add longest line
    // const longestLine = d3.max(data, d => d.length);
    // dl.append('dt').text('Longest line');
    // dl.append('dd').text(longestLine);
    
  // **Day of the week most work is done**
  let dayOfWeekFrequency = d3.rollup(
    commits,
    (v) => v.length,
    (d) => d.datetime.getDay() // Get day of the week (0=Sunday, 6=Saturday)
  );

  let mostActiveDayIndex = [...dayOfWeekFrequency.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let mostActiveDay = daysOfWeek[mostActiveDayIndex] || "N/A";

  dl.append('dt').text('Top workday');
  dl.append('dd').text(mostActiveDay);

  // **Most active commit hour**
  let hourFrequency = d3.rollup(
    commits,
    (v) => v.length,
    (d) => Math.floor(d.hourFrac) // Group by hour
  );

  let mostActiveHour = [...hourFrequency.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  dl.append('dt').text('Top hour');
  dl.append('dd').text(mostActiveHour + ":00");

}
  
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    commits = d3.groups(data, (d) => d.commit); 
  
});

const width = 1000;
const height = 600;

function createScatterplot() {
    if (!commits.length) return;
    
    const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

    brushSelector(svg);

    const margin = { top: 10, right: 10, bottom: 20, left: 20 };

    const usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom,
    };
      
    // Update scales with new ranges
    xScale = d3.scaleTime()
        .domain(d3.extent(commits, (d) => d.datetime)) // Get min/max date
        .range([usableArea.left, usableArea.right]) // Use adjusted area
        .nice();

    // Use adjusted area
    yScale = d3.scaleLinear()
        .domain([0, 24]) // 0 to 24 hours
        .range([usableArea.top, usableArea.bottom]); 

    const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);

   // adjust these values based on your experimentation
    const rScale = d3
          .scaleSqrt() // square root
          .domain([minLines, maxLines])
          .range([5, 35]);
    
    const sortedCommits = d3.sort(commits, (d) => -d.totalLines);

    const gridlines = svg
    .append('g')
    .attr('class', 'gridlines')
    .attr('transform', `translate(${usableArea.left}, 0)`);
      
    // Create gridlines as an axis with no labels and full-width ticks
    gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

    // Create the axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d => `${String(d).padStart(2, '0')}:00`); // Format as "00:00"

    // Add X axis
    svg
    .append('g')
    .attr('transform', `translate(0, ${usableArea.bottom})`)
    .call(xAxis);

    // Add Y axis
    svg
    .append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(yAxis);

    const dots = svg.append("g").attr("class", "dots");
    
    updateTooltipVisibility(false);

    dots.selectAll("circle")
        .data(sortedCommits)
        .join("circle")
        .attr("cx", (d) => xScale(d.datetime)) // X position based on date
        .attr("cy", (d) => yScale(d.hourFrac)) // Y position based on time of day
        .attr("r", (d) => rScale(d.totalLines)) // Dynamic radius based on totalLines
        .attr("fill", "steelblue") // Dot color
        .style("fill-opacity", 0.5) // Add transparency for overlapping dots
        .on('mouseenter', function (event, commit) {
          d3.select(event.currentTarget).style('fill-opacity', 1); // Highlight dot on hover
          updateTooltipContent(commit);
          updateTooltipVisibility(true);
          updateTooltipPosition(event);
        })
        .on('mouseleave', function(event) {

          d3.select(event.currentTarget).style('fill-opacity', 0.7); // Restore opacity
          updateTooltipContent({});
          updateTooltipVisibility(false);
        });
}


function updateTooltipVisibility(isVisible) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.hidden = !isVisible;
}

function updateTooltipPosition(event) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.style.left = `${event.clientX}px`;
  tooltip.style.top = `${event.clientY}px`;
}
function updateTooltipContent(commit) {

  //console.log("Hovered commit:", commit);

  const tooltip = document.getElementById('commit-tooltip'); 
  if (!tooltip) return;

  const link = document.getElementById('commit-link');
  const date = document.getElementById('commit-date');
  const time = document.getElementById('commit-time');
  const author = document.getElementById('commit-author');
  const lines = document.getElementById('commit-lines');

  if (Object.keys(commit).length === 0) {
    return;
  }

  tooltip.innerHTML = `
        <strong>Commit:</strong> ${commit.id}<br>
        <strong>Date:</strong> ${commit.datetime?.toLocaleString('en', { dateStyle: 'full' })}<br>
        <strong>Time:</strong> ${commit.time}<br>
        <strong>Author:</strong> ${commit.author}<br>
        <strong>Lines Edited:</strong> ${commit.totalLines}
    `;

  tooltip.style.display = 'block';
}


function brushSelector(svg) {

  if (!svg) {
    console.error("Error: SVG is undefined in brushSelector!");
    return;
  }
  const brush = d3.brush()
        .on("start brush end", brushed);

  svg.append("g")
      .attr("class", "brush")
      .call(brush);

  svg.selectAll('.dots, .brush ~ *').raise();
}

function brushed(event) {
  if (!event.selection) {
    brushSelection = null;
  } else {
      brushSelection = event.selection;
  }
  updateSelection();
  updateSelectionCount();
  updateLanguageBreakdown()
}

function isCommitSelected(commit) {
  if (!brushSelection) return false;

  const [[xMin, yMin], [xMax, yMax]] = brushSelection;

  const x = xScale(commit.datetime);
  const y = yScale(commit.hourFrac);

  return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
}

function updateSelection() {
  d3.selectAll('circle')
    .classed('selected', (d) => isCommitSelected(d));
}

function updateSelectionCount() {
  const selectedCircles = d3.selectAll('circle')
    .classed('selected', (d) => isCommitSelected(d));

  //Extract the selected commits from the selected circles' data
  const selectedCommits = selectedCircles.data().filter(isCommitSelected);

  //Update the commit count in the UI
  const countElement = document.getElementById('selection-count');
  if (countElement) {
    countElement.textContent = `${
      selectedCommits.length || 'No'
    } commits selected`;
  }

  return selectedCommits;
}

function updateLanguageBreakdown() {
  // Get selected circles (visually selected commits)
  const selectedCircles = d3.selectAll('circle').filter('.selected');

  // Extract the selected commits from the selected circles' data
  const selectedCommits = selectedCircles.data();
  

  const container = document.getElementById('language-breakdown');

  if (selectedCommits.length === 0) {
    container.innerHTML = '';
    return;
  }
  const requiredCommits = selectedCommits.length ? selectedCommits : commits;
  const lines = requiredCommits.flatMap((d) => d.lines);

  // Use d3.rollup to count lines per language
  const breakdown = d3.rollup(
    lines,
    (v) => v.length,
    (d) => d.type
  );

  // Update DOM with breakdown
  container.innerHTML = '';

  for (const [language, count] of breakdown) {
    const proportion = count / lines.length;
    const formatted = d3.format('.1~%')(proportion);

    container.innerHTML += `
            <dt>${language}</dt>
            <dd>${count} lines (${formatted})</dd>
        `;
  }

  return breakdown;
}
