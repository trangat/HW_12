// DON'T FORGET to initalize server!! 
// python -m http.server

// create initial dashboard visualization with sample set 
function init() {
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names; 

        sampleNames.forEach((sample) =>{
            d3.select("#selDataset")
            .append("option").text(sample).property("value", sample);  
        });  
        var initialSample = sampleNames[0]
         
        buildCharts(initialSample); 
    
    }); 
}

// //create option handler to be called when dropdown menu item is selected
d3.selectAll("#selDataset").on("change", optionChanged); 

// create dropdown menu 
function optionChanged(newSample) {
    buildCharts(newSample) 
}

// Use the D3 library to read in .json & build charts 
function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples; 
        // console.log(samples); 

        var resultArray = samples.filter(sampleData => sampleData.id == sample); 
        var results = resultArray[0]

        // for some reason this kept giving me an error below... 
        // var x = results.sample_values.slice(0,10).reverse()

        // create trace for bar chart with top 10 OTUs found for that individual
        var trace = [{
            type: 'bar',
            x: results.sample_values.slice(0,10).reverse(), 
            y: results.otu_ids.slice(0,10).map(x => `OTU ${x}`).reverse(),
            orientation: 'h',
            text: results.otu_labels.slice(0,10).reverse()
        }];
        // format bar chart
        var layout = {
            title: "Belly Button Bar Chart",
            margin:  {t: 30, l: 150}, 
            yaxis: {
                title: "OTU ID"
            }, 
            xaxis: {
                title: "Sample Value"
            }
        }; 
        // plot bar chart 
        Plotly.newPlot("bar", trace, layout);

        // create trace for bubble chart 
        var trace1 = [{
            x: results.otu_ids, 
            y: results.sample_values, 
            mode: "markers", 
            marker: {
                size: results.sample_values, 
                color: results.otu_ids, 
            }, 
            text: results.otu_labels, 
        }]; 
        // format bubble chart
        var layout = {
            title: "Belly Button Bubble Chart", 
            xaxis: {
                title: "OTU ID"
            }, 
            yaxis: {
                title: "Sample Value"
            }, 
            width: 1000,
        };
        // plot bubble chart
        Plotly.newPlot('bubble', trace1, layout, {responsive:true});
        
        // build Metadata info-box
        // display the sample metadata, i.e., an individual's demographic information

        var metadata = data.metadata;
        var resultArr = metadata.filter(sampleObj => sampleObj.id == sample);
        var metadataResult = resultArr[0]
        var PANEL = d3.select("#sample-metadata")

        // clear all previous entries 

        PANEL.html(""); 

        Object.entries(metadataResult).forEach(([key, value])=>{
            PANEL.append("h6").text(key + ': ' + value) 
        }); 
    }); 
}; 

// intiialize page
init(); 

