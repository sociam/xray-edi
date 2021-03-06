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
  selector: 'app-company-coverage-bar',
  templateUrl: './company-coverage-bar.component.html',
  styleUrls: ['./company-coverage-bar.component.scss']
})
export class CompanyCoverageBarComponent implements OnInit {

@Input() onlySingle: boolean = true;
@Input() compareView: boolean = false;N
  @ViewChild('companyChart') chart: ElementRef;
  private child: ElementRef;
  private dataset: any = [{label:'', value: 0, app: []}];

  // https://bl.ocks.org/mbostock/4062045
  private chartWidth: number;
  private chartHeight: number;

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
    let dataset = companies.map((company) => 
    {
      return {
        label: company.company,
         type: company.type == 'app' ? 'functionality' : company.type, 
        value: company.companyFreq*100
      }
  });
    return dataset.sort((a,b) =>  b.value - a.value).map((company, idx) => {
      return {label: company.label,type: company.type, value: company.value, idx: idx}
    }).slice(0,50);
  }


  buildGraph(dataset) {
    var svg = d3.select(this.chart.nativeElement);
    svg.selectAll('*').remove();
    this.chartHeight = this.el.nativeElement.children[0].offsetHeight;
    this.chartWidth = this.el.nativeElement.children[0].offsetWidth;

    svg.attr('height', this.el.nativeElement.children[0].offsetHeight);
    svg.attr('width', this.el.nativeElement.children[0].offsetWidth);
    var margin = { top: 20, right: 40, bottom: 110, left: 80 };
    var width = this.chartWidth - margin.left - margin.right;
    var height = this.chartHeight - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

           
    x.domain(dataset.map((d) => d.label ));
    y.domain([0, 100]);

    g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    g.selectAll('text')
    .attr('y', 10)
    .attr('x', 5)
    .attr('dy', '.35em')
    .attr('transform', 'rotate(45)')
    .style('text-anchor', 'start');

    svg.append('text')             
      .attr('transform','translate(' + (width/2 + margin.left/2) + ' ,' + (height  + margin.bottom) + ')')
      .style('text-anchor', 'middle')
      .text('Company');

    svg.append('text')
      .attr('transform', 'translate(' + (margin.left / 2 ) + ' ,' + (height/2 + margin.top) + ') rotate(-90)')
      .style('text-anchor', 'middle')
      .text('Presence in apps');


    g.append('g')
        .call(d3.axisLeft(y).ticks(20).tickFormat(d => d + '%'))
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Average Host Count');

    var colour = d3.scaleOrdinal(d3.schemeCategory20);
    var div = d3.select('body').append('div').attr('class', 'toolTip');
    div.style('position', 'absolute')
       .style('display', 'none')
       .style('width', 'auto')
       .style('height', 'auto')
       .style('background', 'rgba(34,34,34,0.8)')
       .style('border', '0 none')
       .style('border', 'radius 8px 8px 8px 8px')
       .style('box-shadow', '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)')
       .style('color', '#fff')
       .style('font-size', '0.75em')
       .style('padding', '5px')
       .style('text-align', 'left');

    var bars = g.selectAll('g.bar')
      .data(dataset)
      .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('id', (d)=>d.label)
        .attr('x', (d) => x(d.label))
        .attr('y', (d)  => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', (d) => height - y(d.value))
        .attr('fill', (d) => colour(d.idx/dataset.length))
        .on('mousemove', (d) => {
          div.style('left', d3.event.pageX+10+'px');
          div.style('top', d3.event.pageY-25+'px');
          div.style('display', 'inline-block');
          div.html('<strong>' + d.label + '</strong><br>Features in ' + (d.value).toFixed(2).replace('.00','') + '% of apps.<br>Usage: '+d.type );
          bars.attr('fill', 'grey');
          svg.selectAll('#' + d.label)
          .attr('fill', 'green')
          .attr('cursor', 'none');
        })
        .on('mouseout', (d) => {
          div.style('display', 'none')
          dataset.map(element => {
            svg.selectAll('#' + element.label).attr('fill', (element)=>colour(element.idx/dataset.length));
          });
        });    
    
      this.loadingComplete = true;
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
