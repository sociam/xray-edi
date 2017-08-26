// Following http://blog.tomscholten.nl/make-a-bar-chart-in-angular-4-using-d3-js/

import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { SelectionTrackingService } from '../service/selection-tracking.service';
import { FullApp } from '../service/app-info-types.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-host-count-bar-chart',
  templateUrl: './host-count-bar-chart.component.html',
  styleUrls: ['./host-count-bar-chart.component.css']
})

export class HostCountBarChartComponent implements OnInit {
  @ViewChild('chart') chart: ElementRef;
  @Input() dataset: Array<any> = [
    {x:1 , y:Math.random() * 100 },
    {x:2 , y:Math.random() * 100 },
    {x:3 , y:Math.random() * 100 },
    {x:4 , y:Math.random() * 100 },
    {x:5 , y:Math.random() * 100 },
  ];

  chartWidth: number = 200;
  chartHeight: number = 200;

  constructor(private appTracker: SelectionTrackingService) { }

  buildDataset(selection: FullApp[]): void {
    
  }

  ngOnInit(): void {

    this.appTracker.currentSelectionChanged.subscribe((data) => {
      let selection = this.appTracker.getSelections();
      let appData = Array.from(selection.keys()).map((key) => selection.get(key));

      this.buildDataset(appData);
    });
    // Select the HTMl SVG Element from the template
    var svg = d3.select(this.chart.nativeElement);

    // Set the height and width of the SVG element.
    svg.attr('height', this.chartHeight)
    svg.attr('width', this.chartWidth);

    // initialise some variables defining the margins as well as H/W as a result of those
    var margin = { top: 10, right: 10, bottom: 10, left: 10 };

    var width = this.chartWidth - margin.left - margin.right;
    var height = this.chartHeight - margin.top - margin.bottom;
    
    // initialise some axes.
    var x = d3.scaleBand().rangeRound([0, width]).padding(0);
    var y = d3.scaleLinear().rangeRound([height, 0]);

    // set the domain of the x and y axes.
    x.domain(this.dataset.map((d) => { return d.x }));
    y.domain([0, d3.max(this.dataset, (d) => { return d.y })]);
 
    var g = svg.append('g')
               .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    g.append('g')
     .selectAll('.bar')
     .data(this.dataset)
     .enter()
     .append('rect')
     .attr('class', 'bar')
     .attr('x', (d) =>  { return x(d.x) })
     .attr('y', (d) => { return y(d.y) })
     .attr('width', x.bandwidth())
     .attr('height', (d) => {return height - y(d.y)})
     .attr('fill', (d: any) =>{return 'hsl(' + Math.random() * 360 + ', 100%, 50%)' })

 
  var div = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('display', 'none');
 
  function mouseover() {
    div.style('display', 'inline');
  }
 
  function mousemove(x, y) {
    div
      .text(x + ': ' + y)
      .style('left', (d3.event.pageX - 34) + 'px')
      .style('top', (d3.event.pageY - 12) + 'px');
  }
 
  function mouseout() {
    div.style('display', 'none');
  }
  }

}
