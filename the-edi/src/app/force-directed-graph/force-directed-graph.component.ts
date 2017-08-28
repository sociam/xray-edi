import { Component, OnInit, ViewChild, Input, ElementRef, HostListener } from '@angular/core';
import { SelectionTrackingService } from '../service/selection-tracking.service';
import { FullApp } from '../service/app-info-types.service';
import { Router, NavigationEnd } from '@angular/router';

import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
  selector: 'app-force-directed-graph',
  templateUrl: './force-directed-graph.component.html',
  styleUrls: ['./force-directed-graph.component.scss']
})
export class ForceDirectedGraphComponent implements OnInit {

  @ViewChild('chart') chart: ElementRef;
  private dataset: any = {links:[], nodes:[]}

  // https://bl.ocks.org/mbostock/4062045
  chartWidth: number = 960;
  chartHeight: number = 600;

  constructor(private appTracker: SelectionTrackingService, private router: Router) {
    router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd ) {
        this.buildGraph(this.dataset);
      }
    });
   }
  @HostListener('window:resize', ['$event'])
  onResize(event){
      this.buildGraph(this.dataset);
  }
  buildDataset(selection: FullApp[]) {
    // {
    //   "nodes": [
    //     {"id": "Myriel", "group": 1},
    //     ...
    //   ],
    //   "links": [
    //     {"source": "Napoleon", "target": "Myriel", "value": 1},#
    //     ...
    //   ]
    // }
    let nodes = selection.map((app, idx) => {
      return app.hosts.map((host) => {
        return {'id': host, 'title': host,'group': 3}
      }).concat({'id': app.app, 'title': app.storeinfo.title, 'group': idx})
    }).reduce((a,b) => a.concat(b),[]);

    let links = selection.map((app) => {
      return app.hosts.map((host) => {
        return {'source': app.app, 'target': host, 'value': 1};
      })
    }).reduce((a,b) => a.concat(b), []);

    return {'nodes':_.uniqBy(nodes, 'id'),'links':links};
  }

  buildGraph(dataset) {
    var svg = d3.select(this.chart.nativeElement);
    svg.selectAll('*').remove();
    console.log('Drawing chart');

    // Set the height and width of the SVG element.
    svg.attr('height', this.chartHeight)
    svg.attr('width', this.chartWidth);

    var colour = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id((d)=>{ return d.id }))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(this.chartWidth / 2, this.chartHeight / 2));
    
    var link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(dataset.links)
        .enter()
        .append('line')
        .attr('stroke-width', 1)
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6);
        
    var node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(dataset.nodes)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', (d) => {return colour(d.group)})
        .call(d3.drag()
                .on('start', (d) => {
                  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                  d.fx = d.x;
                  d.fy = d.y;
                })
                .on('drag', (d) => {
                  d.fx = d3.event.x;
                  d.fy = d3.event.y;
                })
                .on('end', (d) => {
                  if (!d3.event.active) simulation.alphaTarget(0);
                  d.fx = null;
                  d.fy = null;
                })
              );
              
    node.append('title')
        .text((d) => {return d.title});

    simulation.nodes(dataset.nodes)
              .on('tick', (d) => {
                link.attr("x1", (d) => { return d.source.x; })
                    .attr("y1", (d) => { return d.source.y; })
                    .attr("x2", (d) => { return d.target.x; })
                    .attr("y2", (d) => { return d.target.y; });

                node.attr("cx", (d) => { return d.x; })
                    .attr("cy", (d) => { return d.y; });
              });
    simulation.force('link')
              .links(dataset.links);
  }

  ngOnInit(): void {
    let selection = this.appTracker.getSelections();
    this.dataset = this.buildDataset(Array.from(selection.keys()).map((key) => selection.get(key)));
    this.buildGraph(this.dataset);

    this.appTracker.appSelectionsChanged.subscribe((data) => {
      let selection = this.appTracker.getSelections();
      this.dataset = this.buildDataset(Array.from(selection.keys()).map((key) => selection.get(key)));
      this.buildGraph(this.dataset);
    });
    // Select the HTMl SVG Element from the template
  }

}
