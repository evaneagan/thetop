import {data} from "./data"
import {select, selectAll} from "d3-selection"
import {scaleLinear, scaleSqrt} from "d3-scale"
import {line, curveCardinal, area} from "d3-shape"
import {max, descending, ascending} from "d3-array"
import {transition} from "d3-transition"





const svg = select("svg")


data = data.map((d, i) => {
    d.difference = d.imdb - d.metascore
    return d
})





svg
    .attr("height", 40 * data.length)
    .attr("width", 960)

const scoreScale = scaleLinear()
    .domain([0, 100])
    .range([420, 900])


const areaData = area()
    .x0( (d, i) => { return scoreScale(d.imdb) } )
    .x1( (d, i) => { return scoreScale(d.metascore) } )
    .y0( (d, i) => { return i * 40 + 20 } )
    .y1( (d, i) => { return i * 40 + 20 } )

const areaPath = svg
    .append("path")
    .datum(data)
    .attr("d", areaData)
    .attr("class", "area")


const metascoreLine = line()
    .x( (d, i) => { return scoreScale(d.metascore) } )
    .y( (d, i) => { return i * 40  + 20 } )
//    .curve(curveCardinal.tension(0.25))



const metascorePath = svg
    .append("path")
    .datum(data)
    .attr("d", metascoreLine)
    .attr("class", "metascore")




const imdbLine = line()
    .x( (d, i) => { return scoreScale(d.imdb) } )
    .y( (d, i) => { return i * 40  + 20 } )
 //   .curve(curveCardinal.tension(0.25))



const imdbPath = svg
    .append("path")
    .datum(data)
    .attr("d", imdbLine)
    .attr("class", "imdb")


const groups = svg
    .selectAll("g.movie")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "movie")
    .attr("transform", (d, i) => {return `translate(0, ${i * 40})`})


groups
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", 40)
    .attr("width", 960)
    .attr("class", "background")


groups
    .append("text")
    .attr("x", 90)
    .attr("y", 22)
    .attr("class", "title")
    .text( (d, i) => {return d.title})


groups
    .append("text")
    .attr("x", 24)
    .attr("y", 22)
    .attr("class", "year")
    .text( (d, i) => {return d.year})


groups
    .append("circle")
    .attr("cx", (d, i) => {return  scoreScale(d.metascore) })
    .attr("cy", 20)
    .attr("r", 8)
    .attr("class", "metascore")


groups
    .append("circle")
    .attr("cx", (d, i) => {return  scoreScale(d.imdb) })
    .attr("cy", 20)
    .attr("r", 8)
    .attr("class", "imdb")



















const selectTag = document.querySelector("select")


selectTag.addEventListener("change", function () {
    data.sort((a, b) => {
        if (this.value == "imdb") {
            return descending(a.imdb, b.imdb)
        } else if (this.value == "year") {
            return ascending(a.year, b.year)
        } else if (this.value == "title") {
            return ascending(a.title, b.title)
        } else if (this.value == "difference") {
            return descending(a.difference, b.difference)
        } else {
            return descending(a.metascore, b.metascore)
        }

        
    })


    groups
        .data(data, (d, i) => {return d.title })
        .transition()
        .duration(1000)
        .attr("transform", (d, i) => {return `translate(0, ${i * 40})`})


    imdbPath
        .datum(data, (d, i) => {return d.title})
        .transition()
        .duration(1000)
        .attr("d", imdbLine)


    metascorePath
        .datum(data, (d, i) => {return d.title})
        .transition()
        .duration(1000)
        .attr("d", metascoreLine)


    areaPath
        .datum(data, (d, i) => {return d.title})
        .transition()
        .duration(1000)
        .attr("d", areaData)









})



