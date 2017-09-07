import { Component, OnInit, ViewChild, Input, ElementRef, HostListener, HostBinding } from '@angular/core';
import { SelectionTrackingService } from '../service/selection-tracking.service';
import { Router, NavigationEnd } from '@angular/router';
import { CompanyInfoService, CompanyInfo } from '../service/company-info.service';
import { FullApp, GenreStats } from '../service/app-info-types.service';
import { XrayAPIService } from '../service/xray-api.service';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
  selector: 'app-host-genre-compare',
  templateUrl: './host-genre-compare.component.html',
  styleUrls: ['./host-genre-compare.component.scss']
})
export class HostGenreCompareComponent implements OnInit {

@Input() onlySingle: boolean = true;
@Input() compareView: boolean = false;N
  @ViewChild('chart') chart: ElementRef;
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
        this.graphInit();
      }
    });
  }

  buildDataset(selection: FullApp[], genres: GenreStats[]) {

    // [{label: string, value: float}]
    let dataset = [];
    selection.map((app) => {
      dataset.push({label: app.storeinfo.title, value: app.hosts.length });
      let genre = genres.filter((genre) => genre.category == app.storeinfo.genre)[0];
      dataset.push({label: genre.category.replace(/_/g, ' '), value: genre.genreAvg});
    });
    dataset.push({label: 'All CATEGORIES', value: genres.reduce((a, b) => a + b.genreAvg, 0)/genres.length});
    return dataset;
  }


  buildGraph(dataset) {
    var svg = d3.select(this.chart.nativeElement);
    svg.selectAll('*').remove();

    this.chartHeight = this.el.nativeElement.children[0].offsetHeight;
    this.chartWidth = this.el.nativeElement.children[0].offsetWidth;

    var svg = d3.select('svg');
    svg.attr('height', this.el.nativeElement.children[0].offsetHeight);
    svg.attr('width', this.el.nativeElement.children[0].offsetWidth);

    var margin = { top: 20, right: 20, bottom: 20, left: 20 };
    var width = this.chartWidth - margin.left - margin.right;
    var height = this.chartHeight - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var colour = d3.scaleOrdinal(d3.schemeCategory20);
    var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    x.domain(dataset.map((d) => d.label ));
    y.domain([0, d3.max(dataset, (d) => d.value)]);

    g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y).ticks(10))
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Host Averages');

    var div = d3.select("body").append("div").attr("class", "toolTip");
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

    var bars = g.selectAll('.bar')
      .data(dataset)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('id', (d)=>d.label.replace(/ /g, ''))
        .attr('x', (d) =>  x(d.label))
        .attr('y', (d)  => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', (d) => height - y(d.value))
        .attr('fill', (d) => colour(d.label))
        .on("mousemove", (d) => {
          div.style("left", d3.event.pageX+10+"px");
          div.style("top", d3.event.pageY-25+"px");
          div.style("display", "inline-block");
          div.html('<strong>' + d.label + '</strong><br>' + (Math.abs(d.value)).toFixed(2).replace('.00','') +' Hosts')
          bars.attr('fill', 'grey');
          svg.selectAll('#' + d.label.replace(/ /g, '')).attr('fill', 'green');
        })
        .on('mouseout', (d) => {
          div.style("display", "none")
          dataset.map(element => {
            svg.selectAll('#' + element.label.replace(/ /g, '')).attr('fill', (element) => colour(element.label));
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
    let selection = this.appTracker.getCurrentSelection();
    if(selection) {
      this.genreStatsSubscription = this.xrayAPI.fetchGenreAvgs().subscribe((data: GenreStats[]) => {
        this.dataset = this.buildDataset(Array.from([selection]), data);
        this.buildGraph(this.dataset);
      });
    }
  }
  
  ngOnInit(): void {
    this.graphInit();
  }

}
