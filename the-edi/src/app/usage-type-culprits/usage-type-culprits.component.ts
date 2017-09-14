import { Component, OnInit, ViewChild, Input, ElementRef, HostListener, HostBinding } from '@angular/core';
import { SelectionTrackingService } from '../service/selection-tracking.service';
import { Router, NavigationEnd } from '@angular/router';
import { CompanyInfoService, CompanyInfo } from '../service/company-info.service';
import { FullApp, CompanyStats } from '../service/app-info-types.service';
import { XrayAPIService } from '../service/xray-api.service';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';
import * as colours from 'd3-scale-chromatic';
import * as _ from 'lodash';


@Component({
  selector: 'app-usage-type-culprits',
  templateUrl: './usage-type-culprits.component.html',
  styleUrls: ['./usage-type-culprits.component.scss']
})
export class UsageTypeCulpritsComponent implements OnInit {
  @ViewChild('companyCulprits') chart: ElementRef;
  private child: ElementRef;
  private dataset: any = [{label:'', value: 0, app: []}];

  // https://bl.ocks.org/mbostock/4062045
  private chartWidth: number;
  private chartHeight: number;
  private appTypes: string[] = [];
  private genreStatsSubscription: Subscription = new Subscription();
  public loadingComplete: boolean = false;

  constructor(private appTracker: SelectionTrackingService,
              private xrayAPI: XrayAPIService,
              private router: Router,
              private el: ElementRef,
              private companyLookup: CompanyInfoService) {
    router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd ) {
        this.buildGraph(this.dataset);
      }
    });
  }

  buildDataset(companies: CompanyStats[]) {
    // [{label: string, value: float}]
    this.appTypes = _.uniq(companies.slice(0,50).map((company) => company.type).filter(type => type != '' && type != 'unknown'));
    return {name:'Types', children: this.appTypes.map((type) => { return {name:type=='app'?'functionality':type, children: companies .filter((company) => company.type == type).sort((a,b) => b.companyFreq - a.companyFreq).slice(0,5).map((company)=>{return {name: company.company}})}})};
  }


  buildGraph(dataset) {
    var svg = d3.select(this.chart.nativeElement);
    svg.selectAll('*').remove();
    this.chartHeight = this.el.nativeElement.children[0].offsetHeight;
    this.chartWidth = this.el.nativeElement.children[0].offsetWidth;

    svg.attr('height', this.el.nativeElement.children[0].offsetHeight);
    svg.attr('width', this.el.nativeElement.children[0].offsetWidth);
    var margin = { top: 10, right: 200, bottom: 20, left: 20 };
    var width = this.chartWidth - margin.left - margin.right;
    var height = this.chartHeight - margin.top - margin.bottom;
    
    // declares a tree layout and assigns the size
    var treemap = d3.tree()
        .size([height, width]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(dataset);

    // maps the node data to the tree layout
    nodes = treemap(nodes);

    var g = svg.append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    // adds the links between the nodes
    // adds the links between the nodes
    var link = g.selectAll(".link")
        .data( nodes.descendants().slice(5))
      .enter().append("path")
        .attr("class", "link")
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-width', '2px')
        .attr("d", (d) => {
         return "M" + (d.y) + "," + d.x
          + "C" + (d.y + d.parent.y) / 2 + "," + d.x
          + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
          + " " + d.parent.y + "," + d.parent.x;
        });
      var colour = d3.scaleOrdinal(d3.schemeCategory20);

      // adds each node as a group
      var node = g.selectAll(".node")
          .data(nodes.descendants().slice(1))
        .enter().append("g")
          .attr('fill', (d) => colour(d.data.name))
          .attr('stroke', '#000')
          .attr('stroke-width', '1.5px')
          .attr("transform", (d) =>  "translate(" + d.y + "," + d.x + ")" );

      // adds the circle to the node
      node.append("circle")
        .attr("r", 10);

      // adds the text to the node
      node.append("text")
        .attr("dy", ".35em")
        .attr("x", (d) =>  Array.from(['functionality','Types']).concat(this.appTypes).includes(d.data.name) ? -13 : 13)
        .attr('stroke', 'none')
        .style('fill', '#000')
        .style('font-weight', '400')
        .style("text-anchor",(d) => Array.from(['functionality','Types']).concat(this.appTypes).includes(d.data.name) ? 'end' : "start")
        .text((d) => d.data.name );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event){
      this.buildGraph(this.dataset);
  }

  private graphInit() {
    this.loadingComplete = false;
    if(!this.genreStatsSubscription.closed) {
      this.genreStatsSubscription.unsubscribe();
    }

    this.genreStatsSubscription = this.xrayAPI.fetchCompanyFreq().subscribe((data: CompanyStats[]) => {
      this.dataset = this.buildDataset(data);
      this.buildGraph(this.dataset);
    });
  }
  
  ngOnInit(): void {
    this.graphInit(); 
    // Select the HTMl SVG Element from the template
  }

}
